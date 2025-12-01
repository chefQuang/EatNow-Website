import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', {
        name,
        username,
        password
      });

      setIsSuccess(true);
      setError('');
      
    } catch (err: any) {
      console.error(err);
      if (err.code === "ERR_NETWORK") {
         setError("Không kết nối được Server (Bạn đã mở terminal backend chưa?)");
      } else {
         setError(err.response?.data?.message || 'Đăng ký thất bại!');
      }
    }
  };

  // --- GIAO DIỆN KHI ĐĂNG KÝ THÀNH CÔNG ---
  if (isSuccess) {
    return (
      // Dùng class "login-wrapper" giống bên Login
      <div className="login-wrapper"> 
        <div className="login-card">
          <div className="success-view">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Tuyệt vời!</h2>
            <p className="success-desc">
              Tài khoản <b>{username}</b> đã được tạo thành công.<br/>
              Chào mừng bạn đến với Eat Now.
            </p>
            <button className="login-btn" onClick={() => navigate('/login')}>
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN FORM ĐĂNG KÝ ---
  return (
    <div className="login-wrapper"> {/* Đổi thành login-wrapper */}
      <div className="login-card">
        <div className="brand-section">
            <div className="brand-subtitle">Join us today</div>
            <h1 className="brand-title">Eat Now</h1>
            <p className="login-desc">Tạo tài khoản để đặt món nhanh chóng</p>
        </div>

        {error && <div style={{
            backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', 
            borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px'
        }}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Họ và Tên</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tài khoản</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Chọn tên đăng nhập"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tạo mật khẩu"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Đăng Ký
          </button>
        </form>

        <div className="register-link">
          Đã có tài khoản? <span onClick={() => navigate('/login')}>Đăng nhập</span>
        </div>
      </div>
    </div>
  );
};

export default Register;