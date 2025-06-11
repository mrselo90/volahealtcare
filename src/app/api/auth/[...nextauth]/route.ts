import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const NEXTAUTH_SECRET_PLACEHOLDER = 'this-is-a-very-insecure-placeholder-secret-do-not-use-in-production';

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('Please provide NEXTAUTH_SECRET environment variable for production');
} else if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    'WARNING: NEXTAUTH_SECRET environment variable is not set. \n' +
    `Using insecure placeholder secret: ${NEXTAUTH_SECRET_PLACEHOLDER}. \n` +
    'This is NOT safe for production. Please set a strong NEXTAUTH_SECRET in your environment.'
  );
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 