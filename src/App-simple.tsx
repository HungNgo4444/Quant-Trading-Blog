import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function SimpleApp() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          🚀 Quantitative Trading Blog
        </h1>
        <p className="text-center mt-4 text-gray-600">
          Testing simple version - if you see this, the basic setup works!
        </p>
        
        <div className="max-w-4xl mx-auto mt-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Trang chủ</h2>
                <p>✅ React Router hoạt động</p>
                <p>✅ Tailwind CSS hoạt động</p>
                <p>✅ Vite build hoạt động</p>
              </div>
            } />
            <Route path="/test" element={
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Test Page</h2>
                <p>Routing hoạt động tốt!</p>
              </div>
            } />
          </Routes>
        </div>
        
        <div className="text-center mt-8">
          <a href="/test" className="text-blue-500 hover:underline mr-4">Test Page</a>
          <a href="/" className="text-blue-500 hover:underline">Home</a>
        </div>
      </div>
    </Router>
  );
}

export default SimpleApp; 