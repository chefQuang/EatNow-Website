import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios để gọi API
// Chỉ import Type, KHÔNG import biến DISHES nữa
import { type Dish, type Review } from '../data/mockData'; 
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState<Dish | null>(null);
  const [activeTab, setActiveTab] = useState<'origin' | 'nutrition' | 'reviews'>('reviews');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form State
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState('');
  const [myImage, setMyImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- 1. THAY ĐỔI: Lấy dữ liệu từ Server thay vì file local ---
  const fetchDishData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setDish(res.data);
    } catch (error) {
      console.error("Lỗi lấy món ăn:", error);
    }
  };

  useEffect(() => {
    fetchDishData(); // Gọi hàm lấy dữ liệu khi mới vào trang

    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, [id]);

  // Xử lý ảnh (giữ nguyên logic preview local)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setMyImage(imageUrl);
    }
  };

  // --- 2. THAY ĐỔI: Gửi Review lên Server ---
  const handleSubmitReview = async () => {
    if (!myComment.trim()) return alert("Hãy viết vài dòng cảm nhận nhé!");
    if (!dish) return;

    try {
      // Gọi API POST lên Server
      const res = await axios.post(`http://localhost:5000/api/products/${dish.id}/reviews`, {
        user: currentUser ? currentUser.name : "Khách ẩn danh",
        avatar: currentUser ? currentUser.name.charAt(0).toUpperCase() : "G",
        rating: myRating,
        comment: myComment,
        image: myImage
      });

      // Server trả về danh sách review mới nhất, ta cập nhật state
      setDish({ ...dish, reviews: res.data.reviews });

      // Reset Form & Hiệu ứng
      setShowSuccess(true);
      setTimeout(() => {
          setShowSuccess(false);
          setMyComment('');
          setMyImage(null);
          setMyRating(5);
      }, 2000);

    } catch (error) {
      alert("Lỗi khi đăng bài!");
      console.error(error);
    }
  };

  if (!dish) return <div className="loading">Đang tải món ngon...</div>;

  // Tính toán biểu đồ tròn (Giữ nguyên)
  const { protein, fat, carbs } = dish.nutrition;
  const pieStyle = {
    background: `conic-gradient(#AD343E 0% ${protein}%, #F59E0B ${protein}% ${protein + fat}%, #10B981 ${protein + fat}% 100%)`
  };

  return (
    <div className="product-detail-wrapper">
      <button className="back-btn" onClick={() => navigate('/home')}>⬅</button>

      <div className="product-hero" style={{backgroundImage: `url(${dish.image})`}}>
        <div className="hero-info">
          <h1 style={{fontSize: '48px', fontFamily: 'Playfair Display'}}>{dish.name}</h1>
          <p style={{fontSize: '24px', opacity: 0.9}}>{dish.price}</p>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'origin' ? 'active' : ''}`} onClick={() => setActiveTab('origin')}>🏛 Xuất Xứ</button>
          <button className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveTab('nutrition')}>📊 Dinh Dưỡng</button>
          <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>⭐ Cộng Đồng ({dish.reviews.length})</button>
        </div>

        <div className="tab-content">
          {activeTab === 'origin' && (
             <div className="origin-content">
                <h3 style={{color: 'var(--primary-color)'}}>{dish.origin}</h3>
                <p>{dish.history}</p>
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                   {dish.gallery.map((img, idx) => <img key={idx} src={img} alt="" style={{width: '150px', borderRadius: '8px'}} />)}
                </div>
             </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="chart-container">
               <div className="pie-chart" style={pieStyle}>
                  <div className="pie-center">
                    <span style={{fontSize: '24px', fontWeight: 'bold'}}>{dish.calories}</span><span style={{fontSize: '12px'}}>CALORIES</span>
                  </div>
               </div>
               <div className="chart-legend">
                  <div className="legend-item"><div className="color-box" style={{background: '#AD343E'}}></div><span>Protein: <b>{protein}%</b></span></div>
                  <div className="legend-item"><div className="color-box" style={{background: '#F59E0B'}}></div><span>Fat: <b>{fat}%</b></span></div>
                  <div className="legend-item"><div className="color-box" style={{background: '#10B981'}}></div><span>Carbs: <b>{carbs}%</b></span></div>
               </div>
            </div>
          )}

          {/* --- TAB REVIEWS (UPDATED) --- */}
          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <div className="review-form-card">
                 <h3 style={{marginTop: 0, fontSize: '18px'}}>Chia sẻ trải nghiệm của bạn</h3>
                 <div style={{marginBottom: '10px'}}>
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={`star ${star <= myRating ? '' : 'gray'}`} onClick={() => setMyRating(star)} style={{fontSize: '24px'}}>★</span>
                    ))}
                    <span style={{marginLeft: '10px', fontWeight: 'bold', color: '#AD343E'}}>{myRating}/5 Tuyệt vời</span>
                 </div>
                 <textarea 
                   className="form-textarea" rows={3} 
                   placeholder={`Bạn nghĩ gì về món này, ${currentUser?.name || 'bạn'} ơi?`}
                   value={myComment} onChange={(e) => setMyComment(e.target.value)}
                 />
                 {myImage && (
                    <div style={{marginBottom: '15px', position: 'relative', display: 'inline-block'}}>
                        <img src={myImage} alt="Preview" className="image-preview" />
                        <button onClick={() => setMyImage(null)} style={{position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'}}>×</button>
                    </div>
                 )}
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label className="file-upload-label">
                       <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                       <span>📷 Thêm ảnh</span>
                    </label>
                    <button onClick={handleSubmitReview} style={{background: 'var(--primary-color)', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(173, 52, 62, 0.3)'}}>
                       {showSuccess ? 'Đã đăng! 🎉' : 'Đăng bài viết'}
                    </button>
                 </div>
              </div>

              <div className="review-list">
                {dish.reviews.map(review => (
                  <div key={review.id} className="review-post">
                     <div className="post-header">
                        <div className="author-info">
                           <div className="author-avatar">{review.avatar}</div>
                           <div>
                              <div className="author-name">{review.user}</div>
                              <div className="post-date">{review.date}</div>
                           </div>
                        </div>
                        <div className="post-rating">★ {review.rating}/5</div>
                     </div>
                     <div className="post-content">{review.comment}</div>
                     {review.image && <img src={review.image} alt="User review" className="post-image" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
  );
};

export default ProductDetail;