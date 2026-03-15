import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protection active contre les bots et le spam (Rate Limiting en temps réel)
const ipCache = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT = 50; // requêtes par 10 minutes
const WINDOW_MS = 10 * 60 * 1000;

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const now = Date.now();
  const entry = ipCache.get(ip) || { count: 0, lastReset: now };

  // Reset de la fenêtre temporelle
  if (now - entry.lastReset > WINDOW_MS) {
    entry.count = 0;
    entry.lastReset = now;
  }

  entry.count++;
  ipCache.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return new NextResponse(
      JSON.stringify({ error: "Trop de requêtes. Protection anti-bots activée." }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/(.*)', '/login', '/register'],
};
