export type UnitSystem = "metric" | "imperial";

const KG_PER_STONE = 6.35029;
const KG_PER_LB = 0.453592;
const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
const LBS_PER_STONE = 14;

// --- Weight conversions ---

export function kgToLbs(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

export function kgToStoneLbs(kg: number): { stone: number; lbs: number } {
  const totalLbs = kgToLbs(kg);
  const stone = Math.floor(totalLbs / LBS_PER_STONE);
  const lbs = totalLbs - stone * LBS_PER_STONE;
  return { stone, lbs: Math.round(lbs * 10) / 10 };
}

export function stoneLbsToKg(stone: number, lbs: number): number {
  const totalLbs = stone * LBS_PER_STONE + lbs;
  return lbsToKg(totalLbs);
}

// --- Height / length conversions ---

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = Math.round(totalInches - feet * INCHES_PER_FOOT);
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * INCHES_PER_FOOT + inches;
  return inchesToCm(totalInches);
}

// --- Display formatters ---

export function formatWeightDisplay(kg: number, unitSystem: UnitSystem): string {
  if (unitSystem === "imperial") {
    const { stone, lbs } = kgToStoneLbs(kg);
    return `${stone}st ${Math.round(lbs)}lb`;
  }
  return `${kg.toFixed(1)} kg`;
}

export function formatHeightDisplay(cm: number, unitSystem: UnitSystem): string {
  if (unitSystem === "imperial") {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${inches}"`;
  }
  return `${cm} cm`;
}

export function formatWeightChangeDisplay(kg: number, unitSystem: UnitSystem): string {
  if (unitSystem === "imperial") {
    const lbs = kgToLbs(Math.abs(kg));
    return `${lbs.toFixed(1)} lb`;
  }
  return `${Math.abs(kg).toFixed(1)} kg`;
}

export function formatMeasurementDisplay(cm: number, unitSystem: UnitSystem): string {
  if (unitSystem === "imperial") {
    const inches = cmToInches(cm);
    return `${inches.toFixed(1)} in`;
  }
  return `${cm} cm`;
}

export function formatMeasurementChangeDisplay(cm: number, unitSystem: UnitSystem): string {
  if (unitSystem === "imperial") {
    const inches = cmToInches(cm);
    return `${inches.toFixed(1)} in`;
  }
  return `${cm.toFixed(1)} cm`;
}

export function measurementUnit(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "in" : "cm";
}

export function weightChartValue(kg: number, unitSystem: UnitSystem): number {
  if (unitSystem === "imperial") {
    const { stone, lbs } = kgToStoneLbs(kg);
    return stone * LBS_PER_STONE + lbs;
  }
  return kg;
}

export function weightChartLabel(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "lb" : "kg";
}
