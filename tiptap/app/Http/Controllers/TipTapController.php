<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TipTapController extends Controller
{
    public function store(Request $request)
    {
        // Aquí puedes validar y procesar la data de TipTap
        return response()->json([
            'message' => 'Contenido recibido correctamente',
            'data' => $request->all()
        ]);
    }
}
