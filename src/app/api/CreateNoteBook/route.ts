// app/api/CreateNoteBook/route.ts

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/Geminiai"; // CHANGED THIS LINE
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  console.log('🚀 API Route Called - CreateNotebook');
  
  try {
    // 1. Authentication check
    console.log('🔐 Checking authentication...');
    const { userId } = await auth();
    console.log('👤 User ID from auth():', userId);
    
    if (!userId) {
      console.log('❌ No userId found - returning 401');
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    console.log('✅ User authenticated successfully');
    
    // 2. Parse request body
    console.log('📝 Parsing request body...');
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('❌ JSON parsing error:', error);
      return new NextResponse("Invalid JSON in request body", { status: 400 });
    }
    
    const { name } = body;
    console.log('📋 Notebook name:', name);
    
    // 3. Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.log('❌ Invalid name provided');
      return new NextResponse("Name is required and must be a non-empty string", { 
        status: 400 
      });
    }
    
    // 4. Generate image keyword (no API call needed)
    console.log('🎨 Generating image keyword...');
    let image_keyword;
    try {
      image_keyword = await generateImagePrompt(name.trim());
      console.log('✅ Image keyword generated:', image_keyword);
    } catch (error) {
      console.error('❌ Error generating image keyword:', error);
      image_keyword = 'notebook'; // fallback
    }
    
    // 5. Generate image URL (using free stock photos)
    console.log('🖼️ Generating image...');
    let image_url;
    try {
      image_url = await generateImage(image_keyword);
      console.log('✅ Image URL generated:', image_url);
    } catch (error) {
      console.error('❌ Error generating image:', error);
      image_url = `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodeURIComponent('Notebook')}`;
    }
    
    // 6. Database insertion
    console.log('💾 Inserting into database...');
    let note_ids;
    try {
      note_ids = await db
        .insert($notes)
        .values({
          name: name.trim(),
          userId,
          imageUrl: image_url,
        })
        .returning({
          insertedId: $notes.id,
        });
      
      console.log('✅ Database insertion successful:', note_ids);
      
      if (!note_ids || note_ids.length === 0) {
        throw new Error("No ID returned from database insertion");
      }
    } catch (error) {
      console.error('❌ Database insertion error:', error);
      return new NextResponse("Failed to create notebook in database", {
        status: 500,
      });
    }
    
    // 7. Return success response
    console.log('🎉 Success! Returning response');
    return NextResponse.json({
      note_id: note_ids[0].insertedId,
      message: "Notebook created successfully"
    });
    
  } catch (error) {
    console.error('💥 Unexpected error in createNotebook:', error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}