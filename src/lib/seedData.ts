import { supabaseAdmin } from './supabase-admin';

export const seedData = async () => {
  try {
    console.log('Starting to seed data...');
    
    // Sample merchant data
    const sampleMerchants = [
      {
        name: 'Rock Shop 1',
        email: 'shop1@example.com',
        website: 'https://rockshop1.com',
        is_approved: false
      },
      {
        name: 'Rock Shop 2',
        email: 'shop2@example.com',
        website: 'https://rockshop2.com',
        is_approved: false
      },
      {
        name: 'Rock Shop 3',
        email: 'shop3@example.com',
        website: 'https://rockshop3.com',
        is_approved: false
      },
      {
        name: 'Premium Rocks',
        email: 'premium@rocks.com',
        website: 'https://premiumrocks.com',
        is_approved: false
      },
      {
        name: 'Skimmer Supply Co',
        email: 'info@skimmersupply.com',
        website: 'https://skimmersupply.com',
        is_approved: false
      }
    ];
    
    // First, get all existing merchant applications
    const { data: existingMerchants, error: fetchError } = await supabaseAdmin
      .from('merchant_applications')
      .select('id, email, name');
      
    if (fetchError) {
      console.error('Error fetching existing merchants:', fetchError);
      return { 
        success: false, 
        message: 'Failed to fetch existing merchants' 
      };
    }
    
    console.log('Existing merchants:', existingMerchants);
    
    // Create a map of email to merchant ID for quick lookup
    const emailToMerchantId = {};
    existingMerchants?.forEach(merchant => {
      emailToMerchantId[merchant.email] = merchant.id;
    });
    
    // Filter out merchants that already exist
    const newMerchants = sampleMerchants.filter(merchant => 
      !emailToMerchantId[merchant.email]
    );
    
    let merchantIds = [...(existingMerchants?.map(m => m.id) || [])];
    
    // Insert new merchants if any
    if (newMerchants.length > 0) {
      console.log(`Adding ${newMerchants.length} new merchant applications`);
      
      const { data: insertedMerchants, error: merchantError } = await supabaseAdmin
        .from('merchant_applications')
        .insert(newMerchants)
        .select();

      if (merchantError) {
        console.error('Error inserting merchant applications:', merchantError);
        return { 
          success: false, 
          message: 'Failed to insert merchant applications' 
        };
      }
      
      console.log('Successfully inserted merchant applications:', insertedMerchants);
      
      // Add newly inserted merchant IDs to our list
      merchantIds = [...merchantIds, ...(insertedMerchants?.map(m => m.id) || [])];
      
      // Update our email to ID map
      insertedMerchants?.forEach(merchant => {
        emailToMerchantId[merchant.email] = merchant.id;
      });
    }
    
    // For testing purposes, we'll delete existing admin applications and recreate them
    console.log('Deleting existing admin applications for testing...');
    const { error: deleteError } = await supabaseAdmin
      .from('merchant_admin')
      .delete()
      .neq('id', 0); // Delete all records
      
    if (deleteError) {
      console.error('Error deleting existing admin applications:', deleteError);
      // Continue anyway
    }
    
    // Use all merchant IDs for creating admin applications
    const merchantIdsNeedingAdminApps = merchantIds;
    
    if (merchantIdsNeedingAdminApps.length === 0) {
      console.log('No merchants found to create applications for');
      return {
        success: false,
        message: 'No merchants found to create applications for',
        data: []
      };
    }
    
    // Create admin applications for merchants that don't have them
    const adminApplications = merchantIdsNeedingAdminApps.map((merchantId, index) => ({
      status: index % 3 === 0 ? 'pending' : index % 3 === 1 ? 'approved' : 'rejected',
      notes: `Sample application ${index + 1}`,
      merchant_application_id: merchantId
    }));
    
    console.log('Creating admin applications:', adminApplications);
    
    const { data: applications, error: insertError } = await supabaseAdmin
      .from('merchant_admin')
      .insert(adminApplications)
      .select(`
        id,
        status,
        notes,
        created_at,
        merchant_application_id,
        merchant:merchant_applications!merchant_application_id (
          id,
          name,
          email,
          website,
          is_approved,
          created_at
        )
      `);

    if (insertError) {
      console.error('Error inserting admin applications:', insertError);
      return { 
        success: false, 
        message: 'Failed to insert merchant admin applications' 
      };
    }

    console.log('Successfully inserted admin applications:', applications);
    
    // Update merchant is_approved status for approved applications
    const approvedMerchantIds = applications
      .filter(app => app.status === 'approved')
      .map(app => app.merchant_application_id);
      
    if (approvedMerchantIds.length > 0) {
      console.log('Updating approved merchants:', approvedMerchantIds);
      
      const { error: updateError } = await supabaseAdmin
        .from('merchant_applications')
        .update({ is_approved: true })
        .in('id', approvedMerchantIds);
        
      if (updateError) {
        console.error('Error updating merchant approval status:', updateError);
      }
    }
    
    // We no longer automatically create rocks for approved merchants here
    // Rocks will only be created when an admin explicitly approves a merchant in the UI

    return { 
      success: true, 
      message: `Added ${applications?.length} merchant applications`,
      data: applications 
    };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
