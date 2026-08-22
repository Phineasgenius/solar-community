export type SolarPlant = {
  id: string;
  name: string;
  type: "Ground-Mount Farm" | "RWA Rooftop" | "Community Rooftop";
  city: string;
  discomId: string;
  lat: number;
  lng: number;
  capacityKw: number;
  capacityLeftPercent: number;
  pricePerUnit: number; // ₹ per subscribed kWh-equivalent
  subscribers: number;
  commissioned: string;
};

export const SOLAR_PLANTS: SolarPlant[] = [
  {
    id: "plant-whitefield",
    name: "Whitefield 250kW Solar Farm",
    type: "Ground-Mount Farm",
    city: "Bengaluru",
    discomId: "bescom",
    lat: 12.9698,
    lng: 77.7499,
    capacityKw: 250,
    capacityLeftPercent: 12,
    pricePerUnit: 4.4,
    subscribers: 96,
    commissioned: "Mar 2024",
  },
  {
    id: "plant-dwarka",
    name: "Dwarka RWA Solar Roof",
    type: "RWA Rooftop",
    city: "Delhi",
    discomId: "bses-rajdhani",
    lat: 28.5921,
    lng: 77.046,
    capacityKw: 80,
    capacityLeftPercent: 7,
    pricePerUnit: 3.9,
    subscribers: 58,
    commissioned: "Jan 2024",
  },
  {
    id: "plant-hadapsar",
    name: "Hadapsar Community Rooftop",
    type: "Community Rooftop",
    city: "Pune",
    discomId: "msedcl",
    lat: 18.5089,
    lng: 73.9259,
    capacityKw: 120,
    capacityLeftPercent: 34,
    pricePerUnit: 5.1,
    subscribers: 41,
    commissioned: "Jun 2024",
  },
  {
    id: "plant-adyar",
    name: "Adyar Riverside Solar Park",
    type: "Ground-Mount Farm",
    city: "Chennai",
    discomId: "tangedco",
    lat: 13.0012,
    lng: 80.2565,
    capacityKw: 300,
    capacityLeftPercent: 21,
    pricePerUnit: 4.0,
    subscribers: 112,
    commissioned: "Sep 2023",
  },
  {
    id: "plant-indiranagar",
    name: "Indiranagar RWA Terrace Grid",
    type: "RWA Rooftop",
    city: "Bengaluru",
    discomId: "bescom",
    lat: 12.9784,
    lng: 77.6408,
    capacityKw: 60,
    capacityLeftPercent: 4,
    pricePerUnit: 4.6,
    subscribers: 47,
    commissioned: "Feb 2024",
  },
  {
    "id": "plant-rohini",
    "name": "Rohini Sector-11 Community Grid",
    type: "Community Rooftop",
    city: "Delhi",
    discomId: "bses-rajdhani",
    lat: 28.7382,
    lng: 77.117,
    capacityKw: 95,
    capacityLeftPercent: 46,
    pricePerUnit: 3.8,
    subscribers: 30,
    commissioned: "Jul 2024",
  },
  {
    id: "plant-belagavi",
    name: "Belagavi Sunfields Community Plant",
    type: "Ground-Mount Farm",
    city: "Belagavi",
    discomId: "bescom",
    lat: 15.8497,
    lng: 74.4977,
    capacityKw: 150,
    capacityLeftPercent: 58,
    pricePerUnit: 4.1,
    subscribers: 22,
    commissioned: "May 2024",
  },
  {
    id: "plant-hubli",
    name: "Hubballi Industrial Rooftop Grid",
    type: "Community Rooftop",
    city: "Hubballi",
    discomId: "bescom",
    lat: 15.3647,
    lng: 75.124,
    capacityKw: 110,
    capacityLeftPercent: 39,
    pricePerUnit: 4.3,
    subscribers: 19,
    commissioned: "Apr 2024",
  },
  {
    id: "plant-navimumbai",
    name: "Navi Mumbai Coastal Solar Park",
    type: "Ground-Mount Farm",
    city: "Mumbai",
    discomId: "msedcl",
    lat: 19.033,
    lng: 73.0297,
    capacityKw: 400,
    capacityLeftPercent: 17,
    pricePerUnit: 4.7,
    subscribers: 145,
    commissioned: "Nov 2023",
  },
  {
    id: "plant-gachibowli",
    name: "Gachibowli Tech Park Rooftop",
    type: "Community Rooftop",
    city: "Hyderabad",
    discomId: "tsspdcl",
    lat: 17.4435,
    lng: 78.3772,
    capacityKw: 180,
    capacityLeftPercent: 28,
    pricePerUnit: 4.2,
    subscribers: 64,
    commissioned: "Aug 2024",
  },
  {
    id: "plant-salt-lake",
    name: "Salt Lake Sector-V Community Grid",
    type: "RWA Rooftop",
    city: "Kolkata",
    discomId: "cesc",
    lat: 22.5726,
    lng: 88.4247,
    capacityKw: 70,
    capacityLeftPercent: 51,
    pricePerUnit: 4.0,
    subscribers: 26,
    commissioned: "Oct 2024",
  },
];

