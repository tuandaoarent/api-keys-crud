import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { usersService } from '../../../../lib/users';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session from JWT token
      if (session?.user && token) {
        // Use Supabase user ID if available, otherwise fall back to NextAuth user ID
        session.user.id = token.supabaseUserId || token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle callback URLs properly
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // Allow all sign-in attempts
      return true;
    },
    async jwt({ token, user, account, profile, trigger }) {
      // Store OAuth access token in JWT
      if (account) {
        token.accessToken = account.access_token;
      }

      // Save user to Supabase on first sign-in or when user data is available
      if (user && account) {
        try {
          const userData = {
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
            provider_id: account.providerAccountId,
            created_at: new Date().toISOString()
          };

          const savedUser = await usersService.upsertUser(userData);
          console.log('User saved to Supabase:', savedUser);
          
          // Store the Supabase user ID in the token for future reference
          if (savedUser && savedUser.id) {
            token.supabaseUserId = savedUser.id;
          }

          // Update last sign-in time only on actual sign-in (not token refresh)
          if (trigger === 'signIn' || !token.supabaseUserId) {
            try {
              await usersService.updateLastSignInByEmail(user.email);
              console.log('Last sign-in updated for:', user.email);
            } catch (error) {
              console.error('Failed to update last sign-in:', error);
            }
          }
        } catch (error) {
          console.error('Failed to save user to Supabase:', error);
          // Don't throw error to prevent sign-in failure
        }
      }

      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
