"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";

type Props = { 
  note: NoteType 
};

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    note.editorState || `<h1>${note.name}</h1>`
  );

  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  // Save note mutation
  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  // AI Completion function
  const handleAiCompletion = React.useCallback(async (editor: any) => {
    if (!editor || isAiLoading) return;
    
    setIsAiLoading(true);
    setAiError(null);
    
    try {
      // Get last 30 words as prompt
      const text = editor.getText();
      const words = text.split(" ");
      const prompt = words.slice(-30).join(" ");
      
      if (!prompt.trim()) {
        setAiError("Please write some text first");
        return;
      }

      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Insert AI completion
      const completion = data.completion || data.text || '';
      if (completion) {
        editor.commands.insertContent(completion);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI completion failed';
      console.error('AI Completion error:', errorMessage);
      setAiError(errorMessage);
    } finally {
      setIsAiLoading(false);
    }
  }, [isAiLoading]);

  // Custom text extension with Shift+A shortcut
  const customText = React.useMemo(() => 
    Text.extend({
      addKeyboardShortcuts() {
        return {
          "Shift-a": () => {
            if (this.editor) {
              handleAiCompletion(this.editor);
            }
            return true;
          },
        };
      },
    }), [handleAiCompletion]
  );

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      customText
    ],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  const debouncedEditorState = useDebounce(editorState, 500);
  
  React.useEffect(() => {
    // Auto-save to database
    if (debouncedEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("Note saved successfully!", data);
      },
      onError: (err) => {
        console.error("Save error:", err);
      },
    });
  }, [debouncedEditorState]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <TipTapMenuBar editor={editor} />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleAiCompletion(editor)}
            disabled={isAiLoading}
            variant="outline"
            size="sm"
          >
            {isAiLoading ? "🤖 Generating..." : "🤖 AI Complete"}
          </Button>
          <Button disabled variant="outline" size="sm">
            {saveNote.isPending ? "Saving..." : "Saved"}
          </Button>
        </div>
      </div>

      {/* AI Status Messages */}
      {isAiLoading && (
        <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded mt-2">
          🤖 AI is generating completion...
        </div>
      )}

      {aiError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
          ❌ Error: {aiError}
        </div>
      )}

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      
      <div className="h-4"></div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          💡 Tip: Press{" "}
          <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border rounded">
            Shift + A
          </kbd>{" "}
          for AI autocomplete
        </span>
        <span>or click the 🤖 AI Complete button</span>
      </div>
    </>
  );
};

export default TipTapEditor;