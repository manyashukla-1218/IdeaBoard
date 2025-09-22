import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log("Completion API called with prompt:", prompt?.substring(0, 50));
    
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required and cannot be empty' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    console.log("API key exists:", !!apiKey);
    
    if (!apiKey) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Enhanced prompt for better text continuation
    const enhancedPrompt = `You are a writing assistant. Continue the following text in a natural, coherent way. Write only 1-2 sentences that flow smoothly from the existing text. Keep the same tone and style:

"${prompt}"

Continue writing:`;

    console.log("Sending request to Gemini API...");
    
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response received:", text.substring(0, 100));

    // Clean up the response - remove any unwanted prefixes
    let cleanedText = text.trim();
    
    // Remove common AI response prefixes if present
    const prefixesToRemove = [
      "Continue writing:",
      "Continuation:",
      "Here's the continuation:",
      "The text continues:"
    ];
    
    for (const prefix of prefixesToRemove) {
      if (cleanedText.toLowerCase().startsWith(prefix.toLowerCase())) {
        cleanedText = cleanedText.substring(prefix.length).trim();
      }
    }

    // Ensure the response starts with a space if it doesn't already
    if (cleanedText && !cleanedText.startsWith(' ')) {
      cleanedText = ' ' + cleanedText;
    }

    return NextResponse.json({ 
      completion: cleanedText,
      text: cleanedText,
      success: true
    });

  } catch (error: any) {
    console.error('Gemini API detailed error:', {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      details: error
    });

    // Handle specific Gemini API errors
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key. Please check your GOOGLE_API_KEY in .env file.' },
        { status: 401 }
      );
    }

    if (error?.message?.includes('quota') || error?.message?.includes('QUOTA_EXCEEDED') || error?.status === 429) {
      return NextResponse.json(
        { error: 'Gemini API quota exceeded. Please check your billing or try again later.' },
        { status: 429 }
      );
    }

    if (error?.message?.includes('PERMISSION_DENIED') || error?.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Please enable the Gemini API and check your API key permissions.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate completion. Please try again.',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}