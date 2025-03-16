import { supabase } from './supabase';

const sampleRocks = [
  {
    name: "Smooth Slate Skipper",
    description: "Perfect flat surface with ideal weight distribution. A competition-grade throwing stone.",
    is_greenlisted: true,
    image_url: "https://example.com/slate-skipper.jpg",
    merchant_id: 1
  },
  {
    name: "River Round",
    description: "Naturally polished by years of river flow. Medium weight with excellent aerodynamics.",
    is_greenlisted: true,
    image_url: "https://example.com/river-round.jpg",
    merchant_id: 1
  },
  {
    name: "Beach Pebble Pro",
    description: "Small but mighty. Ideal for beginners learning the perfect throw.",
    is_greenlisted: true,
    image_url: "https://example.com/beach-pebble.jpg",
    merchant_id: 2
  },
  {
    name: "Granite Glider",
    description: "Heavy but well-balanced. Best for experienced skimmers.",
    is_greenlisted: false,
    image_url: "https://example.com/granite-glider.jpg",
    merchant_id: 2
  },
  {
    name: "Quartzite Queen",
    description: "Beautiful and functional. Creates impressive splash patterns.",
    is_greenlisted: true,
    image_url: "https://example.com/quartzite-queen.jpg",
    merchant_id: 3
  },
  {
    name: "Limestone Launcher",
    description: "Light and fast. Perfect for distance records.",
    is_greenlisted: false,
    image_url: "https://example.com/limestone-launcher.jpg",
    merchant_id: 3
  }
];

const sampleMerchants = [
  {
    name: "Rocky's Premium Skippers",
    email: "sales@rockyskippers.com",
    website: "https://rockyskippers.com",
    is_approved: true
  },
  {
    name: "Lakeside Stone Supply",
    email: "info@lakesidestones.com",
    website: "https://lakesidestones.com",
    is_approved: true
  },
  {
    name: "Beach Pebble Co",
    email: "contact@beachpebble.co",
    website: "https://beachpebble.co",
    is_approved: false
  }
];

export const seedData = async () => {
  try {
    // Clear existing data
    await supabase.from('rocks').delete().neq('id', 0);
    await supabase.from('merchants').delete().neq('id', 0);

    // Insert merchants first
    const { data: merchantData, error: merchantError } = await supabase
      .from('merchants')
      .insert(sampleMerchants)
      .select();

    if (merchantError) throw merchantError;

    // Map merchant IDs to rocks
    const rocksWithMerchantIds = sampleRocks.map((rock, index) => ({
      ...rock,
      merchant_id: merchantData[Math.floor(index / 2)].id // Assign 2 rocks per merchant
    }));

    // Insert rocks
    const { error: rockError } = await supabase
      .from('rocks')
      .insert(rocksWithMerchantIds);

    if (rockError) throw rockError;

    return { success: true, message: 'Data seeded successfully' };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, message: error.message };
  }
};