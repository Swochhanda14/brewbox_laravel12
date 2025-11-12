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
        $users = User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'number' => $user->number,
                'isAdmin' => $user->is_admin,
                'is_admin' => $user->is_admin,
            ];
        });
        return response()->json($users);
    }

    // Get user by ID
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'id' => $user->id,
            '_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'number' => $user->number,
            'isAdmin' => $user->is_admin,
            'is_admin' => $user->is_admin,
        ]);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Custom validation messages
        $messages = [
            'name.required' => 'Username is required',
            'name.min' => 'Username must be at least 5 characters',
            'name.unique' => 'Username is already taken',
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'Email is already in use',
            'number.required' => 'Phone number is required',
            'number.regex' => 'Phone number must be 10 digits and start with 98',
            'number.unique' => 'Phone number is already in use',
        ];

        // Build validation rules
        $rules = [
            'name' => 'required|string|min:5|max:255|unique:users,name,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'number' => [
                'required',
                'string',
                'regex:/^98\d{8}$/',
                'unique:users,number,' . $user->id,
            ],
            'isAdmin' => 'nullable|boolean',
        ];

        try {
            $validated = $request->validate($rules, $messages);

            $user->fill([
                'name' => trim($validated['name']),
                'email' => $validated['email'],
                'number' => $validated['number'],
            ]);

            // Always update is_admin if the key exists in the request (even if false)
            if ($request->has('isAdmin')) {
                $user->is_admin = (bool) $validated['isAdmin'];
            }

            $user->save();

            return response()->json([
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'number' => $user->number,
                'isAdmin' => $user->is_admin,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
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


