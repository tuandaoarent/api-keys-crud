import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to homepage to avoid NextAuth default pages
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
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
