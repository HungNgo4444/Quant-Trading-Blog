import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Brain, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { blogService } from '@/lib/blogService';
import { blogSettingsService, BlogSettings } from '@/lib/blogSettings';

const About = () => {
  const [stats, setStats] = useState([
    { label: 'Bài viết', value: '0', icon: TrendingUp },
    { label: 'Chủ đề', value: '0', icon: BarChart3 },
    { label: 'Lượt xem', value: '0', icon: Brain },
    { label: 'Lượt thích', value: '0', icon: Target },
  ]);
  
  const [settings, setSettings] = useState<BlogSettings | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load stats
        const posts = await blogService.getAllPosts();
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
        
        // Get unique tags
        const allTags = posts.flatMap(post => post.tags);
        const uniqueTags = new Set(allTags);

        setStats([
          { label: 'Bài viết', value: `${posts.length}+`, icon: TrendingUp },
          { label: 'Chủ đề', value: `${uniqueTags.size}+`, icon: BarChart3 },
          { label: 'Lượt xem', value: `${totalViews}+`, icon: Brain },
          { label: 'Lượt thích', value: `${totalLikes}+`, icon: Target },
        ]);

        // Load settings
        const blogSettings = await blogSettingsService.getSettings();
        setSettings(blogSettings);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Về {settings?.blogTitle || 'Quantitative Trading Blog'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {settings?.blogDescription || 'Chào mừng bạn đến với blog chuyên về giao dịch định lượng! Đây là nơi tôi chia sẻ kiến thức, kinh nghiệm và những khám phá trong thế giới Quantitative Trading. Từ những khái niệm cơ bản đến các chiến lược phức tạp, tôi hy vọng sẽ giúp bạn hiểu rõ hơn về lĩnh vực thú vị này.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="p-0">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {settings?.missionTitle || 'Mục tiêu của blog'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Giáo dục</h3>
                <p className="text-gray-600">
                  {settings?.educationDescription || 'Chia sẻ kiến thức về Quantitative Trading từ cơ bản đến nâng cao'}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Thực hành</h3>
                <p className="text-gray-600">
                  {settings?.practiceDescription || 'Hướng dẫn thực hiện backtesting và phát triển trading strategies'}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Nghiên cứu</h3>
                <p className="text-gray-600">
                  {settings?.researchDescription || 'Khám phá các phương pháp mới trong machine learning và AI trading'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* About Author */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Về tác giả
          </h2>
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img 
                    src={settings?.authorImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"} 
                    alt="Author"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {settings?.authorName || 'Quant Trader & Developer'}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">Machine Learning</Badge>
                    <Badge variant="outline">Financial Analysis</Badge>
                    <Badge variant="outline">Algorithmic Trading</Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {settings?.authorBio || 'Với nhiều năm kinh nghiệm trong lĩnh vực tài chính và công nghệ, tôi đam mê nghiên cứu và phát triển các chiến lược giao dịch định lượng. Tôi tin rằng việc kết hợp kiến thức toán học, thống kê và lập trình có thể tạo ra những cơ hội đầu tư hiệu quả và bền vững.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Covered */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Chủ đề chính
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(settings?.mainTopics || [
              'Quantitative Analysis',
              'Python for Finance',
              'Backtesting Strategies',
              'Risk Management',
              'Portfolio Optimization',
              'Machine Learning in Trading',
              'Statistical Arbitrage',
              'Market Microstructure',
              'Algorithmic Trading'
            ]).map((topic, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-gray-900">{topic}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Liên hệ
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Bạn có câu hỏi về Quantitative Trading hoặc muốn thảo luận về các chiến lược? 
            Tôi rất mong được trao đổi với bạn!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="px-4 py-2">
              📧 {settings?.contactEmail || 'quanttrader@example.com'}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              💼 {settings?.linkedinUrl || 'LinkedIn: Quant Trader'}
            </Badge>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default About;
