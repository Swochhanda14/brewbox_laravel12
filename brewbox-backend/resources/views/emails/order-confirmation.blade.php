<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">BrewBox</h1>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin-top: 0;">Order Confirmation</h2>
        
        <p>Hello {{ $order->user->name }},</p>
        
        <p>Thank you for your order! We've received your order and are preparing it for shipment.</p>
        
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0;"><strong>Order Number:</strong> #{{ $order->id }}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> {{ $order->created_at->format('F d, Y h:i A') }}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs. {{ number_format($order->total_price, 2) }}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> {{ $order->payment_method }}</p>
        </div>
        
        <h3 style="color: #1f2937; margin-top: 30px;">Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr style="background: #e5e7eb;">
                    <th style="padding: 10px; text-align: left;">Item</th>
                    <th style="padding: 10px; text-align: right;">Quantity</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->orderItems as $item)
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px;">{{ $item->name }}</td>
                    <td style="padding: 10px; text-align: right;">{{ $item->qty }}</td>
                    <td style="padding: 10px; text-align: right;">Rs. {{ number_format($item->price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold;">Rs. {{ number_format($order->total_price, 2) }}</td>
                </tr>
            </tfoot>
        </table>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            We'll send you another email when your order ships. Thank you for choosing BrewBox!
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>&copy; {{ date('Y') }} BrewBox. All rights reserved.</p>
    </div>
</body>
</html>

