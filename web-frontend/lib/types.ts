export type UserRole = 'ROLE_FARMER' | 'ROLE_AGENT' | 'ROLE_ADMIN' | 'ROLE_BUYER';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
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
  qualityGrade: 'Grade A' | 'Grade B' | 'Export Quality';
  harvestDate: string;
  shelfLifeDays: number;
  isOrganic: boolean;
  imageUrl: string;
  farmLocation: string;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface FarmerProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
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
  farmLocation: string;
  farmSizeAcres: number;
  primaryCrops: string;
  landDocumentUrl?: string;
  status: 'PENDING' | 'ASSIGNED' | 'APPROVED' | 'REJECTED';
  registeredAt: string;
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
