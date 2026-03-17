import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { settleSession } from '../lib/api';
import { colors, headingFontFamily, radii } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const txHash = '0xabc...def123';
const confettiColors = ['#22c55e', '#34d399', '#86efac', '#4ade80'];

export default function ResultsScreen({ navigation, route }: Props) {
  const { focusScore, stake, success, sessionId, duration, reward, multiplierLabel } = route.params;
  const amountScale = useRef(new Animated.Value(0.9)).current;
  const rewardCount = useRef(new Animated.Value(0)).current;
  const pulseRing = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;
  const [displayReward, setDisplayReward] = useState(0);
  const finalReward = useMemo(() => Number(reward.toFixed(2)), [reward]);

  useEffect(() => {
    let listenerId: string | null = null;

    Animated.spring(amountScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    if (success) {
      listenerId = rewardCount.addListener(({ value }) => {
        setDisplayReward(Number(value.toFixed(2)));
      });

      Animated.timing(rewardCount, {
        toValue: finalReward,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseRing, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseRing, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      const burst = Animated.stagger(
        40,
        dotAnims.map((anim) =>
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        )
      );

      pulse.start();
      burst.start();

      return () => {
        amountScale.stopAnimation();
        rewardCount.stopAnimation();
        pulseRing.stopAnimation();
        dotAnims.forEach((anim) => anim.stopAnimation());
        if (listenerId) {
          rewardCount.removeListener(listenerId);
        }
        pulse.stop();
      };
    }

    setDisplayReward(finalReward);
    return () => {
      amountScale.stopAnimation();
      rewardCount.stopAnimation();
    };
  }, [amountScale, dotAnims, finalReward, pulseRing, rewardCount, success]);

  useEffect(() => {
    settleSession(sessionId, focusScore);
  }, [focusScore, sessionId]);

  const amountText = success ? `+$${displayReward.toFixed(2)} USDC` : `-$${stake} USDC`;
  const amountColor = success ? colors.accent : colors.error;

  const openTx = async () => {
    const url = 'https://sepolia.starkscan.co/tx/0xabcdef123';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
      return;
    }

    Alert.alert('Unavailable', 'Unable to open Starkscan on this device.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconArea}>
          {success ? (
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: pulseRing.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                  transform: [
                    {
                      scale: pulseRing.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }),
                    },
                  ],
                },
              ]}
            />
          ) : null}

          {success
            ? dotAnims.map((anim, index) => {
                const angle = (index / dotAnims.length) * Math.PI * 2;
                const translateX = anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.cos(angle) * 54],
                });
                const translateY = anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.sin(angle) * 54],
                });

                return (
                  <Animated.View
                    key={`dot-${index}`}
                    style={[
                      styles.confettiDot,
                      {
                        backgroundColor: confettiColors[index % confettiColors.length],
                        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        transform: [{ translateX }, { translateY }],
                      },
                    ]}
                  />
                );
              })
            : null}

          <View style={styles.iconWrap}>
            <Text style={[styles.iconText, { color: amountColor }]}>{success ? 'OK' : 'X'}</Text>
          </View>
        </View>

        <Text style={styles.title}>{success ? 'SESSION COMPLETE' : 'SESSION FAILED'}</Text>

        <Animated.Text
          style={[
            styles.amountText,
            {
              color: amountColor,
              transform: [{ scale: amountScale }],
            },
          ]}
        >
          {amountText}
        </Animated.Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>FOCUS SCORE</Text>
          <Text style={styles.cardValue}>{focusScore}%</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>RESULT</Text>
          <Text style={[styles.cardValue, { color: amountColor }]}>
            {success ? `+$${finalReward.toFixed(2)} USDC` : `-$${stake} USDC`}
          </Text>
          <Text style={styles.cardSubtext}>
            {duration} min session / {multiplierLabel}
          </Text>
        </View>

        <Pressable style={styles.linkCard} onPress={openTx}>
          <Text style={styles.linkLabel}>STARKSCAN TX</Text>
          <Text style={styles.linkValue}>{txHash}</Text>
        </Pressable>

        <View style={styles.spacer} />

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        >
          <Text style={styles.primaryButtonText}>START NEW SESSION</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconArea: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pulseRing: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  confettiDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconWrap: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
    fontFamily: headingFontFamily,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontFamily: headingFontFamily,
    letterSpacing: 1.2,
    marginBottom: 16,
    textAlign: 'center',
  },
  amountText: {
    fontSize: 38,
    fontFamily: headingFontFamily,
    marginBottom: 26,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 14,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: headingFontFamily,
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  cardValue: {
    color: colors.textPrimary,
    fontSize: 30,
    fontFamily: headingFontFamily,
  },
  cardSubtext: {
    color: colors.textSecondary,
    marginTop: 8,
    fontSize: 12,
  },
  linkCard: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  linkLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: headingFontFamily,
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  linkValue: {
    color: colors.accent,
    fontSize: 16,
    fontFamily: headingFontFamily,
  },
  spacer: {
    flex: 1,
  },
  primaryButton: {
    width: '100%',
    minHeight: 62,
    borderRadius: radii.card,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#041109',
    fontSize: 18,
    fontFamily: headingFontFamily,
  },
});
