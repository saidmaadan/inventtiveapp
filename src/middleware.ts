import { auth } from "./auth";

export default auth((req) => {
  // Your custom middleware logic here if needed
});

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/protected/:path*'
  ]
};
