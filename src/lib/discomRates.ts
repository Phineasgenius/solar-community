// NOTE: These slab rates are illustrative/mock figures modeled on the
// *structure* of common Indian DISCOM domestic tariffs (fixed charge + rising
// per-unit slabs). They are for demo/hackathon purposes only and are NOT the
// live, official tariff schedule for any DISCOM. Swap in real tariff-order
// numbers before using this for anything beyond a prototype.

export type Slab = {
  upTo: number | null; // null = no upper bound
  rate: number; // ₹ per unit (kWh) for this slab
};

export type Discom = {
  id: string;
  name: string;
  shortName: string;
  state: string;
  fixedCharge: number; // ₹ per month
  slabs: Slab[];
};

export const DISCOMS: Discom[] = [
  {
    id: "bses-rajdhani",
    name: "BSES Rajdhani Power Ltd.",
    shortName: "BSES Rajdhani",
    state: "Delhi",
    fixedCharge: 140,
    slabs: [
      { upTo: 200, rate: 3.0 },
      { upTo: 400, rate: 4.5 },
      { upTo: 800, rate: 6.5 },
      { upTo: 1200, rate: 7.0 },
      { upTo: null, rate: 8.0 },
    ],
  },
  {
    id: "bescom",
    name: "Bangalore Electricity Supply Company",
    shortName: "BESCOM",
    state: "Karnataka",
    fixedCharge: 120,
    slabs: [
      { upTo: 100, rate: 4.15 },
      { upTo: 200, rate: 5.6 },
      { upTo: 300, rate: 7.15 },
      { upTo: 500, rate: 8.2 },
      { upTo: null, rate: 8.9 },
    ],
  },
  {
    id: "msedcl",
    name: "Maharashtra State Electricity Distribution Co.",
    shortName: "MSEDCL",
    state: "Maharashtra",
    fixedCharge: 150,
    slabs: [
      { upTo: 100, rate: 4.71 },
      { upTo: 300, rate: 10.36 },
      { upTo: 500, rate: 13.15 },
      { upTo: null, rate: 14.7 },
    ],
  },
  {
    id: "tangedco",
    name: "Tamil Nadu Generation and Distribution Corp.",
    shortName: "TANGEDCO",
    state: "Tamil Nadu",
    fixedCharge: 100,
    slabs: [
      { upTo: 100, rate: 3.75 },
      { upTo: 200, rate: 4.6 },
      { upTo: 500, rate: 6.6 },
      { upTo: null, rate: 8.05 },
    ],
  },
  {
    id: "tsspdcl",
    name: "Telangana Southern Power Distribution Co.",
    shortName: "TSSPDCL",
    state: "Telangana",
    fixedCharge: 110,
    slabs: [
      { upTo: 100, rate: 3.75 },
      { upTo: 200, rate: 4.85 },
      { upTo: 400, rate: 6.75 },
      { upTo: null, rate: 7.7 },
    ],
  },
  {
    id: "cesc",
    name: "Calcutta Electric Supply Corporation",
    shortName: "CESC",
    state: "West Bengal",
    fixedCharge: 130,
    slabs: [
      { upTo: 100, rate: 5.85 },
      { upTo: 300, rate: 7.35 },
      { upTo: null, rate: 8.7 },
    ],
  },
];

/** ₹ bill for a given number of units under a slab structure (excl. fixed charge unless included=true) */
export function slabBillAmount(units: number, discom: Discom, includeFixed = true): number {
  if (units <= 0) return includeFixed ? discom.fixedCharge : 0;
  let remaining = units;
  let lowerBound = 0;
  let total = 0;
  for (const slab of discom.slabs) {
    const cap = slab.upTo ?? Infinity;
    const bandSize = cap - lowerBound;
    const unitsInBand = Math.min(remaining, bandSize);
    if (unitsInBand <= 0) break;
    total += unitsInBand * slab.rate;
    remaining -= unitsInBand;
    lowerBound = cap;
    if (remaining <= 0) break;
  }
  return total + (includeFixed ? discom.fixedCharge : 0);
}

export const UNITS_PER_KW_PER_DAY = 4; // rough India-wide rooftop/ground solar yield assumption
export const GRID_EMISSION_FACTOR_KG_PER_KWH = 0.82; // India CEA grid avg (illustrative)

export type VnmResult = {
  consumptionUnits: number;
  baseBill: number;
  generatedUnits: number;
  creditedUnits: number;
  postVnmBill: number;
  monthlySavings: number;
  savingsPercent: number;
  recommendedKw: number;
  carbonSavedTonsPerYear: number;
};

/**
 * Core VNM (Virtual Net Metering) engine.
 * Given a monthly bill amount and a DISCOM, back-solves approximate consumption,
 * then computes credited solar units from a subscribed share size, and
 * re-bills the residual consumption.
 */
export function calculateVnm(monthlyBillRupees: number, discom: Discom, subscribedKw: number): VnmResult {
  // Back-solve units from bill amount via binary search over the slab function.
  let lo = 0;
  let hi = 5000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const amount = slabBillAmount(mid, discom);
    if (amount > monthlyBillRupees) hi = mid;
    else lo = mid;
  }
  const consumptionUnits = Math.round(lo);

  const generatedUnits = Math.round(subscribedKw * UNITS_PER_KW_PER_DAY * 30);
  const creditedUnits = Math.min(generatedUnits, consumptionUnits);
  const postVnmBill = Math.round(slabBillAmount(Math.max(0, consumptionUnits - creditedUnits), discom));
  const baseBill = Math.round(slabBillAmount(consumptionUnits, discom));
  const monthlySavings = Math.max(0, baseBill - postVnmBill);
  const savingsPercent = baseBill > 0 ? Math.round((monthlySavings / baseBill) * 100) : 0;

  // Recommend a share size that offsets ~65% of consumption (typical regulatory cap in many states)
  const targetUnits = consumptionUnits * 0.65;
  const recommendedKw = Math.max(1, Math.round((targetUnits / (UNITS_PER_KW_PER_DAY * 30)) * 10) / 10);

  const carbonSavedTonsPerYear =
    Math.round(((creditedUnits * 12 * GRID_EMISSION_FACTOR_KG_PER_KWH) / 1000) * 10) / 10;

  return {
    consumptionUnits,
    baseBill,
    generatedUnits,
    creditedUnits,
    postVnmBill,
    monthlySavings,
    savingsPercent,
    recommendedKw,
    carbonSavedTonsPerYear,
  };
}
