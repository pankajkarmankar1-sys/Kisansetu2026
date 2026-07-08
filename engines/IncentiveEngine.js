// engines/incentiveEngine.js


export function calculateIncentive(acres) {

  const area = Number(acres || 0);


  if (area <= 25) return 500;

  if (area <= 50) return 1000;

  if (area <= 100) return 2500;

  if (area <= 500) return 10000;

  return 25000;

}





export function getDriverRank(drivers = []) {

  return [...drivers].sort(
    (a, b) =>
      Number(b.acresCompleted || 0) -
      Number(a.acresCompleted || 0)
  );

}





export function getDriverLevel(acres) {

  const area = Number(acres || 0);


  if (area >= 500)
    return "🏆 Master Driver";


  if (area >= 100)
    return "🥇 Expert Driver";


  if (area >= 50)
    return "🥈 Pro Driver";


  return "🌱 New Driver";

}
