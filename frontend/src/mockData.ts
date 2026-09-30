export interface InventoryItem {
  id: string;
  batchId: string;
  name: string;
  category: 'Vegetables' | 'Dairy' | 'Grains' | 'Pulses' | 'Oils & Spices';
  quantity: number;
  unit: string;
  expiryDate: string; // YYYY-MM-DD
  expiryDaysRemaining: number;
  supplier: string;
  sourceLocation: string;
  receivedDate: string;
  storageCondition: string;
  storageTemp: string;
  wasteRisk: 'Low' | 'Medium' | 'High';
  status: 'Fresh' | 'Expiring Soon' | 'High Risk';
  recommendedAction?: string;
}

export interface SmartInsight {
  id: string;
  title: string;
  description: string;
  category: 'Urgent' | 'Optimization' | 'Consumption' | 'Storage';
  recommendedAction: string;
  impact: string;
  batchId?: string;
  timestamp: string;
}

export interface WasteDataPoint {
  day: string;
  wasteKg: number;
  preventedKg: number;
}

export interface CategoryWaste {
  category: string;
  percentage: number;
  kg: number;
  color: string;
}

export const initialInventory: InventoryItem[] = [
  {
    id: '1',
    batchId: 'BATCH-1042',
    name: 'Country Tomatoes',
    category: 'Vegetables',
    quantity: 65,
    unit: 'kg',
    expiryDate: '2026-10-02',
    expiryDaysRemaining: 2,
    supplier: 'ABC Farms',
    sourceLocation: 'Chennai, Tamil Nadu',
    receivedDate: '2026-09-27',
    storageCondition: 'Cold Storage Room #2',
    storageTemp: '12°C',
    wasteRisk: 'High',
    status: 'Expiring Soon',
    recommendedAction: "Move near-expiry items to today's dinner menu (Tomato Rasam / Soup)."
  },
  {
    id: '2',
    batchId: 'BATCH-B104',
    name: 'Sona Masoori Rice',
    category: 'Grains',
    quantity: 450,
    unit: 'kg',
    expiryDate: '2026-12-15',
    expiryDaysRemaining: 76,
    supplier: 'Sri Krishna Mills',
    sourceLocation: 'Thanjavur, Tamil Nadu',
    receivedDate: '2026-09-20',
    storageCondition: 'Dry Grain Silo A',
    storageTemp: '24°C',
    wasteRisk: 'Low',
    status: 'Fresh',
    recommendedAction: "Prioritize Batch B104 for daily lunch batch cooking under FEFO."
  },
  {
    id: '3',
    batchId: 'BATCH-M201',
    name: 'Pasteurized Fresh Milk',
    category: 'Dairy',
    quantity: 120,
    unit: 'Liters',
    expiryDate: '2026-10-01',
    expiryDaysRemaining: 1,
    supplier: 'Aavin Cooperative',
    sourceLocation: 'Madhavaram, Chennai',
    receivedDate: '2026-09-29',
    storageCondition: 'Chilled Walk-in Cooler',
    storageTemp: '4°C',
    wasteRisk: 'High',
    status: 'High Risk',
    recommendedAction: "High consumption spike: Convert remaining 40L to evening curd/buttermilk."
  },
  {
    id: '4',
    batchId: 'BATCH-SP33',
    name: 'Fresh Spinach (Keerai)',
    category: 'Vegetables',
    quantity: 28,
    unit: 'kg',
    expiryDate: '2026-10-01',
    expiryDaysRemaining: 1,
    supplier: 'Nilgiris Organics',
    sourceLocation: 'Ooty, Tamil Nadu',
    receivedDate: '2026-09-29',
    storageCondition: 'Crisper Unit 03',
    storageTemp: '8°C',
    wasteRisk: 'High',
    status: 'High Risk',
    recommendedAction: "Immediate usage required: Prepare Keerai Kootu for tonight's dinner."
  },
  {
    id: '5',
    batchId: 'BATCH-P088',
    name: 'Malai Paneer',
    category: 'Dairy',
    quantity: 42,
    unit: 'kg',
    expiryDate: '2026-10-03',
    expiryDaysRemaining: 3,
    supplier: 'MilkyMist Dairy',
    sourceLocation: 'Erode, Tamil Nadu',
    receivedDate: '2026-09-28',
    storageCondition: 'Cold Storage Room #1',
    storageTemp: '3°C',
    wasteRisk: 'Medium',
    status: 'Expiring Soon',
    recommendedAction: "Schedule Paneer Butter Masala for tomorrow lunch service."
  },
  {
    id: '6',
    batchId: 'BATCH-DL12',
    name: 'Toor Dal (Premium)',
    category: 'Pulses',
    quantity: 180,
    unit: 'kg',
    expiryDate: '2026-12-30',
    expiryDaysRemaining: 91,
    supplier: 'AgroPulse India',
    sourceLocation: 'Latur, Maharashtra',
    receivedDate: '2026-09-15',
    storageCondition: 'Dry Pantry Racks',
    storageTemp: '22°C',
    wasteRisk: 'Low',
    status: 'Fresh',
    recommendedAction: "Optimal inventory level. Standard consumption rate."
  },
  {
    id: '7',
    batchId: 'BATCH-ON99',
    name: 'Bellary Red Onions',
    category: 'Vegetables',
    quantity: 240,
    unit: 'kg',
    expiryDate: '2026-10-18',
    expiryDaysRemaining: 18,
    supplier: 'Deccan Fresh Produce',
    sourceLocation: 'Nashik, Maharashtra',
    receivedDate: '2026-09-25',
    storageCondition: 'Ventilated Slatted Crates',
    storageTemp: '20°C',
    wasteRisk: 'Low',
    status: 'Fresh',
    recommendedAction: "Storage humidity normal. Expected shelf-life 2+ weeks."
  },
  {
    id: '8',
    batchId: 'BATCH-CO55',
    name: 'Sunflower Cooking Oil',
    category: 'Oils & Spices',
    quantity: 85,
    unit: 'Liters',
    expiryDate: '2027-01-20',
    expiryDaysRemaining: 112,
    supplier: 'SunGold Refineries',
    sourceLocation: 'Chennai Port Hub',
    receivedDate: '2026-09-10',
    storageCondition: 'Dry Store Basement',
    storageTemp: '25°C',
    wasteRisk: 'Low',
    status: 'Fresh',
    recommendedAction: "Batch sealed. No risk."
  }
];

