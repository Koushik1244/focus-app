export const calculateReward = (stake: number, duration: number) => {
  const multiplier = 1 + Math.pow(duration / 120, 1.5) * 1.5;
  return Number((stake * multiplier).toFixed(2));
};

export const getDurationMultiplier = (duration: number) => {
  return 1 + Math.pow(duration / 120, 1.5) * 1.5;
};

export const getStreakMultiplier = (streak: number) => {
  if (streak >= 7) {
    return 1.25;
  }

  if (streak >= 3) {
    return 1.1;
  }

  return 1;
};

export const getStreakBonusLabel = (streak: number) => {
  if (streak >= 7) {
    return '+25% streak bonus';
  }

  if (streak >= 3) {
    return '+10% streak bonus';
  }

  return null;
};

export const getRewardDetails = (stake: number, duration: number, streak: number) => {
  const baseReward = calculateReward(stake, duration);
  const baseMultiplier = getDurationMultiplier(duration);
  const streakMultiplier = getStreakMultiplier(streak);
  const finalReward = Number((baseReward * streakMultiplier).toFixed(2));
  const finalMultiplier = baseMultiplier * streakMultiplier;

  return {
    baseReward,
    streakMultiplier,
    finalReward,
    multiplierLabel: `${finalMultiplier.toFixed(1)}x`,
    streakBonusLabel: getStreakBonusLabel(streak),
  };
};
