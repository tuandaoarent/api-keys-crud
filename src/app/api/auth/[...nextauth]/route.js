import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async session({ session, user }) {
      // Send properties to the client
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to homepage - never to NextAuth default pages
      // This ensures both success and error cases go to homepage
      console.log('Redirect callback:', { url, baseUrl });
      return baseUrl;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // Always allow sign in to prevent NextAuth redirects
      console.log('SignIn callback:', { user, account, profile });
      return true;
    },
    async jwt({ token, user, account, profile, trigger }) {
      // Handle JWT token updates
      console.log('JWT callback:', { token, user, account, trigger });
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  // Remove custom pages - let NextAuth use defaults but handle redirects properly
  session: {
    strategy: 'database',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
