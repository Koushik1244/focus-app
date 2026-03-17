import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import CircularProgress from '../components/CircularProgress';
import { colors, headingFontFamily, radii } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Session'>;

const SCORE_TICK_MS = 5000;

export default function SessionScreen({ navigation, route }: Props) {
  const { duration, stake, sessionId, reward, multiplierLabel, streakBonusLabel } = route.params;
  const totalSeconds = duration * 60;
  const [permission, requestPermission] = useCameraPermissions();
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [focusScore, setFocusScore] = useState(93);
  const [screenScore, setScreenScore] = useState(95);
  const [gazeScore, setGazeScore] = useState(91);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (permission && !permission.granted) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          navigation.replace('Results', {
            focusScore,
            stake,
            success: true,
            sessionId,
            duration,
            reward,
            multiplierLabel,
          });
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, focusScore, multiplierLabel, navigation, permission, reward, sessionId, stake]);

  useEffect(() => {
    const scoreTimer = setInterval(() => {
      const nextScreen = 85 + Math.floor(Math.random() * 16);
      const nextGaze = 85 + Math.floor(Math.random() * 16);
      const nextFocus = Math.round((nextScreen + nextGaze) / 2);

      setScreenScore(nextScreen);
      setGazeScore(nextGaze);
      setFocusScore(nextFocus);

      scoreScale.setValue(0.96);
      Animated.spring(scoreScale, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }, SCORE_TICK_MS);

    return () => {
      clearInterval(scoreTimer);
      scoreScale.stopAnimation();
    };
  }, [scoreScale]);

  useEffect(() => {
    const completion = (totalSeconds - secondsLeft) / totalSeconds;
    Animated.timing(progressAnim, {
      toValue: completion,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    return () => {
      progressAnim.stopAnimation();
    };
  }, [progressAnim, secondsLeft, totalSeconds]);

  const scoreColor = focusScore >= 90 ? colors.accent : focusScore >= 85 ? '#eab308' : colors.error;
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const clock = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const cameraGranted = permission?.granted === true;
  const awaitingPermission = !permission;
  const quitSession = () => {
    navigation.replace('Results', {
      focusScore: 0,
      stake,
      success: false,
      sessionId,
      duration,
      reward,
      multiplierLabel,
    });
  };

  const permissionContent = useMemo(() => {
    if (awaitingPermission) {
      return (
        <View style={styles.permissionState}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.permissionText}>Requesting camera access...</Text>
        </View>
      );
    }

    if (!cameraGranted) {
      return (
        <View style={styles.permissionState}>
          <Text style={styles.permissionEye}>O</Text>
          <Text style={styles.permissionTitle}>Camera required for focus monitoring</Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Allow Camera</Text>
          </Pressable>
        </View>
      );
    }

    return null;
  }, [awaitingPermission, cameraGranted, requestPermission]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {cameraGranted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="front" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.cameraFallback]} />
      )}
      <View style={styles.overlay} />

      {permissionContent}

      {cameraGranted ? (
        <View style={styles.container}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE FOCUS SESSION</Text>
          </View>

          <View style={styles.centerBlock}>
            <Text style={styles.timer}>{clock}</Text>

            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            <Animated.View style={{ transform: [{ scale: scoreScale }] }}>
              <CircularProgress
                size={180}
                strokeWidth={12}
                progress={focusScore}
                color={scoreColor}
                backgroundColor="rgba(255,255,255,0.1)"
              >
                <Text style={[styles.scoreValue, { color: scoreColor }]}>{focusScore}%</Text>
                <Text style={styles.scoreLabel}>focus score</Text>
              </CircularProgress>
            </Animated.View>

            <View style={styles.scoreRow}>
              <View style={styles.scoreMiniCard}>
                <Text style={styles.scoreMiniLabel}>SCREEN SCORE</Text>
                <Text style={styles.scoreMiniValue}>{screenScore}%</Text>
              </View>
              <View style={styles.scoreMiniCard}>
                <Text style={styles.scoreMiniLabel}>GAZE SCORE</Text>
                <Text style={styles.scoreMiniValue}>{gazeScore}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomCard}>
            <View style={styles.bottomMetrics}>
              <View>
                <Text style={styles.bottomLabel}>STAKED</Text>
                <Text style={styles.bottomValue}>${stake}</Text>
              </View>
              <View>
                <Text style={styles.bottomLabel}>REWARD</Text>
                <Text style={styles.bottomValue}>${reward.toFixed(2)}</Text>
              </View>
              <View>
                <Text style={styles.bottomLabel}>MULTIPLIER</Text>
                <Text style={styles.bottomValue}>{multiplierLabel}</Text>
              </View>
            </View>

            {streakBonusLabel ? <Text style={styles.streakText}>{streakBonusLabel}</Text> : null}

            <Pressable style={styles.quitButton} onPress={quitSession}>
              <Text style={styles.quitButtonText}>QUIT SESSION</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraFallback: {
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  permissionState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  permissionEye: {
    color: colors.accent,
    fontSize: 40,
    fontFamily: headingFontFamily,
    marginBottom: 12,
  },
  permissionTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontFamily: headingFontFamily,
    textAlign: 'center',
    marginBottom: 18,
  },
  permissionText: {
    color: colors.textSecondary,
    marginTop: 12,
  },
  permissionButton: {
    minHeight: 52,
    borderRadius: radii.card,
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButtonText: {
    color: '#051109',
    fontSize: 16,
    fontFamily: headingFontFamily,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  liveBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8,8,8,0.86)',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 6,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    marginRight: 8,
  },
  liveText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: headingFontFamily,
  },
  centerBlock: {
    alignItems: 'center',
  },
  timer: {
    color: colors.accent,
    fontSize: 72,
    fontFamily: headingFontFamily,
    marginBottom: 16,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
    marginBottom: 26,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  scoreValue: {
    fontSize: 38,
    fontFamily: headingFontFamily,
  },
  scoreLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  scoreRow: {
    marginTop: 22,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  scoreMiniCard: {
    flex: 1,
    backgroundColor: 'rgba(8,8,8,0.86)',
    borderRadius: radii.cardSmall,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  scoreMiniLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: headingFontFamily,
    marginBottom: 8,
  },
  scoreMiniValue: {
    color: colors.textPrimary,
    fontSize: 28,
    fontFamily: headingFontFamily,
  },
  bottomCard: {
    backgroundColor: 'rgba(8,8,8,0.92)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  bottomMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: headingFontFamily,
    marginBottom: 8,
  },
  bottomValue: {
    color: colors.textPrimary,
    fontSize: 26,
    fontFamily: headingFontFamily,
  },
  streakText: {
    color: colors.gold,
    fontSize: 12,
    fontFamily: headingFontFamily,
    marginTop: 12,
  },
  quitButton: {
    minHeight: 58,
    borderRadius: radii.cardSmall,
    backgroundColor: '#220909',
    borderWidth: 1,
    borderColor: '#5c1717',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  quitButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontFamily: headingFontFamily,
  },
});
