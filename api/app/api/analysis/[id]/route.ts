import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { ApiResponse, AnalysisResult } from '@/types';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Analysis ID is required',
      }, { status: 400 });
    }

    const db = getDb();
    const doc = await db.collection('analyses').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Analysis not found',
      }, { status: 404 });
    }

    const data = doc.data() as AnalysisResult;

    return NextResponse.json<ApiResponse<AnalysisResult>>({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error('Get Analysis Error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: error.message || 'Failed to retrieve analysis',
    }, { status: 500 });
  }
}
