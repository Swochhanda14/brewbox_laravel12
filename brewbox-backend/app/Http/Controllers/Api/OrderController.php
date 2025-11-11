<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Create order
    public function store(Request $request)
    {
        $request->validate([
            'orderItems' => 'required|array',
            'shippingAddress' => 'required|array',
            'paymentMethod' => 'required|string',
            'itemsPrice' => 'required|numeric',
            'shippingPrice' => 'required|numeric',
            'taxPrice' => 'required|numeric',
            'totalPrice' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'shipping_address' => $request->shippingAddress,
                'payment_method' => $request->paymentMethod,
                'items_price' => $request->itemsPrice,
                'shipping_price' => $request->shippingPrice,
                'tax_price' => $request->taxPrice,
                'total_price' => $request->totalPrice,
            ]);

            // Create order items and update stock
            foreach ($request->orderItems as $item) {
                $productId = $item['product'] ?? $item['_id'];
                $product = Product::findOrFail($productId);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'name' => $product->product_name,
                    'qty' => $item['qty'] ?? $item['quantity'],
                    'image' => is_array($product->image) ? $product->image[0] : $product->image,
                    'size' => $item['size'] ?? 'N/A',
                    'grind' => $item['grind'] ?? 'N/A',
                    'roast' => $item['roast'] ?? null,
                    'price' => $item['price'],
                ]);

                // Decrease stock
                $product->decrement('count_in_stock', $item['qty'] ?? $item['quantity']);
            }

            DB::commit();

            return response()->json($order->load('orderItems'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // Get user orders
    public function getMyOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('orderItems.product')
            ->get();

        return response()->json($orders);
    }

    // Get order by ID
    public function show($id)
    {
        $order = Order::with([
            'user:id,name,email,number',
            'orderItems.product:id,category'
        ])->findOrFail($id);

        return response()->json($order);
    }

    // Update to delivered (Admin)
    public function updateToDelivered($id)
    {
        $order = Order::with('orderItems.product')->findOrFail($id);

        // Check if subscription
        $isSubscription = $order->orderItems->contains(function ($item) {
            return $item->product && $item->product->category === 'Subscription';
        });

        if (!$isSubscription) {
            // Regular order
            $order->is_delivered = true;
            $order->delivered_at = now();
            $order->save();

            return response()->json($order);
        }

        // Subscription logic
        $order->is_delivered = true;
        $order->delivered_at = now();
        $order->save();

        // Calculate next delivery
        $subItem = $order->orderItems
            ->filter(function ($item) {
                return $item->product && $item->product->category === 'Subscription';
            })
            ->first();

        $duration = 3;
        if ($subItem && preg_match('/(\d+)\s*months?/i', $subItem->product->product_name, $match)) {
            $duration = (int) $match[1];
        }

        $start = $order->created_at;
        $end = $start->copy()->addMonths($duration);
        $now = now();
        $next = $start->copy();

        while ($next <= $now && $next < $end) {
            $next->addMonth();
        }

        // If next delivery within 3 days, set to not delivered
        $daysUntil = $now->diffInDays($next, false);
        if ($daysUntil >= 0 && $daysUntil <= 3 && $next <= $end) {
            $order->is_delivered = false;
            $order->save();
        }

        return response()->json($order);
    }

    // Get all orders (Admin)
    public function index()
    {
        $orders = Order::with([
            'user:id,name,email,number',
            'orderItems.product:id,category'
        ])->get();

        return response()->json($orders);
    }
}
