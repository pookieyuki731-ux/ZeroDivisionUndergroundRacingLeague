export const PRIZE_DISTRIBUTION = {
    1: 0.35,
    2: 0.20,
    3: 0.13,
    4: 0.08,
    5: 0.06,
    6: 0.05,
    7: 0.04,
    8: 0.03,
    9: 0.03,
    10: 0.03
};

export const calculatePrize = (totalPrizePool, position) => {
    const percentage = PRIZE_DISTRIBUTION[position] || 0;
    return totalPrizePool * percentage;
};
