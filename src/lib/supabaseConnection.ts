import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/supabase';

class SupabaseConnectionManager {
  private client: SupabaseClient | null = null;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection(): Promise<void> {
    try {
      console.log('🔄 Initializing Supabase connection...');
      
      // Validate configuration
      if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        throw new Error('Missing Supabase configuration');
      }

      // Create client
      this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'x-application-name': 'quantitative-trading-blog'
          }
        }
      });

      // Test connection
      await this.testConnection();
      
      console.log('✅ Supabase connection established successfully');
      this.isConnected = true;
      this.connectionAttempts = 0;
      
    } catch (error) {
      console.error('❌ Failed to initialize Supabase connection:', error);
      this.isConnected = false;
      this.connectionAttempts++;
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 Retrying connection (${this.connectionAttempts}/${this.maxRetries})...`);
        setTimeout(() => this.initializeConnection(), this.retryDelay * this.connectionAttempts);
      } else {
        console.error('💥 Max connection attempts reached. Please check your Supabase configuration.');
      }
    }
  }

  private async testConnection(): Promise<void> {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }

    try {
      // Test with a simple query
      const { data, error } = await this.client
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        // If profiles table doesn't exist, that's still a valid connection
        if (error.code === 'PGRST116' || error.message.includes('relation "profiles" does not exist')) {
          console.log('⚠️ Database connected but tables may not exist yet');
          return;
        }
        throw error;
      }

      console.log('✅ Database connection test successful');
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      throw error;
    }
  }

  public getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Please check your configuration.');
    }
    return this.client;
  }

  public isConnectionHealthy(): boolean {
    return this.isConnected && this.client !== null;
  }

  public async reconnect(): Promise<void> {
    console.log('🔄 Attempting to reconnect to Supabase...');
    this.connectionAttempts = 0;
    await this.initializeConnection();
  }

  public async executeWithRetry<T>(
    operation: (client: SupabaseClient) => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (!this.isConnectionHealthy()) {
          await this.reconnect();
        }
        
        const client = this.getClient();
        return await operation(client);
        
      } catch (error) {
        lastError = error as Error;
        console.warn(`❌ Operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
        
        if (attempt < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          
          // Try to reconnect if it's a connection issue
          if (this.isConnectionError(error as Error)) {
            await this.reconnect();
          }
        }
      }
    }
    
    throw lastError || new Error('Operation failed after all retries');
  }

  private isConnectionError(error: Error): boolean {
    const connectionErrorMessages = [
      'fetch',
      'network',
      'timeout',
      'connection',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT'
    ];
    
    return connectionErrorMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  }

  public getConnectionStatus(): {
    isConnected: boolean;
    attempts: number;
    maxRetries: number;
    client: boolean;
  } {
    return {
      isConnected: this.isConnected,
      attempts: this.connectionAttempts,
      maxRetries: this.maxRetries,
      client: this.client !== null
    };
  }
}

// Create singleton instance
const connectionManager = new SupabaseConnectionManager();

// Export the manager and a convenience function to get the client
export { connectionManager };

export const getSupabaseClient = (): SupabaseClient => {
  return connectionManager.getClient();
};

export const executeWithRetry = <T>(
  operation: (client: SupabaseClient) => Promise<T>
): Promise<T> => {
  return connectionManager.executeWithRetry(operation);
};

export const checkConnection = (): boolean => {
  return connectionManager.isConnectionHealthy();
};

export const reconnect = (): Promise<void> => {
  return connectionManager.reconnect();
};

export const getConnectionStatus = () => {
  return connectionManager.getConnectionStatus();
};

// For backward compatibility
export const supabase = connectionManager.getClient();
export default supabase; 