export const initialInsights: SmartInsight[] = [
  {
    id: 'ins-1',
    title: 'Tomatoes likely to expire within 2 days',
    description: 'Country Tomatoes (Batch BATCH-1042, 65 kg) will exceed freshness threshold in 48 hours based on shelf-life tracking.',
    category: 'Urgent',
    recommendedAction: "Move near-expiry items to today's menu: Prepare Tomato Rasam / Soup for 250 students.",
    impact: 'Prevents 65 kg of waste • Saves ₹3,900',
    batchId: 'BATCH-1042',
    timestamp: '10 mins ago'
  },
  {
    id: 'ins-2',
    title: 'Prioritize Batch B104 for kitchen usage',
    description: 'First-Expiry, First-Out (FEFO) algorithm identified 450 kg Sona Masoori Rice (Batch BATCH-B104) as next priority for daily batch boiling.',
    category: 'Optimization',
    recommendedAction: 'Tag Batch B104 for tomorrow morning breakfast & lunch meal production.',
    impact: 'Maintains zero grain spoilage policy',
    batchId: 'BATCH-B104',
    timestamp: '1 hour ago'
  },
  {
    id: 'ins-3',
    title: 'Milk consumption is higher than average this week',
    description: 'Daily dairy usage increased by 18% due to evening tea and dessert demand. Current remaining stock is 120 Liters.',
    category: 'Consumption',
    recommendedAction: 'Adjust weekend reorder quantity to +25 Liters while utilizing expiring Batch M201 first.',
    impact: 'Avoids stock-out while eliminating batch lapse',
    batchId: 'BATCH-M201',
    timestamp: '2 hours ago'
  },
  {
    id: 'ins-4',
    title: 'Suggested action: Move near-expiry items to today\'s menu',
    description: 'Fresh Spinach (Batch BATCH-SP33, 28 kg) has 18 hours of peak freshness remaining under current crisper temperature.',
    category: 'Urgent',
    recommendedAction: 'Cook Keerai Dal / Kootu for dinner tonight instead of scheduled cabbage.',
    impact: 'Saves 28 kg fresh produce • Zero plate waste',
    batchId: 'BATCH-SP33',
    timestamp: '3 hours ago'
  },
  {
    id: 'ins-5',
    title: 'Storage Temperature Check: Cold Room #2',
    description: 'Cold Room #2 is steady at 12°C. Humidity level is optimal at 68% for root vegetables.',
    category: 'Storage',
    recommendedAction: 'Keep doors sealed during afternoon loading hours.',
    impact: 'Extends tomato and carrot shelf life by 36 hours',
    timestamp: '4 hours ago'
  }
];

