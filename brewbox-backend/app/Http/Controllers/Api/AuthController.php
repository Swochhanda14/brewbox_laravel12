<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Delete old tokens (optional)
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            '_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'number' => $user->number,
            'isAdmin' => $user->is_admin,
            'token' => $token,
        ]);
    }

    // Register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'number' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Will be auto-hashed
            'number' => $request->number,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            '_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'number' => $user->number,
            'isAdmin' => $user->is_admin,
            'token' => $token,
        ], 201);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    // Get Profile
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            '_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'number' => $user->number,
            'isAdmin' => $user->is_admin,
        ]);
    }

    // Update Profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'number' => 'nullable|string',
            'password' => 'nullable|string|min:6',
        ]);

        $user->fill($request->only(['name', 'email', 'number']));

        if ($request->filled('password')) {
            $user->password = $request->password; // Will be auto-hashed
        }

        $user->save();

        return response()->json([
            '_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'number' => $user->number,
            'isAdmin' => $user->is_admin,
        ]);
    }
}
