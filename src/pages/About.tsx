
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Target, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Bài viết', value: '100+', icon: BookOpen },
    { label: 'Độc giả', value: '5000+', icon: Users },
    { label: 'Chủ đề', value: '20+', icon: Target },
    { label: 'Lượt thích', value: '1000+', icon: Heart },
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'Founder & Senior Developer',
      bio: 'Với hơn 8 năm kinh nghiệm trong phát triển web, chuyên về React, Node.js và cloud computing.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Trần Thị B',
      role: 'Technical Writer & Frontend Expert',
      bio: 'Chuyên gia về UX/UI và frontend development, đam mê chia sẻ kiến thức về thiết kế và công nghệ.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7d4?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Lê Văn C',
      role: 'Backend Engineer & DevOps',
      bio: 'Chuyên sâu về backend architecture, database design và DevOps practices.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Về KnowledgeShare
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi là một cộng đồng những người đam mê công nghệ, luôn khao khát chia sẻ 
            kiến thức và học hỏi từ nhau. Sứ mệnh của chúng tôi là tạo ra một không gian 
            học tập chất lượng, nơi mọi người có thể tiếp cận với những kiến thức mới nhất 
            về lập trình và công nghệ.
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
              Sứ mệnh của chúng tôi
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Chia sẻ kiến thức</h3>
                <p className="text-gray-600">
                  Tạo ra những bài viết chất lượng, dễ hiểu về các công nghệ mới nhất
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Xây dựng cộng đồng</h3>
                <p className="text-gray-600">
                  Kết nối các developer, tạo môi trường học tập và trao đổi kinh nghiệm
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Phát triển kỹ năng</h3>
                <p className="text-gray-600">
                  Giúp mọi người nâng cao kỹ năng lập trình và tiến bộ trong sự nghiệp
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Đội ngũ của chúng tôi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6 text-center">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <Badge variant="outline" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Bạn có ý tưởng cho bài viết mới hoặc muốn đóng góp cho cộng đồng? 
            Chúng tôi rất mong được nghe từ bạn!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="px-4 py-2">
              📧 contact@knowledgeshare.dev
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              💬 Discord: KnowledgeShare Community
            </Badge>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default About;
