<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    // Submit contact form
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ], [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'message.required' => 'Message is required',
            'message.max' => 'Message must not exceed 5000 characters',
        ]);

        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
        ]);

        // Send email notification to admin
        try {
            Mail::send(new ContactFormMail($contact));
        } catch (\Exception $e) {
            \Log::error('Contact form email failed: ' . $e->getMessage());
            // Don't fail the request if email fails
        }

        return response()->json([
            'message' => 'Thank you for contacting us! We will get back to you soon.',
            'contact' => $contact,
        ], 201);
    }
}
