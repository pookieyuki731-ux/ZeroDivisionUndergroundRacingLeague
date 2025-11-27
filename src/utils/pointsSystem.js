export const POINTS_SYSTEM = {
    1: 22,
    2: 18,
    3: 15,
    4: 12,
    5: 10,
    6: 8,
    7: 6,
    8: 4,
    9: 2,
    10: 1
};

export const calculatePoints = (position) => {
    return POINTS_SYSTEM[position] || 0;
};
