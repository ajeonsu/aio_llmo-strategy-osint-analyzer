import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/auth';
import { ApiResponse, AnalysisResult } from '@/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuthToken(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const db = getDb();
    const snapshot = await db
      .collection('analyses')
      .where('userId', '==', user.uid) // Only get user's own analyses
      .orderBy('timestamp', 'desc')
      .limit(limit)
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
