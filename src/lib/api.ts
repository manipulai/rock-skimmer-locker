import { supabase } from './supabase';
import type { MerchantApplication, MerchantAdmin } from '../types/database';

// Rocks
export const getRocks = async (greenlistedOnly = false) => {
  const query = supabase
    .from('rocks')
    .select(`
      *,
      merchant:merchant_applications(*)
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
    .from('merchant_applications')
    .select('*');

  if (approvedOnly) {
    query.eq('is_approved', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const submitMerchantApplication = async (merchantData: {
  name: string;
  email: string;
  website: string;
}) => {
  try {
    // First, insert the merchant application
    const { data: merchantData_, error: merchantError } = await supabase
      .from('merchant_applications')
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

    // Create a default rock for the merchant
    const { data: rockData, error: rockError } = await supabase
      .from('rocks')
      .insert([{
        name: "Default Rock",
        description: "A standard skipping rock",
        is_greenlisted: false, // Start as not greenlisted
        image_url: "https://example.com/default-rock.jpg",
        merchant_id: merchantData_.id
      }])
      .select()
      .single();

    if (rockError) {
      console.error('Rock creation error:', rockError);
      throw rockError;
    }

    // Then create the merchant admin entry
    const { data: applicationData, error: applicationError } = await supabase
      .from('merchant_admin')
      .insert([{
        merchant_application_id: merchantData_.id,
        status: 'pending',
        notes: '',
        rock_id: rockData.id // Link to the created rock
      }])
      .select('*')
      .single();

    if (applicationError) {
      console.error('Application creation error:', applicationError);
      throw applicationError;
    }

    return { merchant: merchantData_, application: applicationData, rock: rockData };
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
    .from('merchant_admin')
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
    .from('merchant_admin')
    .select(`
      *,
      merchant:merchant_applications(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Update merchant application status
export const updateMerchantApplicationStatus = async (
  applicationId: number,
  status: 'pending' | 'approved' | 'rejected',
  notes: string = ''
) => {
  // First get the merchant_admin and related merchant application data
  const { data: application, error: fetchError } = await supabase
    .from('merchant_admin')
    .select(`
      *,
      merchant:merchant_applications(*)
    `)
    .eq('id', applicationId)
    .single();

  if (fetchError) throw fetchError;

  if (status === 'approved') {
    // Check if this merchant already has an entry in rocks table
    const { data: existingRocks, error: rocksError } = await supabase
      .from('rocks')
      .select('*')
      .eq('merchant_application_id', application.merchant_application_id);

    if (rocksError) throw rocksError;

    // If no rocks exist for this merchant, create a default one
    if (!existingRocks || existingRocks.length === 0) {
      const { error: insertError } = await supabase
        .from('rocks')
        .insert([{
          name: `${application.merchant.name}'s Default Rock`,
          description: "A standard skipping rock",
          is_greenlisted: true,
          image_url: "https://example.com/default-rock.jpg",
          merchant_application_id: application.merchant_application_id
        }]);

      if (insertError) throw insertError;
    } else {
      // If rocks exist, update them to be greenlisted
      const { error: updateError } = await supabase
        .from('rocks')
        .update({ is_greenlisted: true })
        .eq('merchant_application_id', application.merchant_application_id);

      if (updateError) throw updateError;
    }

    // Approve the merchant application
    await approveMerchant(application.merchant_application_id);
  } else {
    // When pending or rejected, update existing rocks to be not greenlisted
    const { error: updateError } = await supabase
      .from('rocks')
      .update({ is_greenlisted: false })
      .eq('merchant_application_id', application.merchant_application_id);

    if (updateError) throw updateError;

    // Unapprove the merchant
    await unapproveMerchant(application.merchant_application_id);
  }

  // Update the merchant_admin status
  const { data, error } = await supabase
    .from('merchant_admin')
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
    .from('merchant_applications')
    .update({ is_approved: true })
    .eq('id', merchantId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// When a merchant is unapproved, update their status
export const unapproveMerchant = async (merchantId: number) => {
  const { data, error } = await supabase
    .from('merchant_applications')
    .update({ is_approved: false })
    .eq('id', merchantId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
