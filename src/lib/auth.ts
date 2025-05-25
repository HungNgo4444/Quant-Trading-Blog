import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';

// Simulate password hashing (in real app, this would be done on backend)
const hashPassword = async (password: string): Promise<string> => {
  // Simple hash simulation - in real app use bcrypt on backend
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_key_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
};

// Generate JWT-like token (simplified)
const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  return btoa(JSON.stringify(payload));
};

const verifyToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }
    return {
      id: payload.id,
      email: payload.email,
      name: '', // Will be loaded from storage
      role: payload.role,
      isEmailVerified: true,
      createdAt: '',
      lastLoginAt: new Date().toISOString()
    };
  } catch {
    return null;
  }
};

// Generate verification code for 2FA
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email simulation (in real app, use email service)
const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  console.log(`Sending verification code ${code} to ${email}`);
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

// Local storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  USERS_DB: 'users_database',
  PENDING_VERIFICATIONS: 'pending_verifications'
};

// Simulate user database in localStorage
const getUsersDB = (): Record<string, any> => {
  const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  return db ? JSON.parse(db) : {};
};

const saveUsersDB = (db: Record<string, any>): void => {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
};

const getPendingVerifications = (): Record<string, any> => {
  const pending = localStorage.getItem(STORAGE_KEYS.PENDING_VERIFICATIONS);
  return pending ? JSON.parse(pending) : {};
};

const savePendingVerifications = (pending: Record<string, any>): void => {
  localStorage.setItem(STORAGE_KEYS.PENDING_VERIFICATIONS, JSON.stringify(pending));
};

// Initialize default admin user
const initializeDefaultAdmin = async (): Promise<void> => {
  const usersDB = getUsersDB();
  const adminEmail = 'admin@quantblog.com';
  
  if (!usersDB[adminEmail]) {
    const adminPassword = await hashPassword('admin123');
    
    usersDB[adminEmail] = {
      id: 'admin-1',
      email: adminEmail,
      name: 'Quant Admin',
      role: 'admin',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      password: adminPassword
    };
    
    saveUsersDB(usersDB);
    
    console.log('Default admin created:');
    console.log('Email: admin@quantblog.com');
    console.log('Password: admin123');
  }
};

// Auth functions
export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { name, email, password, confirmPassword } = credentials;

    // Validation
    if (password !== confirmPassword) {
      return { success: false, message: 'Mật khẩu xác nhận không khớp' };
    }

    if (password.length < 8) {
      return { success: false, message: 'Mật khẩu phải có ít nhất 8 ký tự' };
    }

    const usersDB = getUsersDB();
    
    // Check if user already exists
    if (usersDB[email]) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      isEmailVerified: false,
      createdAt: new Date().toISOString()
    };

    // Save user to database
    usersDB[email] = {
      ...user,
      password: hashedPassword
    };
    saveUsersDB(usersDB);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const pending = getPendingVerifications();
    pending[email] = {
      code: verificationCode,
      expires: Date.now() + (10 * 60 * 1000), // 10 minutes
      user
    };
    savePendingVerifications(pending);

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return {
      success: true,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      requiresEmailVerification: true
    };
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;
    const usersDB = getUsersDB();
    const userData = usersDB[email];

    if (!userData) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userData.password);
    if (!isValidPassword) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    if (!userData.isEmailVerified) {
      return { success: false, message: 'Vui lòng xác thực email trước khi đăng nhập' };
    }

    // Update last login
    userData.lastLoginAt = new Date().toISOString();
    usersDB[email] = userData;
    saveUsersDB(usersDB);

    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isEmailVerified: userData.isEmailVerified,
      createdAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt
    };

    // Generate token
    const token = generateToken(user);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return {
      success: true,
      message: 'Đăng nhập thành công',
      user,
      token
    };
  },

  async verifyEmail(email: string, code: string): Promise<AuthResponse> {
    const pending = getPendingVerifications();
    const verification = pending[email];

    if (!verification) {
      return { success: false, message: 'Mã xác thực không hợp lệ' };
    }

    if (verification.expires < Date.now()) {
      delete pending[email];
      savePendingVerifications(pending);
      return { success: false, message: 'Mã xác thực đã hết hạn' };
    }

    if (verification.code !== code) {
      return { success: false, message: 'Mã xác thực không đúng' };
    }

    // Update user as verified
    const usersDB = getUsersDB();
    if (usersDB[email]) {
      usersDB[email].isEmailVerified = true;
      saveUsersDB(usersDB);
    }

    // Clean up pending verification
    delete pending[email];
    savePendingVerifications(pending);

    return {
      success: true,
      message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.'
    };
  },

  async resendVerificationCode(email: string): Promise<AuthResponse> {
    const usersDB = getUsersDB();
    if (!usersDB[email]) {
      return { success: false, message: 'Email không tồn tại' };
    }

    if (usersDB[email].isEmailVerified) {
      return { success: false, message: 'Email đã được xác thực' };
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const pending = getPendingVerifications();
    pending[email] = {
      code: verificationCode,
      expires: Date.now() + (10 * 60 * 1000), // 10 minutes
      user: usersDB[email]
    };
    savePendingVerifications(pending);

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return {
      success: true,
      message: 'Mã xác thực mới đã được gửi đến email của bạn'
    };
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (!token || !userStr) {
      return null;
    }

    const tokenUser = verifyToken(token);
    if (!tokenUser) {
      // Token expired, clean up
      this.logout();
      return null;
    }

    return JSON.parse(userStr);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  // Initialize service
  async init(): Promise<void> {
    await initializeDefaultAdmin();
  }
};

// Initialize on import
authService.init(); 