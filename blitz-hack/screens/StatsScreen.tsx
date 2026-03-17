import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import { RootStackParamList } from '../App';
import SessionCard from '../components/SessionCard';
import TabBar from '../components/TabBar';
import { fetchSessionHistory } from '../lib/api';
import { colors, headingFontFamily, radii } from '../lib/theme';
import { AppTab, SessionRecord } from '../lib/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

export default function StatsScreen({ navigation }: Props) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [chartProgress, setChartProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    let listenerId: string | null = null;

    const load = async () => {
      const history = await fetchSessionHistory('demo_wallet');
      if (!mounted) {
        return;
      }

      setSessions(history.sessions);
      setStreak(history.streak);
    };

    load();

    listenerId = progressAnim.addListener(({ value }) => {
      setChartProgress(value);
    });

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start();

    return () => {
      mounted = false;
      if (listenerId) {
        progressAnim.removeListener(listenerId);
      }
      progressAnim.stopAnimation();
    };
  }, [progressAnim]);

  const successCount = sessions.filter((session) => session.success).length;
  const failCount = sessions.filter((session) => session.success === false).length;
  const successRate = sessions.length ? successCount / sessions.length : 0;
  const totalEarned = sessions.reduce((sum, session) => sum + (session.success ? session.reward ?? 0 : 0), 0);
  const recentSessions = sessions.slice(0, 3);

  const chart = useMemo(() => {
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const successOffset = circumference - circumference * successRate * chartProgress;
    const failOffset = circumference - circumference * Math.max(0, 1 - successRate) * chartProgress;

    return { radius, circumference, successOffset, failOffset };
  }, [chartProgress, successRate]);

  const weeklyBars = Array.from({ length: 7 }, (_, index) => {
    const session = sessions[index];
    return {
      label: `D${index + 1}`,
      height: session ? 40 + index * 8 : 22,
      success: session?.success ?? false,
    };
  });

  const handleTabNavigate = (tab: AppTab) => {
    if (tab === 'HOME') {
      navigation.navigate('Home');
      return;
    }

    if (tab === 'SOCIAL') {
      navigation.navigate('Leaderboard');
      return;
    }

    if (tab === 'PROFILE') {
      navigation.navigate('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>YOUR STATS</Text>

        <View style={styles.chartCard}>
          <View style={styles.chartWrap}>
            <Svg width={150} height={150}>
              <Circle
                cx={75}
                cy={75}
                r={chart.radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={16}
                fill="none"
              />
              <Circle
                cx={75}
                cy={75}
                r={chart.radius}
                stroke={colors.accent}
                strokeWidth={16}
                fill="none"
                strokeDasharray={`${chart.circumference} ${chart.circumference}`}
                strokeDashoffset={chart.successOffset}
                strokeLinecap="round"
                rotation="-90"
                origin="75,75"
              />
              <Circle
                cx={75}
                cy={75}
                r={chart.radius}
                stroke={colors.error}
                strokeWidth={8}
                fill="none"
                strokeDasharray={`${chart.circumference} ${chart.circumference}`}
                strokeDashoffset={chart.failOffset}
                strokeLinecap="round"
                rotation={`${-90 + successRate * 360}`}
                origin="75,75"
              />
            </Svg>
            <View style={styles.chartCenter}>
              <Text style={styles.chartValue}>{Math.round(successRate * 100)}%</Text>
              <Text style={styles.chartLabel}>success</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={styles.gridValue}>{sessions.length}</Text>
            <Text style={styles.gridLabel}>Total Sessions</Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.gridValue}>{Math.round(successRate * 100)}%</Text>
            <Text style={styles.gridLabel}>Success Rate</Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.gridValue}>${totalEarned.toFixed(2)}</Text>
            <Text style={styles.gridLabel}>Total Earned</Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.gridValue}>{streak}</Text>
            <Text style={styles.gridLabel}>Best Streak</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>PERFORMANCE OVER TIME</Text>
        <View style={styles.barCard}>
          <View style={styles.barRow}>
            {weeklyBars.map((bar) => (
              <View key={bar.label} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: bar.height,
                      backgroundColor: bar.success ? colors.accent : colors.error,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>RECENT RESULTS</Text>
        {recentSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}

        <Text style={styles.sectionFoot}>
          Successes: {successCount} / Fails: {failCount}
        </Text>
      </ScrollView>
      <TabBar activeTab="STATS" onNavigate={handleTabNavigate} />
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
    paddingTop: 18,
    paddingBottom: 120,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 34,
    fontFamily: headingFontFamily,
    marginBottom: 18,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 18,
  },
  chartWrap: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartValue: {
    color: colors.textPrimary,
    fontSize: 30,
    fontFamily: headingFontFamily,
  },
  chartLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  gridCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.cardSmall,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 12,
  },
  gridValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontFamily: headingFontFamily,
    marginBottom: 6,
  },
  gridLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: headingFontFamily,
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  barCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 22,
  },
  barRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 140,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 18,
    borderRadius: 8,
    marginBottom: 10,
  },
  barLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: headingFontFamily,
  },
  sectionFoot: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
