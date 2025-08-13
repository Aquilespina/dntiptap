// resources/js/components/Editor.jsx
import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Escribe aquí…' }),
    ],
    content: '<p>Hola TipTap 👋</p>',
    autofocus: true,
  })

  const addLink = useCallback(() => {
    const url = window.prompt('URL del enlace:')
    if (!url) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const save = useCallback(async () => {
    if (!editor) return
    const payload = {
      title: 'Mi primer documento',
      content_html: editor.getHTML(),
      content_json: editor.getJSON(),
    }

    try {
      const res = await fetch('/api/editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al guardar')
      alert('Guardado con éxito. ID: ' + data.data.id)
    } catch (err) {
      console.error(err)
      alert('Error: ' + err.message)
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="space-y-2">
      {/* Toolbar básica */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 border rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 border rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}>I</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 border rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}>• Lista</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 border rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}>1. Lista</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={`px-2 py-1 border rounded ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}>Párrafo</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 border rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}>H2</button>
        <button onClick={addLink} className="px-2 py-1 border rounded">Link</button>
        <button onClick={() => editor.chain().focus().unsetLink().run()} className="px-2 py-1 border rounded">Quitar link</button>
        <button onClick={() => editor.chain().focus().undo().run()} className="px-2 py-1 border rounded">Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()} className="px-2 py-1 border rounded">Redo</button>
        <button onClick={save} className="px-3 py-1 border rounded bg-black text-white">Guardar</button>
      </div>

      {/* Área del editor */}
      <div className="border rounded p-3 min-h-[200px] prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}