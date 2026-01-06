import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UAParser } from 'ua-parser-js';

export async function GET(
  request: Request,
  // W Next.js 15 params to Promise!
  { params }: { params: Promise<{ linkId: string }> } 
) {
  try {
    // 1. Oczekiwanie na params (wymagane w Next.js 15)
    const { linkId } = await params;

    // 2. Pobieramy nagłówki bezpośrednio z request (nie trzeba importować headers())
    const referrer = request.headers.get('referer') || 'direct';
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // 3. Poprawka dla UAParser (wymaga słowa 'new' lub wyciągnięcia wyniku)
    // Zazwyczaj używa się .getResult(), aby mieć czysty obiekt
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();
    
    const link = await db.link.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return new NextResponse('Link not found', { status: 404 });
    }

    // 4. Zapis w transakcji
    await db.$transaction([
      db.clickEvent.create({
        data: {
          linkId: link.id,
          ipAddress: ip,
          userAgent,
          referrer,
          device: ua.device.type || 'desktop',
          os: ua.os.name || 'unknown',
          browser: ua.browser.name || 'unknown',
          country: 'unknown', // Dodaję domyślne wartości, bo schema je ma
          city: 'unknown'
        },
      }),
      db.link.update({
        where: { id: linkId },
        data: { clicks: { increment: 1 } },
      }),
    ]);

    // 5. Przekierowanie
    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error('Error processing click:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}