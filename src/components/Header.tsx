
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">KnowledgeShare</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Giới thiệu
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
              Admin
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin">Viết bài</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
