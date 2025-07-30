import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define supported endpoints and their configurations
const ENDPOINTS = {
  chat: { path: '/v1/chat/completions', method: 'POST' },
  embeddings: { path: '/v1/embeddings', method: 'POST' },
  images: { path: '/v1/images/generations', method: 'POST' },
  usage: { path: '/dashboard/billing/usage', method: 'GET' },
} as const;

export async function POST(req: NextRequest) {
  try {
    // Get user's API key from request headers or body
    const userKey = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const body = await req.json();
    const { endpoint, ...data } = body;

    if (!userKey && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'No API key provided' }, { status: 401 });
    }

    // Initialize OpenAI client with user's key or fallback to environment key
    const openai = new OpenAI({
      apiKey: userKey || process.env.OPENAI_API_KEY,
    });

    let response;
    switch (endpoint) {
      case 'chat':
        response = await openai.chat.completions.create(data);
        break;
      case 'embeddings':
        response = await openai.embeddings.create(data);
        break;
      case 'images':
        response = await openai.images.generate(data);
        break;
      case 'usage':
        // Custom implementation for usage stats
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
        response = await fetch(
          `https://api.openai.com/v1/usage?start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              'Authorization': `Bearer ${userKey || process.env.OPENAI_API_KEY}`,
            },
          }
        ).then(res => res.json());
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
