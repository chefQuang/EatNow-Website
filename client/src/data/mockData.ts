// client/src/data/mockData.ts

export interface Review {
  id: number;
  user: string;
  avatar: string; // Chữ cái đầu
  rating: number;
  comment: string;
  image?: string;
  date: string;
}

export interface Dish {
  id: number;
  name: string;
  desc: string;
  price: string;
  image: string;
  gallery: string[]; // Ảnh phụ
  origin: string; // Xuất xứ
  history: string; // Câu chuyện món ăn
  calories: number;
  nutrition: {
    protein: number; // %
    fat: number; // %
    carbs: number; // %
  };
  reviews: Review[];
}

export const DISHES: Dish[] = [
  {
    id: 1,
    name: "Phở Bò Đặc Biệt",
    desc: "Hương vị truyền thống Việt Nam với nước dùng đậm đà.",
    price: "55.000đ",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=1974&auto=format&fit=crop",
    gallery: [
       "https://images.unsplash.com/photo-1634863644365-2a2a0d95d527?q=80&w=1935",
       "https://images.unsplash.com/photo-1510694220516-43b672728469?q=80&w=1956"
    ],
    origin: "Nam Định / Hà Nội, Việt Nam",
    history: "Phở ra đời vào đầu thế kỷ 20, là sự giao thoa tinh tế...",
    calories: 450,
    nutrition: { protein: 30, fat: 20, carbs: 50 },
    reviews: [
      { id: 1, user: "Minh Anh", avatar: "M", rating: 5, comment: "Nước dùng rất ngọt, thịt mềm!", date: "2023-11-20" },
      { id: 2, user: "John Doe", avatar: "J", rating: 4, comment: "Amazing taste!", date: "2023-11-18" }
    ]
  },
  {
    id: 2,
    name: "Burger Bò Wagyu",
    desc: "Thịt bò Wagyu thượng hạng nướng than hoa.",
    price: "150.000đ",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
    gallery: [],
    origin: "Hamburg, Đức (Biến thể hiện đại kiểu Mỹ)",
    history: "Burger bò Wagyu nâng tầm thức ăn nhanh thành nghệ thuật...",
    calories: 850,
    nutrition: { protein: 25, fat: 45, carbs: 30 },
    reviews: []
  },
  // ... Bạn có thể thêm các món khác tương tự
  {
    id: 3,
    name: "Sushi Sashimi Set",
    desc: "Hải sản tươi sống nhập khẩu trực tiếp.",
    price: "300.000đ",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
    gallery: [],
    origin: "Nhật Bản",
    history: "Nghệ thuật Sashimi có từ thời Muromachi...",
    calories: 300,
    nutrition: { protein: 60, fat: 10, carbs: 30 },
    reviews: []
  },
  {
    id: 4,
    name: "Pizza Pepperoni",
    desc: "Đế bánh mỏng giòn tan, sốt cà chua tươi.",
    price: "120.000đ",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop",
    gallery: [],
    origin: "Naples, Ý",
    history: "Pizza hiện đại bắt nguồn từ Naples vào thế kỷ 18...",
    calories: 700,
    nutrition: { protein: 15, fat: 35, carbs: 50 },
    reviews: []
  }
];