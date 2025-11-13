<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">BrewBox</h1>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
        
        <p>Hello,</p>
        
        <p>We received a request to reset your password for your BrewBox account. Click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $resetUrl }}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="background: #e5e7eb; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">{{ $resetUrl }}</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            <strong>Note:</strong> This link will expire in 60 minutes. If you didn't request a password reset, please ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
            If you're having trouble clicking the button, copy and paste the URL above into your web browser.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>&copy; {{ date('Y') }} BrewBox. All rights reserved.</p>
    </div>
</body>
</html>

