export const STORE_CONFIG = {
  name: 'Rasoi Ansh',
  tagline: 'Handpicked Indian Spices & Gourmet Masalas',
  tenantId: process.env.NEXT_PUBLIC_STORE_ID || process.env.NEXT_PUBLIC_ECOMMERCE_ID || 'c3d7764d-b379-4eec-8c53-8dc6a58e0f35',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  currencySymbol: '₹',
  contact: {
    phone: '+91 98765 43210',
    email: 'namaste@rasoiansh.com',
    address: 'Jaipur, Rajasthan, India',
  },
};

export const TRUST_PILLARS = [
  {
    icon: 'ShieldCheck',
    title: 'SECURE PAYMENT',
    description: '100% Encrypted & Safe Checkout',
  },
  {
    icon: 'Truck',
    title: 'FREE SHIPPING',
    description: 'On all domestic orders above ₹499',
  },
  {
    icon: 'Headphones',
    title: 'CUSTOMER SUPPORT',
    description: 'Dedicated assistance for D2C & B2B',
  },
];

export const RECIPES_DATA = [
  {
    id: 'recipe-1',
    slug: 'royal-paneer-butter-masala',
    title: 'Royal Paneer Butter Masala',
    subtitle: 'Creamy artisanal gravy infused with stone-ground aromatics',
    heroImage: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15 mins',
    cookTime: '25 mins',
    servings: '4 People',
    difficulty: 'Medium' as const,
    description: 'A luxurious restaurant-style paneer gravy celebrated for its silky tomato base, balanced whole spices, and rich finish with Royal Garam Masala and Kasuri Methi.',
    ingredients: [
      '300g Fresh Cottage Cheese (Paneer), cubed',
      '4 Ripe Tomatoes, pureed',
      '2 tsp Rasoi Ansh Royal Garam Masala',
      '1 tsp Rasoi Ansh Kashmiri Red Chilli Powder',
      '1 tsp Rasoi Ansh Turmeric Powder',
      '1 tbsp Kasuri Methi, hand-crushed',
      '2 tbsp Butter + 1 tbsp Ghee',
      '1/4 cup Fresh Heavy Cream',
      'Salt to taste',
    ],
    instructions: [
      'Melt butter and ghee in a heavy-bottomed pan. Add whole cardamom and cloves from Rasoi Ansh.',
      'Pour in fresh tomato puree and simmer until the ghee separates from the sides.',
      'Add turmeric, kashmiri chilli powder, and half the Royal Garam Masala. Sauté on low flame.',
      'Gently fold in paneer cubes and warm water to adjust gravy consistency. Simmer for 6 minutes.',
      'Finish with fresh cream, crushed kasuri methi, and the remaining Royal Garam Masala. Serve hot with naan or rice.',
    ],
    relatedProductSlugs: ['royal-garam-masala-blend', 'turmeric-root-powder-high-curcumin', 'alleppey-green-cardamom'],
  },
  {
    id: 'recipe-2',
    slug: 'kerala-black-pepper-chicken',
    title: 'Heritage Black Pepper Chicken Fry',
    subtitle: 'Robust, dry-roasted tellicherry black pepper delicacy',
    heroImage: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
    prepTime: '20 mins',
    cookTime: '30 mins',
    servings: '3-4 People',
    difficulty: 'Easy' as const,
    description: 'South Indian coastal style dry roast highlighting bold Tellicherry black pepper crushed coarse, fresh curry leaves, and shallow caramelized shallots.',
    ingredients: [
      '500g Bone-in Chicken pieces',
      '2 tbsp Rasoi Ansh Tellicherry Black Pepper, coarsely cracked',
      '1 tbsp Ginger-Garlic Paste',
      '1 tsp Rasoi Ansh Turmeric Powder',
      '15-20 Fresh Curry Leaves',
      '1 cup Sliced Shallots (Sambhar onions)',
      '2 tbsp Coconut Oil',
    ],
    instructions: [
      'Marinate chicken with ginger-garlic paste, turmeric, salt, and 1 tbsp cracked black pepper for 20 minutes.',
      'Heat coconut oil in a pan, add curry leaves and sliced shallots, cooking until deep golden brown.',
      'Add the marinated chicken and sear on high flame for 5 minutes.',
      'Lower flame, cover and cook in its own juices until tender (approx 15-18 mins).',
      'Remove lid, add remaining cracked black pepper, and roast until aromatic and dry-glazed.',
    ],
    relatedProductSlugs: ['tellicherry-black-pepper', 'royal-garam-masala-blend'],
  },
];
