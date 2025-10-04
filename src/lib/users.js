import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const usersService = {
  // Create or update user in Supabase
  async upsertUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          email: userData.email,
          name: userData.name,
          image: userData.image,
          provider: userData.provider,
          provider_id: userData.provider_id,
          last_sign_in: new Date().toISOString(),
          created_at: userData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email' // Use email as the conflict resolution key
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user:', error);
        throw error;
      }

      console.log('User upserted successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to upsert user:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error getting user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  },

  // Update user last sign in by ID
  async updateLastSignIn(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          last_sign_in: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating last sign in:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to update last sign in:', error);
      throw error;
    }
  },

  // Update user last sign in by email
  async updateLastSignInByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          last_sign_in: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Error updating last sign in by email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to update last sign in by email:', error);
      throw error;
    }
  }
};
