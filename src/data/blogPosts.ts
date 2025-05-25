export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  imageUrl?: string;
  readTime: number;
  views?: number;
  likes?: number;
  shares?: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Giới thiệu về Quantitative Trading",
    content: `# Giới thiệu về Quantitative Trading

Quantitative Trading (hay còn gọi là Quant Trading) là phương pháp giao dịch sử dụng các mô hình toán học và thuật toán để đưa ra quyết định đầu tư. Đây là một lĩnh vực kết hợp giữa tài chính, toán học, thống kê và khoa học máy tính.

## Tại sao Quant Trading lại quan trọng?

1. **Loại bỏ cảm xúc**: Các quyết định được đưa ra dựa trên dữ liệu và logic, không phải cảm xúc
2. **Tốc độ xử lý**: Máy tính có thể phân tích hàng ngàn cơ hội đầu tư trong thời gian ngắn
3. **Backtesting**: Có thể kiểm tra chiến lược trên dữ liệu lịch sử
4. **Quản lý rủi ro**: Tự động áp dụng các quy tắc quản lý rủi ro

## Các bước cơ bản trong Quant Trading

### 1. Thu thập dữ liệu
- Dữ liệu giá lịch sử
- Dữ liệu cơ bản của công ty
- Dữ liệu kinh tế vĩ mô
- Dữ liệu sentiment

### 2. Phân tích và xây dựng mô hình
- Phân tích thống kê
- Machine Learning
- Deep Learning
- Time Series Analysis

### 3. Backtesting
- Kiểm tra hiệu suất trên dữ liệu lịch sử
- Đánh giá rủi ro
- Tối ưu hóa tham số

### 4. Triển khai và giám sát
- Tự động hóa giao dịch
- Giám sát hiệu suất real-time
- Điều chỉnh khi cần thiết

## Kết luận

Quant Trading là một lĩnh vực thú vị và đầy tiềm năng. Tuy nhiên, cần có kiến thức vững chắc về toán học, thống kê và lập trình để thành công trong lĩnh vực này.`,
    excerpt: "Tìm hiểu về Quantitative Trading - phương pháp giao dịch sử dụng mô hình toán học và thuật toán để đưa ra quyết định đầu tư hiệu quả.",
    author: "Admin",
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["Quant Trading", "Algorithmic Trading", "Finance"],
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    readTime: 5
  },
  {
    id: "2",
    title: "Python cho Quantitative Analysis",
    content: `# Python cho Quantitative Analysis

Python đã trở thành ngôn ngữ lập trình phổ biến nhất trong lĩnh vực tài chính định lượng. Bài viết này sẽ giới thiệu các thư viện Python quan trọng cho Quant Analysis.

## Tại sao chọn Python?

1. **Dễ học và sử dụng**: Cú pháp đơn giản, dễ hiểu
2. **Thư viện phong phú**: Nhiều thư viện chuyên dụng cho tài chính
3. **Cộng đồng lớn**: Hỗ trợ tốt từ cộng đồng
4. **Tích hợp tốt**: Dễ dàng tích hợp với các hệ thống khác

## Các thư viện quan trọng

### 1. NumPy và Pandas
\`\`\`python
import numpy as np
import pandas as pd

# Tạo dữ liệu giá cổ phiếu
dates = pd.date_range('2023-01-01', periods=100)
prices = np.random.randn(100).cumsum() + 100
df = pd.DataFrame({'price': prices}, index=dates)
\`\`\`

### 2. Matplotlib và Seaborn
\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns

# Vẽ biểu đồ giá
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['price'])
plt.title('Stock Price Movement')
plt.show()
\`\`\`

### 3. QuantLib
\`\`\`python
import QuantLib as ql

# Tính giá option Black-Scholes
spot = 100
strike = 105
rate = 0.05
volatility = 0.2
maturity = 1.0

option_price = ql.blackScholesMerton(
    spot, strike, rate, 0, volatility, maturity
)
\`\`\`

### 4. Zipline và Backtrader
\`\`\`python
import backtrader as bt

class SimpleStrategy(bt.Strategy):
    def next(self):
        if self.data.close[0] > self.data.close[-1]:
            self.buy()
        elif self.data.close[0] < self.data.close[-1]:
            self.sell()
\`\`\`

## Ví dụ thực tế: Tính toán Sharpe Ratio

\`\`\`python
def calculate_sharpe_ratio(returns, risk_free_rate=0.02):
    excess_returns = returns - risk_free_rate/252
    return excess_returns.mean() / excess_returns.std() * np.sqrt(252)

# Tính Sharpe ratio
daily_returns = df['price'].pct_change().dropna()
sharpe = calculate_sharpe_ratio(daily_returns)
print(f"Sharpe Ratio: {sharpe:.2f}")
\`\`\`

## Kết luận

Python cung cấp một hệ sinh thái mạnh mẽ cho Quantitative Analysis. Việc thành thạo các thư viện này sẽ giúp bạn phát triển các chiến lược giao dịch hiệu quả.`,
    excerpt: "Khám phá các thư viện Python quan trọng cho Quantitative Analysis và cách sử dụng chúng trong phân tích tài chính.",
    author: "Admin",
    publishedAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    tags: ["Python", "Programming", "Data Analysis"],
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
    readTime: 8
  },
  {
    id: "3",
    title: "Backtesting Strategies với Python",
    content: `# Backtesting Strategies với Python

Backtesting là quá trình kiểm tra hiệu suất của một chiến lược giao dịch trên dữ liệu lịch sử. Đây là bước quan trọng trước khi triển khai chiến lược trong thực tế.

## Tại sao Backtesting quan trọng?

1. **Đánh giá hiệu suất**: Xem chiến lược có sinh lời không
2. **Quản lý rủi ro**: Hiểu được mức độ rủi ro
3. **Tối ưu hóa**: Điều chỉnh tham số để cải thiện hiệu suất
4. **Xây dựng niềm tin**: Tăng độ tin cậy vào chiến lược

## Các bước Backtesting

### 1. Chuẩn bị dữ liệu
\`\`\`python
import pandas as pd
import numpy as np
import yfinance as yf

# Tải dữ liệu
ticker = "AAPL"
data = yf.download(ticker, start="2020-01-01", end="2023-12-31")
\`\`\`

### 2. Định nghĩa chiến lược
\`\`\`python
def moving_average_strategy(data, short_window=20, long_window=50):
    signals = pd.DataFrame(index=data.index)
    signals['price'] = data['Close']
    
    # Tính moving averages
    signals['short_ma'] = data['Close'].rolling(window=short_window).mean()
    signals['long_ma'] = data['Close'].rolling(window=long_window).mean()
    
    # Tạo tín hiệu
    signals['signal'] = 0
    signals['signal'][short_window:] = np.where(
        signals['short_ma'][short_window:] > signals['long_ma'][short_window:], 1, 0
    )
    
    # Tạo positions
    signals['positions'] = signals['signal'].diff()
    
    return signals
\`\`\`

### 3. Tính toán returns
\`\`\`python
def calculate_returns(signals):
    # Tính daily returns
    signals['returns'] = signals['price'].pct_change()
    
    # Tính strategy returns
    signals['strategy_returns'] = signals['returns'] * signals['signal'].shift(1)
    
    # Tính cumulative returns
    signals['cumulative_returns'] = (1 + signals['returns']).cumprod()
    signals['cumulative_strategy_returns'] = (1 + signals['strategy_returns']).cumprod()
    
    return signals
\`\`\`

### 4. Đánh giá hiệu suất
\`\`\`python
def evaluate_strategy(signals):
    # Total return
    total_return = signals['cumulative_strategy_returns'].iloc[-1] - 1
    
    # Sharpe ratio
    sharpe_ratio = signals['strategy_returns'].mean() / signals['strategy_returns'].std() * np.sqrt(252)
    
    # Maximum drawdown
    rolling_max = signals['cumulative_strategy_returns'].expanding().max()
    drawdown = (signals['cumulative_strategy_returns'] - rolling_max) / rolling_max
    max_drawdown = drawdown.min()
    
    # Win rate
    winning_trades = signals['strategy_returns'][signals['strategy_returns'] > 0]
    win_rate = len(winning_trades) / len(signals['strategy_returns'][signals['strategy_returns'] != 0])
    
    return {
        'Total Return': f"{total_return:.2%}",
        'Sharpe Ratio': f"{sharpe_ratio:.2f}",
        'Max Drawdown': f"{max_drawdown:.2%}",
        'Win Rate': f"{win_rate:.2%}"
    }
\`\`\`

## Ví dụ hoàn chỉnh

\`\`\`python
# Chạy backtest
signals = moving_average_strategy(data)
signals = calculate_returns(signals)
results = evaluate_strategy(signals)

print("Backtest Results:")
for metric, value in results.items():
    print(f"{metric}: {value}")

# Vẽ biểu đồ
import matplotlib.pyplot as plt

plt.figure(figsize=(15, 10))

plt.subplot(2, 1, 1)
plt.plot(signals.index, signals['price'], label='Price')
plt.plot(signals.index, signals['short_ma'], label='Short MA')
plt.plot(signals.index, signals['long_ma'], label='Long MA')
plt.legend()
plt.title('Price and Moving Averages')

plt.subplot(2, 1, 2)
plt.plot(signals.index, signals['cumulative_returns'], label='Buy & Hold')
plt.plot(signals.index, signals['cumulative_strategy_returns'], label='Strategy')
plt.legend()
plt.title('Cumulative Returns')

plt.tight_layout()
plt.show()
\`\`\`

## Lưu ý quan trọng

1. **Overfitting**: Tránh tối ưu hóa quá mức trên dữ liệu lịch sử
2. **Transaction costs**: Tính toán phí giao dịch
3. **Slippage**: Xem xét độ trượt giá
4. **Out-of-sample testing**: Kiểm tra trên dữ liệu ngoài mẫu

## Kết luận

Backtesting là công cụ mạnh mẽ để đánh giá chiến lược giao dịch. Tuy nhiên, cần thận trọng và hiểu rõ các hạn chế để có kết quả đáng tin cậy.`,
    excerpt: "Hướng dẫn chi tiết về cách thực hiện backtesting strategies với Python, từ chuẩn bị dữ liệu đến đánh giá hiệu suất.",
    author: "Admin",
    publishedAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
    tags: ["Backtesting", "Python", "Strategy Testing"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    readTime: 10
  }
];

export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
  );
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}; 