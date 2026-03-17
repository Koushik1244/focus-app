import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import TabBar from '../components/TabBar';
import { leaderboardAllTime, leaderboardWeekly } from '../lib/mockData';
import { colors, headingFontFamily, radii } from '../lib/theme';
import { AppTab, LeaderboardEntry } from '../lib/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;
type LeaderboardMode = 'Weekly' | 'All Time';

export default function LeaderboardScreen({ navigation }: Props) {
  const [mode, setMode] = useState<LeaderboardMode>('Weekly');
  const [toggleWidth, setToggleWidth] = useState(0);
  const sliderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(sliderAnim, {
      toValue: mode === 'Weekly' ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();

    return () => {
      sliderAnim.stopAnimation();
    };
  }, [mode, sliderAnim]);

  const entries = useMemo<LeaderboardEntry[]>(
    () => (mode === 'Weekly' ? leaderboardWeekly : leaderboardAllTime),
    [mode]
  );
  const podium = entries.slice(0, 3);
  const list = entries.slice(3);
  const handleLayout = (event: LayoutChangeEvent) => {
    setToggleWidth(event.nativeEvent.layout.width / 2);
  };

  const handleTabNavigate = (tab: AppTab) => {
    if (tab === 'HOME') {
      navigation.navigate('Home');
      return;
    }

    if (tab === 'STATS') {
      navigation.navigate('Stats');
      return;
    }

    if (tab === 'PROFILE') {
      navigation.navigate('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>LEADERBOARD</Text>

        <View style={styles.toggleShell} onLayout={handleLayout}>
          {toggleWidth ? (
            <Animated.View
              style={[
                styles.toggleIndicator,
                {
                  width: toggleWidth - 6,
                  transform: [
                    {
                      translateX: sliderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [3, toggleWidth],
                      }),
                    },
                  ],
                },
              ]}
            />
          ) : null}
          {(['Weekly', 'All Time'] as LeaderboardMode[]).map((item) => (
            <Text key={item} style={[styles.toggleLabel, mode === item ? styles.toggleLabelActive : null]} onPress={() => setMode(item)}>
              {item}
            </Text>
          ))}
        </View>

        <View style={styles.podiumRow}>
          {podium.map((entry, index) => {
            const colorsByRank = [colors.gold, colors.silver, colors.bronze];
            const heights = [170, 140, 120];
            return (
              <View key={entry.wallet} style={styles.podiumItem}>
                <View style={[styles.podiumBadge, { backgroundColor: colorsByRank[index] }]}>
                  <Text style={styles.podiumBadgeText}>{entry.initials}</Text>
                </View>
                <Text style={styles.podiumWallet}>{entry.wallet}</Text>
                <View style={[styles.podiumBlock, { height: heights[index] }]}>
                  <Text style={styles.podiumRank}>#{entry.rank}</Text>
                  <Text style={styles.podiumEarned}>${entry.earned.toFixed(1)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.listWrap}>
          {list.map((entry) => (
            <View
              key={entry.wallet}
              style={[styles.row, entry.isCurrentUser ? styles.currentUserRow : null]}
            >
              <Text style={styles.rank}>#{entry.rank}</Text>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{entry.initials}</Text>
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.wallet}>{entry.wallet}</Text>
                <Text style={styles.rowMeta}>{entry.sessions} sessions</Text>
              </View>
              <Text style={styles.earned}>${entry.earned.toFixed(1)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <TabBar activeTab="SOCIAL" onNavigate={handleTabNavigate} />
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
  toggleShell: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    padding: 3,
    marginBottom: 26,
  },
  toggleIndicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(34,197,94,0.14)',
  },
  toggleLabel: {
    flex: 1,
    color: '#666666',
    textAlign: 'center',
    paddingVertical: 12,
    fontFamily: headingFontFamily,
    zIndex: 1,
  },
  toggleLabelActive: {
    color: colors.accent,
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
  },
  podiumBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  podiumBadgeText: {
    color: '#111111',
    fontFamily: headingFontFamily,
    fontSize: 18,
  },
  podiumWallet: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 8,
  },
  podiumBlock: {
    width: '88%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.cardSmall,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  podiumRank: {
    color: colors.textMuted,
    fontFamily: headingFontFamily,
    fontSize: 14,
    marginBottom: 8,
  },
  podiumEarned: {
    color: colors.textPrimary,
    fontFamily: headingFontFamily,
    fontSize: 22,
    textAlign: 'center',
  },
  listWrap: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 16,
  },
  currentUserRow: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  rank: {
    color: colors.textMuted,
    fontFamily: headingFontFamily,
    fontSize: 16,
    width: 42,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.textPrimary,
    fontFamily: headingFontFamily,
  },
  rowCopy: {
    flex: 1,
  },
  wallet: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  rowMeta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  earned: {
    color: colors.accent,
    fontFamily: headingFontFamily,
    fontSize: 18,
  },
});
