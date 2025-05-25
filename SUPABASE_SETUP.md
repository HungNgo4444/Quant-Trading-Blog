# Hướng dẫn Setup Supabase cho Quantitative Trading Blog

## Bước 1: Tạo Project Supabase

1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập tài khoản
3. Tạo project mới:
   - Project name: `quantitative-trading-blog`
   - Database password: Tạo password mạnh
   - Region: Chọn gần nhất với bạn

## Bước 2: Lấy thông tin kết nối

1. Vào project dashboard
2. Vào **Settings** > **API**
3. Copy các thông tin sau:
   - **Project URL** (dạng: `https://ebcjduaadxsfrmdkinle.supabase.co`)
   - **anon public key** (dạng: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViY2pkdWFhZHhzZnJtZGtpbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTEzNDEsImV4cCI6MjA2Mzc2NzM0MX0.Kh4mgvAqisRpfWJRKFnZJj1NuSy-Vj9HC6hqf7bvi8U`)

## Bước 3: Tạo file .env

1. Tạo file `.env` trong thư mục root:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Thay thế `your-project-id` và `your-anon-key-here` bằng thông tin thực tế

## Bước 4: Tạo Database Schema

1. Vào **SQL Editor** trong Supabase dashboard
2. Copy toàn bộ nội dung file `supabase-schema.sql`
3. Paste vào SQL Editor và chạy (RUN)

## Bước 5: Cấu hình Authentication

1. Vào **Authentication** > **Settings**
2. Bật **Enable email confirmations**: OFF (để test dễ hơn)
3. Vào **Authentication** > **URL Configuration**
4. Thêm site URL: `http://localhost:5173` (cho development)

## Bước 6: Tạo Admin User

1. Vào **Authentication** > **Users**
2. Tạo user mới:
   - Email: `admin@quantblog.com`
   - Password: `admin123`
   - Email Confirm: ✅
   - User Metadata:
     ```json
     {
       "name": "Quant Admin",
       "role": "admin"
     }
     ```

## Bước 7: Test kết nối

1. Chạy project: `npm run dev`
2. Mở browser và kiểm tra console
3. Nếu không có lỗi, database đã kết nối thành công

## Bước 8: Deploy lên Netlify

1. Build project: `npm run build`
2. Upload folder `dist` lên Netlify
3. Thêm Environment Variables trong Netlify:
   - `VITE_SUPABASE_URL`: URL Supabase của bạn
   - `VITE_SUPABASE_ANON_KEY`: Anon key của bạn

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra URL và API key
- Đảm bảo project Supabase đang active

### Lỗi RLS (Row Level Security)
- Kiểm tra policies đã được tạo đúng
- Đảm bảo user đã authenticate

### Lỗi CORS
- Thêm domain của bạn vào **Authentication** > **URL Configuration**

## Cấu trúc Database

### Tables:
- `blog_posts`: Lưu bài viết
- `post_interactions`: Lưu likes, shares, views
- `comments`: Lưu bình luận
- `profiles`: Lưu thông tin user

### Indexes:
- Tối ưu cho tìm kiếm và sắp xếp
- GIN index cho tags array

### Security:
- Row Level Security enabled
- Policies cho từng table
- Authentication required cho write operations 