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
app.use(bodyParser.json());

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

// --- ROUTES ---

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

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});