import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import TabBar from '../components/TabBar';
import { createSession, fetchSessionHistory } from '../lib/api';
import { colors, headingFontFamily, radii } from '../lib/theme';
import { getRewardDetails } from '../lib/rewards';
import { AppTab } from '../lib/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const stakeOptions = [1, 5, 10] as const;

export default function HomeScreen({ navigation }: Props) {
  const [duration, setDuration] = useState(30);
  const [stake, setStake] = useState<(typeof stakeOptions)[number]>(5);
  const [submitting, setSubmitting] = useState(false);
  const [loadingStreak, setLoadingStreak] = useState(true);
  const [streak, setStreak] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    entrance.start();
    pulse.start();

    return () => {
      fadeAnim.stopAnimation();
      translateAnim.stopAnimation();
      pulseAnim.stopAnimation();
      pulse.stop();
    };
  }, [fadeAnim, pulseAnim, translateAnim]);

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      const history = await fetchSessionHistory('demo_wallet');
      if (!mounted) {
        return;
      }

      setStreak(history.streak);
      setLoadingStreak(false);
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const rewardDetails = useMemo(() => getRewardDetails(stake, duration, streak), [duration, stake, streak]);
  const rewardPerMinute = useMemo(
    () => (rewardDetails.finalReward / duration).toFixed(3),
    [duration, rewardDetails.finalReward]
  );

  const handleStart = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    const sessionId = await createSession('demo_wallet', duration, stake);
    navigation.navigate('Session', {
      duration,
      stake,
      sessionId,
      reward: rewardDetails.finalReward,
      multiplierLabel: rewardDetails.multiplierLabel,
      streakBonusLabel: rewardDetails.streakBonusLabel,
    });
    setSubmitting(false);
  };

  const handleTabNavigate = (tab: AppTab) => {
    if (tab === 'PROFILE') {
      navigation.navigate('Profile');
      return;
    }

    if (tab === 'STATS') {
      navigation.navigate('Stats');
      return;
    }

    if (tab === 'SOCIAL') {
      navigation.navigate('Leaderboard');
    }
  };

  const streakBadgeStyle =
    streak >= 7 ? styles.streakBadgeGold : streak >= 3 ? styles.streakBadgeGreen : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedScreen,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>F</Text>
              </View>
              <Text style={styles.wordmark}>focusss</Text>
            </View>

            <Pressable style={styles.walletPill} onPress={() => navigation.navigate('Profile')}>
              <View style={styles.walletDot} />
              <Text style={styles.walletText}>0x0222...1C3a</Text>
            </Pressable>
          </View>

          <View style={styles.heroBlock}>
            <Text style={styles.heroTitle}>Stake to focus.</Text>
            <Text style={styles.heroSubtitle}>Earn if you finish.</Text>
            <Text style={styles.heroCaption}>
              Focusss turns accountability into a live onchain commitment.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>SESSION DURATION</Text>
              <Text style={styles.durationReadout}>
                <Text style={styles.durationValue}>{duration}</Text> min
              </Text>
            </View>

            <Slider
              value={duration}
              minimumValue={10}
              maximumValue={120}
              step={5}
              onValueChange={(value) => setDuration(Math.round(value))}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor="#161616"
              thumbTintColor={colors.accent}
              style={styles.slider}
            />

            <View style={styles.sliderLabels}>
              {['10m', '30m', '60m', '90m', '120m'].map((label) => (
                <Text key={label} style={styles.sliderLabel}>
                  {label}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>STAKE AMOUNT</Text>
            <View style={styles.stakeRow}>
              {stakeOptions.map((amount) => {
                const active = amount === stake;
                return (
                  <Pressable
                    key={amount}
                    style={[styles.stakeChip, active ? styles.stakeChipActive : null]}
                    onPress={() => setStake(amount)}
                  >
                    <Text style={[styles.stakeChipText, active ? styles.stakeChipTextActive : null]}>
                      ${amount}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.rewardCard}>
            <View style={styles.rewardCopy}>
              <Text style={styles.cardLabel}>POTENTIAL REWARD</Text>
              <Animated.Text style={[styles.rewardValue, { transform: [{ scale: pulseAnim }] }]}>
                ${rewardDetails.finalReward.toFixed(2)}
              </Animated.Text>
              <Text style={styles.rewardMeta}>${rewardPerMinute} per minute</Text>
            </View>

            <View style={styles.rewardPanel}>
              <Text style={styles.rewardPanelValue}>{rewardDetails.multiplierLabel}</Text>
              <Text style={styles.rewardPanelLabel}>reward multiplier</Text>
            </View>
          </View>

          {loadingStreak ? (
            <View style={styles.loadingBadge}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : rewardDetails.streakBonusLabel ? (
            <View style={[styles.streakBadge, streakBadgeStyle]}>
              <Text style={[styles.streakBadgeText, streak >= 7 ? styles.streakBadgeTextDark : null]}>
                {rewardDetails.streakBonusLabel} {streak >= 7 ? '++' : '+'}
              </Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && !submitting ? styles.startButtonPressed : null,
              submitting ? styles.startButtonDisabled : null,
            ]}
            onPress={handleStart}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#041109" />
            ) : (
              <>
                <Text style={styles.startButtonText}>START SESSION</Text>
                <Text style={styles.startButtonMeta}>{duration} minutes - ${stake} staked</Text>
              </>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
      <TabBar activeTab="HOME" onNavigate={handleTabNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 26 : 10,
    paddingBottom: 128,
  },
  animatedScreen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#010101',
    fontSize: 18,
    fontWeight: '900',
  },
  wordmark: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: '900',
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  walletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: 8,
  },
  walletText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  heroBlock: {
    marginBottom: 24,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: '400',
    fontFamily: headingFontFamily,
    letterSpacing: -0.9,
  },
  heroSubtitle: {
    color: '#6c6c6c',
    fontSize: 40,
    fontWeight: '400',
    fontFamily: headingFontFamily,
    letterSpacing: -0.9,
  },
  heroCaption: {
    color: '#4d4d4d',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 21,
    maxWidth: 290,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.card,
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: headingFontFamily,
    letterSpacing: 1.4,
  },
  durationReadout: {
    color: '#8d8d8d',
    fontSize: 14,
  },
  durationValue: {
    color: colors.accent,
    fontSize: 32,
    fontFamily: headingFontFamily,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    color: colors.textFaint,
    fontSize: 11,
    fontFamily: headingFontFamily,
  },
  stakeRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  stakeChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: radii.cardSmall,
    backgroundColor: '#0d0d0d',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  stakeChipActive: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderColor: colors.accent,
  },
  stakeChipText: {
    color: '#666666',
    fontSize: 24,
    fontFamily: headingFontFamily,
  },
  stakeChipTextActive: {
    color: colors.accent,
  },
  rewardCard: {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardCopy: {
    flex: 1,
    paddingRight: 12,
  },
  rewardValue: {
    color: colors.accent,
    fontSize: 38,
    fontFamily: headingFontFamily,
    marginTop: 10,
    marginBottom: 4,
  },
  rewardMeta: {
    color: '#4d4d4d',
    fontSize: 13,
  },
  rewardPanel: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.18)',
    alignItems: 'center',
  },
  rewardPanelValue: {
    color: '#d7ffe5',
    fontSize: 22,
    fontFamily: headingFontFamily,
    marginBottom: 4,
  },
  rewardPanelLabel: {
    color: '#437c55',
    fontSize: 11,
    textAlign: 'center',
  },
  loadingBadge: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  streakBadgeGreen: {
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  streakBadgeGold: {
    backgroundColor: 'rgba(245,158,11,0.9)',
  },
  streakBadgeText: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: headingFontFamily,
  },
  streakBadgeTextDark: {
    color: '#171717',
  },
  startButton: {
    minHeight: 66,
    borderRadius: radii.card,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  startButtonPressed: {
    transform: [{ scale: 0.987 }],
  },
  startButtonDisabled: {
    opacity: 0.85,
  },
  startButtonText: {
    color: '#041109',
    fontSize: 18,
    fontFamily: headingFontFamily,
  },
  startButtonMeta: {
    color: 'rgba(4,17,9,0.66)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
});
