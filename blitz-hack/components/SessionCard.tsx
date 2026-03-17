import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getDurationMultiplier } from '../lib/rewards';
import { colors, headingFontFamily, radii } from '../lib/theme';
import { SessionRecord } from '../lib/types';

type Props = {
  session: SessionRecord;
};

export default function SessionCard({ session }: Props) {
  const sessionDate = new Date(session.createdAt);
  const dateText = `${sessionDate.toLocaleDateString()} - ${sessionDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
  const fallbackReward = Number((session.stake * getDurationMultiplier(session.duration)).toFixed(2));
  const amountText =
    session.success === null
      ? `$${session.stake} pending`
      : session.success
        ? `+$${(session.reward ?? fallbackReward).toFixed(2)}`
        : `-$${session.stake}`;

  return (
    <View style={[styles.card, session.success === false ? styles.cardFail : null]}>
      <View style={styles.left}>
        <Text style={styles.date}>{dateText}</Text>
        <Text style={styles.meta}>{session.duration} min focus block</Text>
      </View>
      <View style={styles.right}>
        <View
          style={[
            styles.badge,
            session.success ? styles.successBadge : session.success === false ? styles.failBadge : styles.pendingBadge,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              session.success
                ? styles.successText
                : session.success === false
                  ? styles.failText
                  : styles.pendingText,
            ]}
          >
            {session.success === null ? 'PENDING' : session.success ? 'SUCCESS' : 'FAILED'}
          </Text>
        </View>
        <Text style={[styles.amount, { color: session.success ? colors.accent : colors.error }]}>
          {amountText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardFail: {
    borderColor: '#2b1212',
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  date: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: headingFontFamily,
  },
  right: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginBottom: 10,
  },
  successBadge: {
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  failBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(245,158,11,0.12)',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: headingFontFamily,
  },
  successText: {
    color: colors.accent,
  },
  failText: {
    color: colors.error,
  },
  pendingText: {
    color: colors.gold,
  },
  amount: {
    fontSize: 16,
    fontFamily: headingFontFamily,
  },
});
