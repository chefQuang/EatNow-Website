import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import './Home.css'; 

// Chỉ import Type, không import biến dữ liệu cứng nữa
import { type Dish } from '../data/mockData'; 

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 1. STATE DISHES: Mặc định là mảng rỗng
  const [dishes, setDishes] = useState<Dish[]>([]); 
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  const [currentSlide, setCurrentSlide] = useState(0);

  // State cho Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Dish[]>([]);

  // 2. GỌI API LẤY DỮ LIỆU TỪ SERVER
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin user
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));
        else navigate('/login');

        // Lấy danh sách món ăn từ Server
        const res = await axios.get('http://localhost:5000/api/products');
        setDishes(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi kết nối Server:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 3. LOGIC SLIDER TỰ ĐỘNG (Giữ nguyên)
  useEffect(() => {
    if (dishes.length === 0) return; // Nếu chưa có dữ liệu thì không chạy

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === dishes.length - 1 ? 0 : prev + 1));
    }, 4000); // 4 giây đổi 1 lần

    return () => clearInterval(interval);
  }, [dishes]); // Chạy lại khi dishes thay đổi

  const getAvatarChar = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  // 4. LOGIC SEARCH (Giữ nguyên)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setSearchResults([]);
    } else {
      // Tìm kiếm dựa trên danh sách dishes lấy từ Server
      const filtered = dishes.filter(d => d.name.toLowerCase().includes(value.toLowerCase()));
      setSearchResults(filtered);
    }
  };

  const handleSearchEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        navigate(`/product/${searchResults[0].id}`);
      }
    }
  };

  return (
    <div className="home-wrapper">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <line x1="3" y1="12" x2="21" y2="12"></line>
               <line x1="3" y1="6" x2="21" y2="6"></line>
               <line x1="3" y1="18" x2="21" y2="18"></line>
             </svg>
          </button>

          {/* THANH SEARCH (Giữ nguyên logic) */}
          <div style={{position: 'relative', width: '100%', maxWidth: '450px'}}>
             <div className="search-container">
               <span style={{color: '#888'}}>🔍</span>
               <input 
                 type="text" 
                 className="search-input" 
                 placeholder="Bạn muốn ăn gì hôm nay?"
                 value={searchTerm}
                 onChange={handleSearchChange}
                 onKeyDown={handleSearchEnter}
               />
             </div>
             
             {/* Dropdown Gợi ý */}
             {searchResults.length > 0 && (
               <ul style={{
                 position: 'absolute', top: '100%', left: 0, width: '100%',
                 background: 'white', listStyle: 'none', padding: 0, margin: '5px 0',
                 borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 50
               }}>
                 {searchResults.map(dish => (
                   <li 
                     key={dish.id}
                     onClick={() => navigate(`/product/${dish.id}`)}
                     style={{padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid #eee'}}
                   >
                      <div style={{fontWeight: 'bold'}}>{dish.name}</div>
                      <div style={{fontSize: '12px', color: '#888'}}>{dish.origin}</div>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </div>

        <div className="nav-right">
          <div className="user-info">
            <span className="user-name" style={{fontSize: '13px', color: '#888'}}>Xin chào,</span>
            <span style={{fontWeight: 'bold', fontSize: '15px'}}>{user?.name}</span>
          </div>
          <div className="user-avatar">
            {getAvatarChar(user?.name)}
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR (Giữ nguyên) --- */}
      <div className={`sidebar-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <h2 className="brand-title" style={{fontSize: '28px'}}>Eat Now</h2>
           <p style={{fontSize: '13px', margin: 0}}>Menu chức năng</p>
        </div>

        <div className="sidebar-menu">
           <div className="sidebar-item"><span className="sidebar-icon">✨</span> Chat với AI</div>
           <div className="sidebar-item"><span className="sidebar-icon">🎡</span> Vòng quay món ăn</div>
           <div className="sidebar-item"><span className="sidebar-icon">🔥</span> Món ăn Hot Trend</div>
           <div className="sidebar-item"><span className="sidebar-icon">🍲</span> Món truyền thống</div>
           <hr style={{margin: '20px 30px', borderTop: '1px solid #eee'}} />
           <div className="sidebar-item" onClick={() => { localStorage.clear(); navigate('/login'); }} style={{color: '#AD343E'}}>
             <span className="sidebar-icon">🚪</span> Đăng xuất
           </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="home-container">
        
        {/* LOGIC HIỂN THỊ SLIDER */}
        {isLoading ? (
            <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: '#888'}}>
                ⏳ Đang tải danh sách món ăn từ Server...<br/>
                <small>(Hãy đảm bảo bạn đã bật terminal backend nhé)</small>
            </div>
        ) : dishes.length > 0 ? (
          <div className="hero-slider">
            {dishes.map((dish, index) => (
              <div 
                key={dish.id} 
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${dish.image})`, cursor: 'pointer' }}
                onClick={() => navigate(`/product/${dish.id}`)}
              >
                <div className="slide-content">
                  <span style={{
                      background: '#AD343E', color: 'white', padding: '5px 15px', 
                      borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block'
                  }}>
                      Món ngon trong ngày
                  </span>
                  <h2 className="slide-title">{dish.name}</h2>
                  <p className="slide-desc">{dish.desc}</p>
                </div>
              </div>
            ))}
            <div className="slider-dots">
              {dishes.map((_, index) => (
                <div key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>
             ❌ Server không trả về món ăn nào cả. <br/>
             Hãy kiểm tra file <b>server/src/index.ts</b> xem đã có biến DISHES chưa.
          </div>
        )}

        {/* Categories (Giữ nguyên) */}
        <div className="category-section">
            <h3 className="section-title">Khám phá thực đơn</h3>
            <div className="category-grid">
                <div className="category-card">
                    <span className="cat-icon">🍔</span><span className="cat-name">Đồ ăn nhanh</span>
                </div>
                <div className="category-card">
                    <span className="cat-icon">🥤</span><span className="cat-name">Đồ uống</span>
                </div>
                <div className="category-card">
                    <span className="cat-icon">🥗</span><span className="cat-name">Healthy</span>
                </div>
                 <div className="category-card">
                    <span className="cat-icon">🍰</span><span className="cat-name">Tráng miệng</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Home;