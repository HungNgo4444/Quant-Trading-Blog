# 📊 Quantitative Trading Blog

Một blog chuyên về giao dịch định lượng được xây dựng với React, TypeScript, và Supabase.

## ✨ Tính năng

### 🎯 Tính năng chính
- **Blog System**: Tạo, chỉnh sửa, xóa bài viết với Markdown support
- **Authentication**: Đăng ký, đăng nhập với Supabase Auth
- **Admin Panel**: Quản lý bài viết, thống kê, cài đặt blog
- **Search & Filter**: Tìm kiếm và lọc bài viết theo tags
- **Responsive Design**: Giao diện đẹp, tương thích mobile

### 👤 Quản lý người dùng
- **Profile Management**: Chỉnh sửa thông tin cá nhân
- **Settings**: Cài đặt giao diện, thông báo, bảo mật
- **Role-based Access**: Phân quyền Admin/User

### 📈 Analytics & Interactions
- **View Tracking**: Theo dõi lượt xem bài viết
- **Like & Share**: Tương tác với bài viết
- **Comments System**: Hệ thống bình luận (sẵn sàng)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (Database + Auth)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🚀 Cài đặt

### 1. Clone repository
```bash
git clone https://github.com/yourusername/quantitative-trading-blog.git
cd quantitative-trading-blog
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Supabase
1. Tạo project mới trên [Supabase](https://supabase.com)
2. Copy file `.env.example` thành `.env`
3. Cập nhật thông tin Supabase trong `.env`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Thiết lập Database
1. Vào Supabase Dashboard → SQL Editor
2. Chạy file `supabase-schema.sql` để tạo tables
3. Chạy file `blog-settings-table.sql` để tạo bảng cài đặt
4. (Optional) Chạy `fix-admin.sql` để tắt RLS trong development

### 5. Chạy ứng dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📁 Cấu trúc Project

```
src/
├── components/          # UI Components
│   ├── ui/             # Shadcn/ui components
│   ├── BlogCard.tsx    # Card hiển thị bài viết
│   ├── Header.tsx      # Header navigation
│   └── ...
├── contexts/           # React Contexts
│   └── AuthContext.tsx # Authentication context
├── data/              # Static data
├── lib/               # Utilities & Services
│   ├── supabase.ts    # Supabase client
│   ├── blogService.ts # Blog CRUD operations
│   └── ...
├── pages/             # Page components
│   ├── Index.tsx      # Trang chủ
│   ├── Admin.tsx      # Admin panel
│   ├── Profile.tsx    # Trang profile
│   └── ...
└── types/             # TypeScript types
```

## 🔐 Authentication

### Tài khoản Admin mặc định
- **Email**: `admin@quantblog.com`
- **Password**: `admin123`

### Tạo tài khoản Admin
```sql
-- Chạy trong Supabase SQL Editor
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';
```

## 📝 Sử dụng

### Tạo bài viết mới
1. Đăng nhập với tài khoản Admin
2. Vào **Admin Panel** → **Bài viết**
3. Click **Tạo bài viết mới**
4. Điền thông tin và nội dung (hỗ trợ Markdown)
5. Thêm tags và ảnh đại diện
6. Click **Tạo bài viết**

### Quản lý cài đặt Blog
1. Vào **Admin Panel** → **Cài đặt**
2. Cập nhật thông tin blog, tác giả
3. Chỉnh sửa mô tả, liên hệ
4. Quản lý chủ đề chính

## 🌐 Deploy

### Netlify (Recommended)
1. Build project: `npm run build`
2. Upload folder `dist` lên Netlify
3. Cấu hình environment variables
4. Deploy!

### Vercel
1. Connect GitHub repository
2. Cấu hình environment variables
3. Deploy tự động

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Database Schema](./supabase-schema.sql)
- [Admin Fix Guide](./fix-admin.sql)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Lucide](https://lucide.dev/) - Icons

---

**Được phát triển với ❤️ cho cộng đồng Quantitative Trading**
