import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FileStage } from '@/types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
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

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    const { stage, details } = body as { stage: FileStage; details?: string };

    const updatedFile = await db.updateFileStage(params.id, stage, details);
    if (!updatedFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}
