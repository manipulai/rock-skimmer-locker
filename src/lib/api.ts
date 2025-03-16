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
  const { data, error } = await supabase
    .from('merchants')
    .insert([{ ...merchantData, is_approved: false }])
    .select();

  if (error) throw error;
  return data[0];
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