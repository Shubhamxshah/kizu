export type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

export type Creator = {
  id: number;
  name: string;
  handle: string;
  followers: string;
  niche: string;
  image: string;
  posts: string[];
};

export type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  cover: string;
  dishes: string[];
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Smoked Paneer Tikka",
    price: 320,
    category: "Starters",
    description: "Charred cottage cheese, peppers, mint chutney",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Kathiyawadi Thali",
    price: 460,
    category: "Mains",
    description: "A generous seasonal spread with rotla and chaas",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Garden Pesto Pasta",
    price: 390,
    category: "Mains",
    description: "House pesto, cherry tomatoes and parmesan",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Rose & Pistachio Kulfi",
    price: 190,
    category: "Desserts",
    description: "Creamy hand-churned kulfi with rose petals",
    image:
      "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=900&q=85",
  },
];

export const creators: Creator[] = [
  {
    id: 1,
    name: "Riya Shah",
    handle: "@riyabites",
    followers: "24K",
    niche: "Food & Lifestyle",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85",
    posts: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80",
    ],
  },
  {
    id: 2,
    name: "Kabir Mehta",
    handle: "@hungrykabir",
    followers: "12K",
    niche: "Street Food",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85",
    posts: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=500&q=80",
    ],
  },
  {
    id: 3,
    name: "Aashi Patel",
    handle: "@aashieats",
    followers: "48K",
    niche: "Cafés & Travel",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85",
    posts: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=500&q=80",
    ],
  },
];

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "The Pepper Mill",
    cuisine: "Modern Indian",
    area: "Bodakdev",
    cover:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
    dishes: [
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: 2,
    name: "Mitti Café",
    cuisine: "Café & Bakery",
    area: "Navrangpura",
    cover:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85",
    dishes: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: 3,
    name: "House of Dosa",
    cuisine: "South Indian",
    area: "Prahlad Nagar",
    cover:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1000&q=85",
    dishes: [
      "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80",
    ],
  },
];

export const collabHistory = [
  { restaurant: "Mitti Café", date: "Aug 28, 2026", engagement: "8.4K" },
  { restaurant: "House of Dosa", date: "Aug 02, 2026", engagement: "12.1K" },
  { restaurant: "Olive & Thyme", date: "Jul 16, 2026", engagement: "6.8K" },
];
