import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

export default function TiptapBasic() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Escribe aquí…' }),
    ],
    content: '<p>Hola TipTap 👋</p>',
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!editor) return
    setSaving(true)

    const json = editor.getJSON()
    const html = editor.getHTML()

    const res = await fetch('/api/tiptap-debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        title: 'demo',
        content: json,
        content_html: html,
      }),
    })
      .then(res => res.json())
  .then(data => console.log('Lo que recibe Laravel:', data))

    const data = await res.json()
    console.log('JSON generado:', json) 
    alert('Respuesta Laravel\n' + JSON.stringify(data, null, 2))
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
  
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>• Lista</button>
        <button onClick={() => editor?.chain().focus().setParagraph().run()}>Párrafo</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      </div>

      
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>

    
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
