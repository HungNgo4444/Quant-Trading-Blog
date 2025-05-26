import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext-safe';

// Simple mock components
const MockIndex = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">📊 Quantitative Trading Blog</h1>
          <div className="flex items-center space-x-4">
            <a href="/auth" className="text-blue-600 hover:text-blue-700">Đăng nhập</a>
          </div>
        </div>
      </div>
    </header>
    
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Blog Giao dịch Định lượng
        </h2>
        <p className="text-xl text-gray-600">
          Khám phá thế giới của Quantitative Trading và phân tích dữ liệu tài chính
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Bài viết mẫu {i}</h3>
            <p className="text-gray-600 mb-4">
              Đây là mô tả ngắn về bài viết giao dịch định lượng...
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>5 phút đọc</span>
              <span className="mx-2">•</span>
              <span>Quantitative Analysis</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

const MockAuth = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="admin@quantblog.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input 
            type="password" 
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="admin123"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
      <div className="mt-4 text-center">
        <a href="/" className="text-blue-600 hover:text-blue-700">← Quay về trang chủ</a>
      </div>
    </div>
  </div>
);

const MockAbout = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">📊 Quantitative Trading Blog</h1>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">Trang chủ</a>
            <a href="/about" className="text-blue-600 hover:text-blue-700">Giới thiệu</a>
          </div>
        </div>
      </div>
    </header>
    
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Về chúng tôi</h2>
      <p className="text-lg text-gray-600 mb-6">
        Blog chuyên về giao dịch định lượng, phân tích dữ liệu tài chính và các chiến lược đầu tư thông minh.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-3">Mục tiêu</h3>
          <p className="text-gray-600">
            Chia sẻ kiến thức về Quantitative Trading từ cơ bản đến nâng cao.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Chủ đề</h3>
          <p className="text-gray-600">
            Python, Machine Learning, Risk Management, Portfolio Optimization.
          </p>
        </div>
      </div>
    </main>
  </div>
);

function SafeApp() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<MockIndex />} />
            <Route path="/auth" element={<MockAuth />} />
            <Route path="/about" element={<MockAbout />} />
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">404 - Không tìm thấy trang</h2>
                  <a href="/" className="text-blue-600 hover:text-blue-700">← Quay về trang chủ</a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default SafeApp; 