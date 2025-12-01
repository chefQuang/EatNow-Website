import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // <--- Import file mới
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import './App.css'; // Import file CSS chúng ta đã sửa ở bước trước

function App() {
  return (
    <Router>
      <Routes>
        {/* Nếu người dùng vào trang chủ (/), tự động chuyển sang (/login) */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Đường dẫn đến trang Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Các trang giữ chỗ (Placeholder) */}
        <Route path="/admin" element={<h1 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Trang Quản Trị (Admin)</h1>} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;