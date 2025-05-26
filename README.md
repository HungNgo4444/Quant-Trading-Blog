# 📊 Quantitative Trading Blog

Một blog chuyên về giao dịch định lượng được xây dựng với React, TypeScript, Vite, Tailwind CSS và Supabase.

## ✨ Tính năng chính

### 🔐 Hệ thống Admin hoàn chỉnh
- **AdminSafe**: Trang kiểm tra an toàn trước khi vào admin
- **AdminWrapper**: Error handling thông minh
- **Admin Panel**: Quản lý toàn diện blog

### 📝 Quản lý Bài viết
- ✅ Tạo, chỉnh sửa, xóa bài viết
- ✅ Markdown editor với preview
- ✅ Tag management
- ✅ Image URL support
- ✅ Read time estimation
- ✅ SEO optimization

### 📊 Analytics & Thống kê
- ✅ View tracking (cả logged in & anonymous users)
- ✅ Session-based tracking cho anonymous users
- ✅ Duplicate view prevention
- ✅ Like/Share tracking
- ✅ Tổng quan số liệu
- ✅ Post performance

### ⚙️ Cài đặt Blog
- ✅ Blog title & description
- ✅ Author information
- ✅ Contact & social links
- ✅ SEO settings

### 🛡️ Bảo mật
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Safe error handling
- ✅ Database connection check

## 🚀 Cài đặt và Chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd quant-trading-blog
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Setup Database (Supabase)
1. Truy cập [Supabase Dashboard](https://supabase.com)
2. Chọn project: `ebcjduaadxsfrmdkinle`
3. Vào SQL Editor và chạy các file theo thứ tự:
   ```sql
   -- 1. Tạo schema cơ bản
   supabase-schema.sql
   
   -- 2. Tạo bảng settings
   blog-settings-table.sql
   
   -- 3. Tạo admin user
   fix-admin-correct.sql
   ```

### 4. Chạy ứng dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:8080

## 👨‍💼 Sử dụng Admin Panel

### Bước 1: Truy cập Admin
1. Vào: http://localhost:8080/admin
2. Đăng nhập với:
   - Email: `admin@quantblog.com`
   - Password: `admin123`

### Bước 2: Kiểm tra Database
- AdminSafe sẽ kiểm tra kết nối database
- Nếu thành công: Hiển thị nút "Vào Admin Panel đầy đủ"
- Nếu lỗi: Hiển thị hướng dẫn khắc phục

### Bước 3: Sử dụng Admin Panel
1. **Tab Bài viết**: Quản lý content
   - Tạo bài viết mới
   - Chỉnh sửa bài viết
   - Xóa bài viết
   - Xem danh sách

2. **Tab Thống kê**: Xem analytics
   - Tổng số bài viết
   - Tổng lượt xem
   - Tổng lượt thích

3. **Tab Cài đặt**: Cấu hình blog
   - Thông tin blog
   - Thông tin tác giả
   - Social links
   - SEO settings

## 🛠️ Cấu trúc Project

### Core Admin Files
```
src/
├── pages/
│   ├── AdminSafe.tsx      # Safe admin entry point
│   ├── AdminWrapper.tsx   # Error handling wrapper
│   └── Admin.tsx          # Main admin panel
├── contexts/
│   └── AuthContext.tsx    # Authentication system
├── lib/
│   ├── blogService.ts     # Blog operations
│   ├── blogSettings.ts    # Settings management
│   └── supabaseService.ts # Database operations
└── config/
    └── supabase.ts        # Database configuration
```

### Database Files
```
supabase-schema.sql        # Main database schema
blog-settings-table.sql    # Settings table
fix-admin-correct.sql      # Admin user setup
```

### Documentation
```
README.md                  # Main documentation
FINAL_FIX.md              # Latest fixes guide
fix-admin-buttons.js      # Admin functionality check
admin-check.js            # Comprehensive admin test
```

## 🔧 Troubleshooting

### Admin Panel không load
1. Kiểm tra console browser (F12)
2. Đảm bảo database đã được setup
3. Chạy lại các file SQL schema
4. Restart server: `npm run dev`

### Database connection error
1. Kiểm tra Supabase credentials trong `src/config/supabase.ts`
2. Đảm bảo project Supabase đang hoạt động
3. Chạy SQL: `SELECT * FROM profiles;` để test

### Admin user không hoạt động
1. Chạy file `fix-admin-correct.sql`
2. Kiểm tra role trong database:
   ```sql
   SELECT email, name, role FROM profiles WHERE role = 'admin';
   ```

## 📋 Checklist Kiểm tra

### ✅ Authentication
- [ ] Đăng ký user mới
- [ ] Đăng nhập/đăng xuất
- [ ] Admin role working
- [ ] Protected routes

### ✅ Admin Panel
- [ ] AdminSafe hiển thị đúng
- [ ] Database connection check
- [ ] Load Admin Panel thành công
- [ ] 3 tabs hiển thị đầy đủ

### ✅ Quản lý Bài viết
- [ ] Tạo bài viết mới
- [ ] Chỉnh sửa bài viết
- [ ] Xóa bài viết
- [ ] Tag management
- [ ] Markdown rendering

### ✅ Analytics
- [ ] View tracking
- [ ] Like/Share counting
- [ ] Statistics display

### ✅ Settings
- [ ] Blog info update
- [ ] Author info update
- [ ] Settings save/load

## 📊 View Tracking System

### Cách hoạt động:
- **Logged-in users**: View được tính dựa trên user ID, mỗi user chỉ tính 1 view/ngày cho mỗi bài viết
- **Anonymous users**: View được tính dựa trên session ID, lưu trong localStorage
- **Duplicate prevention**: Tránh tính view trùng lặp trong cùng ngày
- **Auto cleanup**: Tự động dọn dẹp records cũ trong localStorage

### Technical Implementation:
```typescript
// For logged-in users
await blogService.recordView(postId, user.id);

// For anonymous users  
await blogService.recordView(postId); // userId is undefined
```

### Data Storage:
- **Database**: Lưu vào bảng `post_interactions` và `blog_posts`
- **localStorage**: Lưu session tracking cho anonymous users
- **Format**: `view_{postId}_{sessionId}_{date}`

## 🎯 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6
- **State Management**: React Context
- **Markdown**: React Markdown
- **Analytics**: Custom view tracking system

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Chạy `node admin-check.js` để kiểm tra toàn bộ system
2. Chạy `node fix-admin-buttons.js` để xem hướng dẫn chi tiết
3. Kiểm tra console browser (F12) để xem lỗi
4. Đọc file `FINAL_FIX.md` cho hướng dẫn khắc phục

## 🎉 Hoàn thành!

Admin system đã hoàn chỉnh với:
- ✅ Error handling an toàn
- ✅ UI/UX thân thiện
- ✅ Tính năng đầy đủ
- ✅ Documentation chi tiết
- ✅ Easy troubleshooting

**Happy blogging!** 📝✨
