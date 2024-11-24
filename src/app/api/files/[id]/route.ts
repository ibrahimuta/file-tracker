import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const file = await db.getFileById(params.id);
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    const file = await db.updateFileStatus(params.id, status);
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}
