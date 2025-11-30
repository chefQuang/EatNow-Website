import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert(`Chào mừng quay trở lại Eat Now, ${res.data.user.name}!`); // Đổi thông báo

      if (res.data.user.role === 'admin') {
        navigate('/admin'); 
      } else {
        navigate('/home'); // Chuyển đến trang home
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo / Brand Name mới */}
        <div className="brand-section">
            <div className="brand-subtitle">Are you hungry?</div> {/* Sửa slogan cho hợp tên mới */}
            <h1 className="brand-title">Eat Now</h1>
            <p className="login-desc">Đăng nhập để đặt món ngay lập tức</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Tài khoản</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username (vd: admin)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button type="submit" className="login-btn">
            Đăng Nhập
          </button>
        </form>

        <div className="register-link">
          Chưa có tài khoản? <span>Đăng ký ngay</span>
        </div>
      </div>
    </div>
  );
};

export default Login;