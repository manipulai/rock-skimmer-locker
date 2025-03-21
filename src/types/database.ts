export interface Rock {
  id: number;
  name: string;
  description: string;
  is_greenlisted: boolean;
  image_url: string;
  created_at: string;
  merchant_application_id: number | null;
}

export interface MerchantApplication {
  id: number;
  name: string;
  email: string;
  website: string;
  is_approved: boolean;
  created_at: string;
}

export interface MerchantAdmin {
  id: number;
  merchant_application_id: number;
  rock_id: number | null;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  created_at: string;
  merchant: MerchantApplication;
}