import { supabase } from './supabase';
import type { Rock, Merchant, MerchantApplication } from '../types/database';

// Rocks
export const getRocks = async (greenlistedOnly = false) => {
  const query = supabase
    .from('rocks')
    .select(`
      *,
      merchant:merchants(*)
    `);

  if (greenlistedOnly) {
    query.eq('is_greenlisted', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Merchants
export const getMerchants = async (approvedOnly = false) => {
  const query = supabase
    .from('merchants')
    .select('*');

  if (approvedOnly) {
    query.eq('is_approved', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const submitMerchantApplication = async (merchantData: Omit<Merchant, 'id' | 'created_at' | 'is_approved'>) => {
  try {
    // First, insert the merchant
    const { data: merchantData_, error: merchantError } = await supabase
      .from('merchants')
      .insert([{ 
        ...merchantData, 
        is_approved: false 
      }])
      .select('*')
      .single();

    if (merchantError) {
      console.error('Merchant creation error:', merchantError);
      throw merchantError;
    }

    if (!merchantData_) {
      throw new Error('No merchant data returned');
    }

    // Then create the merchant application
    const { data: applicationData, error: applicationError } = await supabase
      .from('merchant_applications')
      .insert([{
        merchant_id: merchantData_.id,
        status: 'pending',
        notes: '',
        rock_id: null // We need to modify the table to allow null rock_id for initial applications
      }])
      .select('*')
      .single();

    if (applicationError) {
      console.error('Application creation error:', applicationError);
      throw applicationError;
    }

    return { merchant: merchantData_, application: applicationData };
  } catch (error) {
    console.error('Submission error:', error);
    throw error;
  }
};

// Applications
export const submitRockApplication = async (rockData: {
  merchant_id: number;
  rock_name: string;
  rock_description: string;
  image_url: string;
}) => {
  // First insert the rock
  const { data: rockData_, error: rockError } = await supabase
    .from('rocks')
    .insert([{
      name: rockData.rock_name,
      description: rockData.rock_description,
      is_greenlisted: false,
      image_url: rockData.image_url,
      merchant_id: rockData.merchant_id
    }])
    .select();

  if (rockError) throw rockError;

  // Then create the application
  const { data: applicationData, error: applicationError } = await supabase
    .from('merchant_applications')
    .insert([{
      merchant_id: rockData.merchant_id,
      rock_id: rockData_[0].id,
      status: 'pending',
      notes: ''
    }])
    .select();

  if (applicationError) throw applicationError;

  return { rock: rockData_[0], application: applicationData[0] };
};
// Get merchant applications
export const getMerchantApplications = async () => {
  const { data, error } = await supabase
    .from('merchant_applications')
    .select(`
      *,
      merchant:merchants(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Update merchant application status
export const updateMerchantApplicationStatus = async (
  applicationId: number,
  status: 'approved' | 'rejected',
  notes: string = ''
) => {
  const { data, error } = await supabase
    .from('merchant_applications')
    .update({ status, notes })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// When a merchant is approved, update their status
export const approveMerchant = async (merchantId: number) => {
  const { data, error } = await supabase
    .from('merchants')
    .update({ is_approved: true })
    .eq('id', merchantId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
