export type UserRole = 'ROLE_FARMER' | 'ROLE_AGENT' | 'ROLE_BUYER';

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUIRES_CHANGES';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  state: 'Telangana';
  district?: string;
  mandal?: string;
  village?: string;
  passbookNumber?: string;
  badgeId?: string;
  verificationStatus?: 'PENDING' | 'ASSIGNED' | 'APPROVED' | 'REJECTED';
}

export interface Product {
  id: number;
  farmerId: number;
  farmerName: string;
  farmerPhone: string;
  farmerVerified: boolean;
  categoryName: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  minOrderKg: number;
  pricePerKg: number;
  unit: string;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C' | 'Export Quality';
  harvestDate: string;
  shelfLifeDays: number;
  isOrganic: boolean;
  imageUrl: string;
  state: 'Telangana';
  district: string;
  mandal: string;
  village: string;
  farmLocation: string;
  description?: string;

  // Strict Agent Verification State
  status: ListingStatus;
  agentApproved: boolean;
  agentRemarks?: string;
  verifiedByAgent?: string;
  verifiedAt?: string;

  // ML Pricing Insights
  predictedPrice?: number;
  recommendedMinPrice?: number;
  recommendedMaxPrice?: number;
  mlConfidenceScore?: number;
}

export interface FarmerProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  state: 'Telangana';
  district: string;
  mandal: string;
  village: string;
  farmName: string;
  farmLocation: string;
  latitude: number;
  longitude: number;
  farmSizeAcres: number;
  primaryCrops: string;
  kisanCreditCardNo: string;
  verificationStatus: 'PENDING' | 'ASSIGNED' | 'APPROVED' | 'REJECTED';
  assignedAgentName?: string;
}

export interface VerificationRequest {
  farmerId: number;
  farmerName: string;
  phoneNumber: string;
  farmName: string;
  state: 'Telangana';
  district: string;
  mandal: string;
  village: string;
  farmLocation: string;
  farmSizeAcres: number;
  primaryCrops: string;
  landDocumentUrl?: string;
  status: 'PENDING' | 'ASSIGNED' | 'APPROVED' | 'REJECTED';
  registeredAt: string;
}

export interface AgentAuditRecord {
  id: number;
  productId: number;
  cropName: string;
  farmerName: string;
  district: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUIRES_CHANGES';
  agentName: string;
  agentBadge: string;
  timestamp: string;
  remarks: string;
}

export interface MLPrediction {
  commodity: string;
  market: string;
  forecast_horizon_days: number;
  current_market_price: number;
  avg_predicted_price: number;
  trend: 'Increasing' | 'Decreasing' | 'Stable';
  trend_percentage: number;
  confidence_score: number;
  recommended_min_price: number;
  recommended_max_price: number;
  volatility_risk: 'Low' | 'Moderate' | 'High';
  daily_forecasts: {
    date: string;
    day_name: string;
    predicted_price: number;
    lower_bound: number;
    upper_bound: number;
    expected_arrival_quintals: number;
  }[];
  model_name: string;
}

export interface CartItem {
  product: Product;
  quantityKg: number;
}

export interface Order {
  id: number;
  buyerName: string;
  farmerName: string;
  farmerPhone?: string;
  totalAmount: number;
  deliveryAddress: string;
  orderStatus: 'PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID';
  createdAt: string;
  items: {
    productId: number;
    cropName: string;
    quantityKg: number;
    unitPrice: number;
    subtotal: number;
  }[];
}
