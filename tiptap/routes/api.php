<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EditorController;
use App\Http\Controllers\TipTapController;
use App\Http\Controllers\Api\DebugController;


Route::post('/editor', [EditorController::class, 'store']);

Route::get('/editor/{post}', [EditorController::class, 'show']);
Route::post('/tiptap', [TipTapController::class, 'store']);
