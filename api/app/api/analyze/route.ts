import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/gemini';
import { getDb } from '@/lib/firebase-admin';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/auth';
import { AnalysisInput, ApiResponse, AnalysisResult } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes (max for Vercel Pro)

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuthToken(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body: AnalysisInput = await request.json();

    // Validate input
    if (!body.brandName) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Brand name is required',
      }, { status: 400 });
    }

    // Call Gemini API
    const { result: analysisText, discoveredUrls } = await analyzeWithGemini(
      body.brandName,
      body.officialUrls,
      body.additionalUrls,
      body.competitors,
      body.goal,
      body.conditions,
      body.extraNotes
    );

    // Save to Firebase with user ID
    let analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const db = getDb();
      const analysisData: AnalysisResult = {
        id: analysisId,
        input: body,
        result: analysisText,
        timestamp: Date.now(),
        userId: user.uid,
        userEmail: user.email,
        discoveredUrls: discoveredUrls.length > 0 ? discoveredUrls : undefined,
      };

      await db.collection('analyses').doc(analysisId).set(analysisData);
      console.log('Analysis saved to Firebase:', analysisId);
    } catch (firebaseError) {
      console.error('Failed to save to Firebase (continuing anyway):', firebaseError);
    }

    return NextResponse.json<ApiResponse<{ id: string; result: string; discoveredUrls: string[] }>>({
      success: true,
      data: {
        id: analysisId,
        result: analysisText,
        discoveredUrls,
      },
    });

  } catch (error: any) {
    console.error('Analysis API Error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: error.message || 'Failed to process analysis',
    }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
