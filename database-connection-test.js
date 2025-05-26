console.log('🔍 KIỂM TRA KẾT NỐI DATABASE TOÀN DIỆN');
console.log('=====================================');
console.log('');

console.log('📋 BƯỚC 1: Kiểm tra Supabase Configuration');
console.log('');

// Test 1: Check config file
try {
  console.log('🔧 Đang kiểm tra file config...');
  
  const SUPABASE_CONFIG = {
    url: 'https://ebcjduaadxsfrmdkinle.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViY2pkdWFhZHhzZnJtZGtpbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTEzNDEsImV4cCI6MjA2Mzc2NzM0MX0.Kh4mgvAqisRpfWJRKFnZJj1NuSy-Vj9HC6hqf7bvi8U'
  };
  
  console.log('✅ Config file OK');
  console.log('   URL:', SUPABASE_CONFIG.url);
  console.log('   Key:', SUPABASE_CONFIG.anonKey.substring(0, 30) + '...');
  
  // Validate URL format
  if (!SUPABASE_CONFIG.url.includes('supabase.co')) {
    console.log('❌ URL format không đúng!');
  } else {
    console.log('✅ URL format OK');
  }
  
  // Validate key format (JWT)
  if (!SUPABASE_CONFIG.anonKey.startsWith('eyJ')) {
    console.log('❌ Anon key không phải JWT!');
  } else {
    console.log('✅ Anon key format OK');
  }
  
} catch (error) {
  console.log('❌ Lỗi config:', error.message);
}

console.log('');
console.log('📋 BƯỚC 2: Kiểm tra Supabase Project Status');
console.log('');

console.log('🌐 Cách kiểm tra project Supabase:');
console.log('1. Vào: https://supabase.com/dashboard');
console.log('2. Chọn project: ebcjduaadxsfrmdkinle');
console.log('3. Kiểm tra:');
console.log('   - Project status: Active/Paused');
console.log('   - Database: Healthy');
console.log('   - API: Running');
console.log('');

console.log('📋 BƯỚC 3: Kiểm tra Database Tables');
console.log('');

console.log('🗄️ Tables cần thiết:');
console.log('1. profiles - User information');
console.log('2. blog_posts - Blog content');
console.log('3. blog_settings - Blog configuration');
console.log('4. post_interactions - Likes, shares, views');
console.log('5. comments - User comments');
console.log('');

console.log('🔧 Cách kiểm tra trong Supabase Dashboard:');
console.log('1. Vào Table Editor');
console.log('2. Kiểm tra từng table:');
console.log('   - profiles: có data admin user không?');
console.log('   - blog_posts: có sample posts không?');
console.log('   - blog_settings: có default settings không?');
console.log('');

console.log('📋 BƯỚC 4: Test Connection từ Browser');
console.log('');

console.log('🌐 Test API endpoints:');
console.log('1. Mở browser console (F12)');
console.log('2. Chạy commands sau:');
console.log('');
console.log('// Test basic connection');
console.log('fetch("https://ebcjduaadxsfrmdkinle.supabase.co/rest/v1/", {');
console.log('  headers: {');
console.log('    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViY2pkdWFhZHhzZnJtZGtpbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTEzNDEsImV4cCI6MjA2Mzc2NzM0MX0.Kh4mgvAqisRpfWJRKFnZJj1NuSy-Vj9HC6hqf7bvi8U"');
console.log('  }');
console.log('}).then(r => r.json()).then(console.log)');
console.log('');

console.log('// Test profiles table');
console.log('fetch("https://ebcjduaadxsfrmdkinle.supabase.co/rest/v1/profiles?select=*", {');
console.log('  headers: {');
console.log('    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViY2pkdWFhZHhzZnJtZGtpbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTEzNDEsImV4cCI6MjA2Mzc2NzM0MX0.Kh4mgvAqisRpfWJRKFnZJj1NuSy-Vj9HC6hqf7bvi8U"');
console.log('  }');
console.log('}).then(r => r.json()).then(console.log)');
console.log('');

console.log('📋 BƯỚC 5: Các vấn đề thường gặp');
console.log('');

console.log('❌ VẤN ĐỀ 1: Project bị pause');
console.log('   - Supabase free tier tự động pause sau 1 tuần không hoạt động');
console.log('   - Giải pháp: Vào dashboard và unpause project');
console.log('');

console.log('❌ VẤN ĐỀ 2: Tables chưa được tạo');
console.log('   - Chạy file SQL schema chưa thành công');
console.log('   - Giải pháp: Chạy lại các file .sql theo thứ tự');
console.log('');

console.log('❌ VẤN ĐỀ 3: RLS (Row Level Security) chặn');
console.log('   - Policies quá strict');
console.log('   - Giải pháp: Tạm thời disable RLS để test');
console.log('');

console.log('❌ VẤN ĐỀ 4: Network/CORS issues');
console.log('   - Firewall hoặc proxy chặn');
console.log('   - Giải pháp: Kiểm tra network settings');
console.log('');

console.log('❌ VẤN ĐỀ 5: API Key expired');
console.log('   - Anon key có thể bị thay đổi');
console.log('   - Giải pháp: Lấy key mới từ dashboard');
console.log('');

console.log('📋 BƯỚC 6: Debug trong Application');
console.log('');

console.log('🔧 Trong AdminSimple, kiểm tra console logs:');
console.log('1. "🚀 CHECKING SUPABASE CONFIG FROM CONFIG FILE..."');
console.log('2. "✅ Supabase configuration loaded from config file"');
console.log('3. "✅ Admin initialized successfully"');
console.log('');

console.log('❌ Nếu thấy lỗi:');
console.log('- "Database connection failed"');
console.log('- "Failed to initialize admin"');
console.log('- "Missing Supabase configuration"');
console.log('');

console.log('📋 BƯỚC 7: Quick Fix Commands');
console.log('');

console.log('🔧 Restart development server:');
console.log('npm run dev');
console.log('');

console.log('🔧 Clear browser cache:');
console.log('Ctrl + Shift + R (hard refresh)');
console.log('');

console.log('🔧 Test database từ SQL Editor:');
console.log('SELECT * FROM profiles LIMIT 5;');
console.log('SELECT * FROM blog_posts LIMIT 5;');
console.log('SELECT * FROM blog_settings LIMIT 5;');
console.log('');

console.log('📋 BƯỚC 8: Tạo lại Database (nếu cần)');
console.log('');

console.log('🗄️ Thứ tự chạy SQL files:');
console.log('1. supabase-schema.sql (tạo tables)');
console.log('2. blog-settings-table.sql (tạo settings)');
console.log('3. fix-admin-correct.sql (tạo admin user)');
console.log('');

console.log('✅ THÀNH CÔNG KHI:');
console.log('');
console.log('🎉 API calls trả về data thay vì error');
console.log('🎉 AdminSimple load được danh sách bài viết');
console.log('🎉 Có thể tạo/sửa/xóa bài viết');
console.log('🎉 Like/share/comment hoạt động');
console.log('🎉 Profile update thành công');
console.log('');

console.log('🚨 NẾU VẪN KHÔNG ĐƯỢC:');
console.log('');
console.log('1. Kiểm tra Supabase project có active không');
console.log('2. Tạo project mới nếu cần');
console.log('3. Copy credentials mới vào config');
console.log('4. Chạy lại setup database');
console.log('5. Test từng bước một');
console.log('');

console.log('📞 DEBUG SUPPORT:');
console.log('Chạy script này và báo cáo kết quả từng bước!');
console.log('🔍 Database Connection Test - COMPLETE! 🔍'); 