import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import SessionCard from '../components/SessionCard';
import TabBar from '../components/TabBar';
import { fetchSessionHistory } from '../lib/api';
import { colors, headingFontFamily, radii } from '../lib/theme';
import { AppTab, SessionRecord } from '../lib/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSessions = async () => {
      const history = await fetchSessionHistory('demo_wallet');
      if (!mounted) {
        return;
      }

      setSessions(history.sessions);
      setStreak(history.streak);
      setLoading(false);
    };

    loadSessions();

    return () => {
      mounted = false;
    };
  }, []);

  const totalEarned = useMemo(
    () =>
      sessions.reduce((sum, session) => {
        if (!session.success) {
          return sum;
        }

        return sum + (session.reward ?? 0);
      }, 0),
    [sessions]
  );

  const successRate = useMemo(() => {
    if (!sessions.length) {
      return 0;
    }

    return Math.round((sessions.filter((session) => session.success).length / sessions.length) * 100);
  }, [sessions]);

  const handleTabNavigate = (tab: AppTab) => {
    if (tab === 'HOME') {
      navigation.navigate('Home');
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>FS</Text>
          </View>
          <Text style={styles.name}>Focusss Member</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Premium Member</Text>
          </View>
        </View>

        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>F</Text>
          <Text style={styles.streakValue}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{successRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${totalEarned.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>
          <Text style={styles.sectionLink}>View All</Text>
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          sessions.map((session) => <SessionCard key={session.id} session={session} />)
        )}
      </ScrollView>

      <TabBar activeTab="PROFILE" onNavigate={handleTabNavigate} />
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
    paddingTop: 8,
    paddingBottom: 120,
  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: 28,
    fontFamily: headingFontFamily,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 28,
    fontFamily: headingFontFamily,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.22)',
  },
  badgeText: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: headingFontFamily,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  streakIcon: {
    color: colors.accent,
    fontSize: 18,
    fontFamily: headingFontFamily,
    marginBottom: 8,
  },
  streakValue: {
    color: colors.textPrimary,
    fontSize: 58,
    fontFamily: headingFontFamily,
  },
  streakLabel: {
    color: '#5f5f5f',
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.cardSmall,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontFamily: headingFontFamily,
    marginBottom: 6,
  },
  statLabel: {
    color: '#5a5a5a',
    fontSize: 11,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: headingFontFamily,
    letterSpacing: 1.5,
  },
  sectionLink: {
    color: '#757575',
    fontSize: 12,
    fontFamily: headingFontFamily,
  },
  loadingState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});
