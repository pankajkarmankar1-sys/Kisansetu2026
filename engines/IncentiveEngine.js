export function calculateIncentive(acres) {
  if (acres <= 25) return 500;

  if (acres <= 50) return 1000;

  if (acres <= 100) return 2500;

  if (acres <= 500) return 10000;

  return 25000;
}

export function getDriverRank(drivers) {
  return [...drivers].sort(
    (a, b) => b.acresCompleted - a.acresCompleted
  );
}
