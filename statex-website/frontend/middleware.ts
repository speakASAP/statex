import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;
  
  console.log(`[MIDDLEWARE] Processing request: ${hostname}${pathname}`);
  
  // Check if this is a prototype subdomain
  // Support both formats: proto_XXXXX and YYYYMMDD_HHMMSS_XXXXX
  const prototypeMatch = hostname.match(/^project-([a-zA-Z0-9_-]+)\.localhost$/);
  
  if (prototypeMatch) {
    const prototypeId = prototypeMatch[1];
    
    console.log(`[MIDDLEWARE] Found prototype subdomain: ${prototypeId}`);
    
    // Route to the prototype-subdomain component with path parameter
    const url = request.nextUrl.clone();
    url.pathname = '/prototype-subdomain';
    url.hostname = 'localhost';
    
    // Add the path as a search parameter
    if (pathname !== '/' && pathname !== '') {
      url.searchParams.set('path', pathname.substring(1)); // Remove leading slash
    }
    
    console.log(`[MIDDLEWARE] Subdomain routing: ${hostname}${pathname} -> ${url.pathname}?path=${url.searchParams.get('path') || 'root'}`);
    
    return NextResponse.rewrite(url);
  }
  
  console.log(`[MIDDLEWARE] Not a prototype subdomain: ${hostname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
