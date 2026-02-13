import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/gemini';
import { getDb } from '@/lib/firebase-admin';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/auth';
import { AnalysisInput, ApiResponse, AnalysisResult } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for Vercel Pro

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
    const analysisText = await analyzeWithGemini(
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
        userId: user.uid, // Add user ID
        userEmail: user.email,
      };

      await db.collection('analyses').doc(analysisId).set(analysisData);
      console.log('Analysis saved to Firebase:', analysisId);
    } catch (firebaseError) {
      console.error('Failed to save to Firebase (continuing anyway):', firebaseError);
    }

    return NextResponse.json<ApiResponse<{ id: string; result: string }>>({
      success: true,
      data: {
        id: analysisId,
        result: analysisText,
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
