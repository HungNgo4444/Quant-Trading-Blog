export interface BlogSettings {
  id?: string;
  blogTitle: string;
  blogDescription: string;
  authorName: string;
  authorBio: string;
  authorImage: string;
  contactEmail: string;
  linkedinUrl: string;
  mainTopics: string[];
  missionTitle: string;
  missionDescription: string;
  educationDescription: string;
  practiceDescription: string;
  researchDescription: string;
  updatedAt?: string;
}

const defaultSettings: BlogSettings = {
  blogTitle: "Quantitative Trading Blog",
  blogDescription: "Chào mừng bạn đến với blog chuyên về giao dịch định lượng! Đây là nơi tôi chia sẻ kiến thức, kinh nghiệm và những khám phá trong thế giới Quantitative Trading. Từ những khái niệm cơ bản đến các chiến lược phức tạp, tôi hy vọng sẽ giúp bạn hiểu rõ hơn về lĩnh vực thú vị này.",
  authorName: "Quant Trader & Developer",
  authorBio: "Với nhiều năm kinh nghiệm trong lĩnh vực tài chính và công nghệ, tôi đam mê nghiên cứu và phát triển các chiến lược giao dịch định lượng. Tôi tin rằng việc kết hợp kiến thức toán học, thống kê và lập trình có thể tạo ra những cơ hội đầu tư hiệu quả và bền vững.",
  authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  contactEmail: "quanttrader@example.com",
  linkedinUrl: "LinkedIn: Quant Trader",
  mainTopics: [
    'Quantitative Analysis',
    'Python for Finance', 
    'Backtesting Strategies',
    'Risk Management',
    'Portfolio Optimization',
    'Machine Learning in Trading',
    'Statistical Arbitrage',
    'Market Microstructure',
    'Algorithmic Trading'
  ],
  missionTitle: "Mục tiêu của blog",
  missionDescription: "Chia sẻ kiến thức và kinh nghiệm về Quantitative Trading",
  educationDescription: "Chia sẻ kiến thức về Quantitative Trading từ cơ bản đến nâng cao",
  practiceDescription: "Hướng dẫn thực hiện backtesting và phát triển trading strategies",
  researchDescription: "Khám phá các phương pháp mới trong machine learning và AI trading"
};

// FORCE DATABASE MODE - NO MOCK
const getSupabase = async () => {
  try {
    const { supabase } = await import('./supabase');
    return supabase;
  } catch (error) {
    console.error('Failed to load Supabase:', error);
    throw error;
  }
};

export const blogSettingsService = {
  async getSettings(): Promise<BlogSettings> {
    try {
      // FORCE DATABASE MODE - NO MOCK
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('blog_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data || defaultSettings;
    } catch (error) {
      console.error('Error fetching blog settings:', error);
      throw error;
    }
  },

  async updateSettings(settings: Partial<BlogSettings>): Promise<BlogSettings | null> {
    try {
      // FORCE DATABASE MODE - NO MOCK
      const supabase = await getSupabase();
      
      // First try to update existing settings
      const { data: existingData } = await supabase
        .from('blog_settings')
        .select('id')
        .single();

      const settingsData = {
        ...settings,
        updatedAt: new Date().toISOString()
      };

      if (existingData) {
        // Update existing
        const { data, error } = await supabase
          .from('blog_settings')
          .update(settingsData)
          .eq('id', existingData.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('blog_settings')
          .insert([{ ...settingsData, id: '1' }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error updating blog settings:', error);
      throw error;
    }
  },

  async initializeDefaultSettings(): Promise<void> {
    try {
      // FORCE DATABASE MODE - NO MOCK
      const supabase = await getSupabase();
      const { data } = await supabase
        .from('blog_settings')
        .select('id')
        .single();

      if (!data) {
        await this.updateSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error initializing default settings:', error);
      throw error;
    }
  }
}; 