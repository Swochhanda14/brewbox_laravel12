<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">BrewBox</h1>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin-top: 0;">Order Status Update</h2>
        
        <p>Hello {{ $order->user->name }},</p>
        
        <p>Your order status has been updated:</p>
        
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0;"><strong>Order Number:</strong> #{{ $order->id }}</p>
            <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="color: #10b981; font-weight: bold;">{{ ucfirst($status) }}</span></p>
            @if($order->delivered_at)
            <p style="margin: 5px 0;"><strong>Delivered At:</strong> {{ $order->delivered_at->format('F d, Y h:i A') }}</p>
            @endif
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Thank you for shopping with BrewBox!
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>&copy; {{ date('Y') }} BrewBox. All rights reserved.</p>
    </div>
</body>
</html>

