import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const events = await db.getFileEvents(params.id);
  return NextResponse.json(events);
}
