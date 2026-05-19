import { NextResponse } from 'next/server';
import { warmupConnection } from '@/lib/mongodb';

export async function GET() {
  try {
    const ok = await warmupConnection();
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