export type Subscriber = {
  caNumber: string;
  flatNo: string;
  allocatedSharePercent: number;
  allocatedKw: number;
  monthlyVnmCredit: number;
  status: "Active" | "Pending KYC" | "Paused";
};

export function generateSubscribers(count: number, plantCapacityKw: number): Subscriber[] {
  const towers = ["A", "B", "C", "D"];
  const list: Subscriber[] = [];
  for (let i = 0; i < count; i++) {
    const tower = towers[i % towers.length];
    const floor = Math.floor(i / towers.length) + 1;
    const sharePercent = Math.round((0.6 + ((i * 37) % 100) / 100 * 1.4) * 10) / 10;
    const allocatedKw = Math.round(plantCapacityKw * (sharePercent / 100) * 10) / 10;
    list.push({
      caNumber: `CA-${100000 + i * 37}`,
      flatNo: `${tower}-${(300 + floor).toString()}`,
      allocatedSharePercent: sharePercent,
      allocatedKw,
      monthlyVnmCredit: Math.round(allocatedKw * 4 * 30 * 4.2),
      status: i % 11 === 0 ? "Pending KYC" : i % 17 === 0 ? "Paused" : "Active",
    });
  }
  return list;
}

export type MonthlyPoint = {
  month: string;
  generationKwh: number;
  gridDrawKwh: number;
  creditsEarnedKwh: number;
};

export const GENERATION_HISTORY: MonthlyPoint[] = [
  { month: "Mar", generationKwh: 410, gridDrawKwh: 260, creditsEarnedKwh: 380 },
  { month: "Apr", generationKwh: 452, gridDrawKwh: 240, creditsEarnedKwh: 420 },
  { month: "May", generationKwh: 498, gridDrawKwh: 255, creditsEarnedKwh: 460 },
  { month: "Jun", generationKwh: 470, gridDrawKwh: 280, creditsEarnedKwh: 435 },
  { month: "Jul", generationKwh: 390, gridDrawKwh: 310, creditsEarnedKwh: 360 },
  { month: "Aug", generationKwh: 430, gridDrawKwh: 265, creditsEarnedKwh: 400 },
];

export type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: "credit" | "capacity" | "billing" | "system";
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "VNM credit applied",
    detail: "₹1,240 solar credit applied to your BSES Rajdhani statement.",
    time: "2h ago",
    type: "credit",
  },
  {
    id: "n2",
    title: "Plant almost full",
    detail: "Indiranagar RWA Terrace Grid is down to 4% capacity — subscribe soon.",
    time: "6h ago",
    type: "capacity",
  },
  {
    id: "n3",
    title: "Billing cycle closed",
    detail: "Your August settlement with BESCOM has been finalized.",
    time: "1d ago",
    type: "billing",
  },
  {
    id: "n4",
    title: "New plant near you",
    detail: "Rohini Sector-11 Community Grid just opened 46% fresh capacity.",
    time: "2d ago",
    type: "system",
  },
];

export const LIVE_TICKER_STATS = [
  "Whitefield Farm generating 187 kWh right now",
  "Dwarka RWA Roof at 96% subscribed",
  "1,240 households on virtual net metering today",
  "42.8 tons CO2 offset this month across SunShare plants",
  "Rohini Sector-11 has 46% capacity still open",
];
