<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $messages = [
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'password.required' => 'Password is required',
        ];

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], $messages);

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
        // Custom validation messages
        $messages = [
            'name.required' => 'Username is required',
            'name.min' => 'Username must be at least 5 characters',
            'name.unique' => 'Username is already taken',
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'Email is already in use',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.regex' => 'Password must contain at least 1 uppercase letter and 1 symbol',
            'number.required' => 'Phone number is required',
            'number.regex' => 'Phone number must be 10 digits and start with 98',
            'number.unique' => 'Phone number is already in use',
        ];

        $validated = $request->validate([
            'name' => 'required|string|min:5|max:255|unique:users,name',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*[!@#$%^&*()[\]{}_\-+=~`|\\:;"\'<>,.?\/]).+$/',
            ],
            'number' => [
                'required',
                'string',
                'regex:/^98\d{8}$/',
                'unique:users,number',
            ],
        ], $messages);

        $user = User::create([
            'name' => trim($validated['name']),
            'email' => $validated['email'],
            'password' => $validated['password'], // Will be auto-hashed
            'number' => $validated['number'],
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

        // Custom validation messages
        $messages = [
            'name.required' => 'Username is required',
            'name.min' => 'Username must be at least 5 characters',
            'name.unique' => 'Username is already taken',
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'Email is already in use',
            'password.min' => 'Password must be at least 8 characters',
            'password.regex' => 'Password must contain at least 1 uppercase letter and 1 symbol',
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
        ];

        // Password validation is optional - only validate if provided
        if ($request->filled('password')) {
            $rules['password'] = [
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*[!@#$%^&*()[\]{}_\-+=~`|\\:;"\'<>,.?\/]).+$/',
            ];
        }

        $validated = $request->validate($rules, $messages);

        $user->fill([
            'name' => trim($validated['name']),
            'email' => $validated['email'],
            'number' => $validated['number'],
        ]);

        if ($request->filled('password')) {
            $user->password = $validated['password']; // Will be auto-hashed
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

    // Forgot Password
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if user exists for security
            return response()->json([
                'message' => 'If that email address exists, we will send a password reset link.'
            ], 200);
        }

        // Generate token
        $token = Str::random(64);

        // Delete old tokens for this email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Insert new token
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // Send email
        try {
            Mail::to($request->email)->send(new ResetPasswordMail($token, $request->email));
        } catch (\Exception $e) {
            // Log error but don't reveal to user
            \Log::error('Password reset email failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'If that email address exists, we will send a password reset link.'
        ], 200);
    }

    // Reset Password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*[!@#$%^&*()[\]{}_\-+=~`|\\:;"\'<>,.?\/]).+$/',
            ],
        ], [
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'token.required' => 'Reset token is required',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.regex' => 'Password must contain at least 1 uppercase letter and 1 symbol',
        ]);

        // Find the password reset record
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid or expired reset token'
            ], 400);
        }

        // Check if token is valid (created within last 60 minutes)
        $createdAt = \Carbon\Carbon::parse($resetRecord->created_at);
        if ($createdAt->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Reset token has expired. Please request a new one.'
            ], 400);
        }

        // Verify token
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'Invalid reset token'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $user->password = $request->password; // Will be auto-hashed
        $user->save();

        // Delete the reset token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password has been reset successfully'
        ], 200);
    }
}
