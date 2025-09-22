import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

const TipTapMenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-gray-200 rounded-lg bg-gray-50">
      <button
        onClick={() => {
          try {
            editor.chain().focus().toggleBold().run();
          } catch (error) {
            console.log("Bold toggle error:", error);
          }
        }}
        className={`p-2 rounded ${editor.isActive("bold") ? "bg-blue-200" : "bg-white"} border hover:bg-gray-100`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().toggleItalic().run();
          } catch (error) {
            console.log("Italic toggle error:", error);
          }
        }}
        className={`p-2 rounded ${editor.isActive("italic") ? "bg-blue-200" : "bg-white"} border hover:bg-gray-100`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().toggleStrike().run();
          } catch (error) {
            console.log("Strike toggle error:", error);
          }
        }}
        className={`p-2 rounded ${editor.isActive("strike") ? "bg-blue-200" : "bg-white"} border hover:bg-gray-100`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          } catch (error) {
            console.log("H1 toggle error:", error);
          }
        }}
        className={`p-2 rounded ${editor.isActive("heading", { level: 1 }) ? "bg-blue-200" : "bg-white"} border hover:bg-gray-100`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          } catch (error) {
            console.log("H2 toggle error:", error);
          }
        }}
        className={`p-2 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-blue-200" : "bg-white"} border hover:bg-gray-100`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().toggleBulletList().run();
          } catch (error) {
            console.log("List toggle error:", error);
          }
        }}
        className={`p-2 rounded ${editor.isActive("bulletList") ? "bg-blue-200" : "bg-white"} border hover:bg-gray-100`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().toggleOrderedList().run();
          } catch (error) {
            console.log("Ordered list toggle error:", error);
          }
        }}
        className={`p-2 rounded ${editor.isActive("orderedList") ? "bg-blue-200" : "bg-white"} border hover:bg-gray-100`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().undo().run();
          } catch (error) {
            console.log("Undo error:", error);
          }
        }}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          try {
            editor.chain().focus().redo().run();
          } catch (error) {
            console.log("Redo error:", error);
          }
        }}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TipTapMenuBar;