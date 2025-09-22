import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { noteId, editorState } = body;
    
    if (!editorState || !noteId) {
      return NextResponse.json(
        { error: "Missing editorState or noteId", success: false },
        { status: 400 }
      );
    }

    noteId = parseInt(noteId);
    
    // Check if note exists
    const notes = await db.select().from($notes).where(eq($notes.id, noteId));
    if (notes.length !== 1) {
      return NextResponse.json(
        { error: "Note not found", success: false },
        { status: 404 }
      );
    }

    const note = notes[0];
    
    // Only update if content has changed
    if (note.editorState !== editorState) {
      await db
        .update($notes)
        .set({
          editorState,
        })
        .where(eq($notes.id, noteId));
    }

    return NextResponse.json(
      { success: true, message: "Note saved successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("SaveNote API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}