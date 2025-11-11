<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Get all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Get user by ID
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user->makeHidden('password'));
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'number' => 'nullable|string',
            'isAdmin' => 'boolean',
        ]);

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'number' => $request->number ?? $user->number,
            'is_admin' => $request->isAdmin ?? $user->is_admin,
        ]);

        return response()->json([
            '_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'number' => $user->number,
            'isAdmin' => $user->is_admin,
        ]);
    }

    // Delete user
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->is_admin) {
            return response()->json([
                'message' => 'Cannot delete admin user'
            ], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User removed']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !password_verify($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            '_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'number' => $user->number,
            'isAdmin' => $user->is_admin,
        ]);
    }
}


