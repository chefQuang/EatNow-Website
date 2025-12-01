const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Riêng các Type thì vẫn import được
import type { Request, Response } from 'express';

const app = express();
const PORT = 5000;
const SECRET_KEY = "eatnow_secret_key_2024";

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

// --- DATABASE CHO MÓN ĂN ---
// Định nghĩa lại Interface cho chắc chắn
interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  image?: string;
  date: string;
}

interface Dish {
  id: number;
  name: string;
  desc: string;
  price: string;
  image: string;
  gallery: string[];
  origin: string;
  history: string;
  calories: number;
  nutrition: { protein: number; fat: number; carbs: number };
  reviews: Review[];
}

const DISHES: Dish[] = [
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

// --- MOCK DATABASE ---
interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

const users: User[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Admin Master' },
  { id: 2, username: 'user', password: '123', role: 'user', name: 'Khách hàng thân thiết' }
];  

app.get('/api/users', (req: Request, res: Response) => {
  res.json(users);
});

// --- ROUTES ---

console.log("--- ĐANG KHỞI TẠO API PRODUCTS ---");

// 1. API Đăng ký
app.post('/api/register', (req: Request, res: Response): any => {
  const { username, password, name } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Tài khoản đã tồn tại!' });
  }

  const newUser: User = {
    id: users.length + 1,
    username,
    password,
    role: 'user',
    name: name || 'New User'
  };

  users.push(newUser);
  return res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
});

// 2. API Đăng nhập
app.post('/api/login', (req: Request, res: Response): any => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  return res.json({
    message: 'Đăng nhập thành công',
    token,
    user: { id: user.id, username: user.username, role: user.role, name: user.name }
  });
}); 
// <-- Dấu đóng ngoặc quan trọng cho hàm app.post

// --- CÁC API MỚI CHO SẢN PHẨM ---

// 1. Lấy danh sách tất cả món ăn (Cho trang Home và Search)
app.get('/api/products', (req: Request, res: Response) => {
  res.json(DISHES);
});

// 2. Lấy chi tiết 1 món ăn (Cho trang ProductDetail)
app.get('/api/products/:id', (req: Request, res: Response): any => {
  const id = Number(req.params.id);
  const dish = DISHES.find(d => d.id === id);
  if (!dish) return res.status(404).json({ message: "Không tìm thấy món ăn" });
  res.json(dish);
});

// 3. Đăng Review mới (QUAN TRỌNG NHẤT)
app.post('/api/products/:id/reviews', (req: Request, res: Response): any => {
  const id = Number(req.params.id);
  const { user, avatar, rating, comment, image } = req.body;
  
  const dish = DISHES.find(d => d.id === id);
  if (!dish) return res.status(404).json({ message: "Không tìm thấy món ăn" });

  const newReview: Review = {
    id: Date.now(),
    user,
    avatar,
    rating,
    comment,
    image,
    date: new Date().toLocaleDateString('vi-VN')
  };

  // Thêm review vào đầu mảng
  dish.reviews.unshift(newReview);

  // Trả về danh sách review mới nhất để Frontend cập nhật ngay
  res.json({ message: "Đăng thành công", reviews: dish.reviews });
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});