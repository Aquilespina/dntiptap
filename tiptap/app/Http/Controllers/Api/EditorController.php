<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Post;

class EditorController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'nullable|string|max:255',
            'content'      => 'required',       
            'content_html' => 'nullable|string' 
        ]);


        Log::info('tiptap.request', $request->all());

        $post = new Post();
        $post->title = $data['title'] ?? null;


        if (is_array($data['content'])) {
            $post->content_json = $data['content'];
        } else {
            $post->content_html = (string) $data['content'];
        }

      
        if (!empty($data['content_html'])) {
            $post->content_html = $data['content_html'];
        }

        $post->save();

        return response()->json([
            'message'  => 'ok',
            'id'       => $post->id,
  
            'received' => $request->all(),
        ], 201);
    }

    public function show(Post $post)
    {
        return response()->json($post);
    }
}