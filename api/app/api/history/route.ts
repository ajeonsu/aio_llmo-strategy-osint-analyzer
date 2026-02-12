import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { ApiResponse, AnalysisResult } from '@/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const db = getDb();
    const snapshot = await db
      .collection('analyses')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)
      .get();

    const analyses: AnalysisResult[] = [];
    snapshot.forEach((doc) => {
      analyses.push(doc.data() as AnalysisResult);
    });

    return NextResponse.json<ApiResponse<{ analyses: AnalysisResult[]; total: number }>>({
      success: true,
      data: {
        analyses,
        total: analyses.length,
      },
    });

  } catch (error: any) {
    console.error('List Analyses Error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: error.message || 'Failed to retrieve analyses',
    }, { status: 500 });
  }
}