export const weeklyWasteData: WasteDataPoint[] = [
  { day: 'Mon', wasteKg: 28, preventedKg: 95 },
  { day: 'Tue', wasteKg: 21, preventedKg: 110 },
  { day: 'Wed', wasteKg: 16, preventedKg: 125 },
  { day: 'Thu', wasteKg: 19, preventedKg: 105 },
  { day: 'Fri', wasteKg: 12, preventedKg: 130 },
  { day: 'Sat', wasteKg: 9, preventedKg: 85 },
  { day: 'Sun', wasteKg: 7, preventedKg: 75 },
];

export const monthlyWasteData = [
  { month: 'Apr', beforeSystemKg: 860, withZeroPlateKg: 420 },
  { month: 'May', beforeSystemKg: 890, withZeroPlateKg: 360 },
  { month: 'Jun', beforeSystemKg: 840, withZeroPlateKg: 290 },
  { month: 'Jul', beforeSystemKg: 910, withZeroPlateKg: 220 },
  { month: 'Aug', beforeSystemKg: 880, withZeroPlateKg: 165 },
  { month: 'Sep', beforeSystemKg: 850, withZeroPlateKg: 112 },
];

export const categoryWasteData: CategoryWaste[] = [
  { category: 'Vegetables & Greens', percentage: 38, kg: 42.5, color: '#10B981' },
  { category: 'Cooked Surplus Meals', percentage: 28, kg: 31.4, color: '#06B6D4' },
  { category: 'Dairy Products', percentage: 18, kg: 20.2, color: '#F59E0B' },
  { category: 'Grains & Bakery', percentage: 16, kg: 17.9, color: '#6366F1' },
];

export const recentActivities = [
  {
    id: 'act-1',
    time: '25 mins ago',
    title: 'Batch BATCH-1042 Flagged',
    desc: 'Country Tomatoes marked Expiring Soon (2 days left). Menu substitution rasam recommended.',
    type: 'alert'
  },
  {
    id: 'act-2',
    time: '1 hour ago',
    title: 'FEFO Kitchen Usage Logged',
    desc: '45 kg Sona Masoori Rice (Batch B104) consumed for lunch batch cooking.',
    type: 'success'
  },
  {
    id: 'act-3',
    time: '3 hours ago',
    title: 'New Inventory Batch Registered',
    desc: 'Batch BATCH-SP33 (Fresh Spinach, 28 kg) scanned with Smart QR Passport.',
    type: 'info'
  },
  {
    id: 'act-4',
    time: 'Yesterday',
    title: 'AI Menu Optimization Accepted',
    desc: 'Chef redirected 30 kg near-expiry curd into spiced buttermilk, saving 100% of batch.',
    type: 'success'
  }
];

export const reportSummary = {
  totalFoodReceivedKg: 8450,
  foodConsumedKg: 7810,
  foodWastedKg: 112,
  baselineWasteKg: 850,
  wasteReductionRate: 86.8, // %
  costSavedInr: 184600,
  co2eAvoidedKg: 1845,
  waterSavedLiters: 1108000,
};
