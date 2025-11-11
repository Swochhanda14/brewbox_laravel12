<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'images' => 'required|array|max:5',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        $imagePaths = [];

        foreach ($request->file('images') as $file) {
            $filename = 'images-' . time() . '-' . uniqid() . '.' . $file->extension();
            $path = $file->storeAs('uploads', $filename, 'public');
            $imagePaths[] = '/storage/' . $path;
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'images' => $imagePaths,
        ]);
    }
}
