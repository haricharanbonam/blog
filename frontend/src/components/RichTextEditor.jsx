import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { htmlToMarkdown, markdownToHtml } from "../utils/markdownUtils";

// ─── Toolbar Button ──────────────────────────────────────────────────────────
const ToolbarButton = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`p-1.5 rounded text-sm font-medium transition-colors ${
      active
        ? "bg-purple-600 text-white"
        : "text-gray-400 hover:text-white hover:bg-white/10"
    }`}
  >
    {children}
  </button>
);

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = () => <span className="w-px h-5 bg-white/10 mx-1" />;

// ─── Toolbar ─────────────────────────────────────────────────────────────────
const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10 rounded-t-xl">
      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToolbarButton>

      <Divider />

      {/* Inline formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline code"
      >
        <code>{"`"}</code>
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        1. List
      </ToolbarButton>

      <Divider />

      {/* Blocks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code block"
      >
        {"</>"}
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        ❝
      </ToolbarButton>

      <Divider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align left"
      >
        L
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align center"
      >
        C
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align right"
      >
        R
      </ToolbarButton>

      <Divider />

      {/* Link & Image */}
      <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Insert link">
        🔗
      </ToolbarButton>
      <ToolbarButton onClick={addImage} active={false} title="Insert image">
        🖼
      </ToolbarButton>

      <Divider />

      {/* Text color */}
      <label title="Text color" className="relative cursor-pointer p-1.5 rounded hover:bg-white/10">
        <span className="text-gray-400 text-sm">A</span>
        <input
          type="color"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
          title="Text color"
        />
      </label>

      <Divider />

      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        active={false}
        title="Undo"
      >
        ↩
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        active={false}
        title="Redo"
      >
        ↪
      </ToolbarButton>
    </div>
  );
};

// ─── RichTextEditor ──────────────────────────────────────────────────────────
/**
 * Props:
 *  - initialMarkdown: string  — existing markdown to pre-populate
 *  - onChange: (markdown: string) => void  — called whenever content changes
 */
const RichTextEditor = ({ initialMarkdown = "", onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { languageClassPrefix: "language-" } }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({
        placeholder: "Start writing your story…",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: initialMarkdown ? markdownToHtml(initialMarkdown) : "",
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] outline-none px-6 py-5 text-gray-200 leading-relaxed focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      if (onChange) onChange(markdown);
    },
  });

  // If initialMarkdown changes externally (e.g. edit flow), reload content
  useEffect(() => {
    if (!editor || !initialMarkdown) return;
    const currentMarkdown = htmlToMarkdown(editor.getHTML());
    if (currentMarkdown.trim() !== initialMarkdown.trim()) {
      editor.commands.setContent(markdownToHtml(initialMarkdown), false);
    }
  }, [initialMarkdown, editor]);

  return (
    <div className="tiptap-editor border border-white/10 rounded-xl overflow-hidden bg-[#141414]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
