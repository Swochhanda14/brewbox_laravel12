<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'john@example.com')->first();
        $products = Product::limit(3)->get();

        if (!$user || $products->count() < 3) {
            echo "⚠ Skipping OrderSeeder - Users or Products not found\n";
            return;
        }

        // Create first order (delivered)
        $order1 = Order::create([
            'user_id' => $user->id,
            'shipping_address' => [
                'address' => '123 Main Street',
                'city' => 'Kathmandu',
                'postalCode' => '44600',
                'country' => 'Nepal',
            ],
            'payment_method' => 'esewa',
            'items_price' => 1700.00,
            'shipping_price' => 100.00,
            'tax_price' => 180.00,
            'total_price' => 1980.00,
            'is_paid' => true,
            'paid_at' => now(),
            'is_delivered' => true,
            'delivered_at' => now()->subDays(2),
        ]);

        // Add items to first order
        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $products[0]->id,
            'name' => $products[0]->product_name,
            'qty' => 1,
            'image' => is_array($products[0]->image) ? $products[0]->image[0] : $products[0]->image,
            'size' => '250g',
            'grind' => 'whole-bean',
            'roast' => 'medium',
            'price' => $products[0]->price,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $products[1]->id,
            'name' => $products[1]->product_name,
            'qty' => 1,
            'image' => is_array($products[1]->image) ? $products[1]->image[0] : $products[1]->image,
            'size' => '250g',
            'grind' => 'medium',
            'roast' => 'dark',
            'price' => $products[1]->price,
        ]);

        // Create second order (pending delivery)
        $order2 = Order::create([
            'user_id' => $user->id,
            'shipping_address' => [
                'address' => '456 Park Avenue',
                'city' => 'Lalitpur',
                'postalCode' => '44700',
                'country' => 'Nepal',
            ],
            'payment_method' => 'cod',
            'items_price' => 750.00,
            'shipping_price' => 100.00,
            'tax_price' => 85.00,
            'total_price' => 935.00,
            'is_paid' => false,
            'paid_at' => null,
            'is_delivered' => false,
            'delivered_at' => null,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $products[2]->id,
            'name' => $products[2]->product_name,
            'qty' => 1,
            'image' => is_array($products[2]->image) ? $products[2]->image[0] : $products[2]->image,
            'size' => '500g',
            'grind' => 'fine',
            'roast' => 'light',
            'price' => $products[2]->price,
        ]);

        echo "✓ Orders created successfully\n";
    }
}
