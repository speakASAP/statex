import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Return instructions for setting up the test user session
    return NextResponse.json({
      success: true,
      message: 'Test user setup instructions',
      instructions: {
        step1: 'Open browser console (F12)',
        step2: 'Run these commands:',
        commands: [
          `localStorage.setItem('statex_user_id', '${userId}');`,
          `localStorage.setItem('statex_session_id', 'test-session-' + Date.now());`,
          'window.location.href = "/dashboard";'
        ],
        step3: 'The dashboard should now show the user profile and results'
      },
      testUserId: userId
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to setup test user' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test user setup endpoint',
    usage: 'POST with { "userId": "dev-user-1757845974658" }',
    availableUsers: ['dev-user-1757845974658']
  });
}

