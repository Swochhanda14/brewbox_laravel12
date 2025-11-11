<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'product_name' => 'Ethiopian Yirgacheffe',
                'image' => ['/uploads/ethiopian-coffee.jpg'],
                'category' => 'Coffee',
                'description' => 'Bright and fruity coffee with floral notes from BrewBox Premium',
                'min_price' => 750.00,
                'max_price' => 950.00,
                'rating' => 4.5,
                'num_reviews' => 12,
                'count_in_stock' => 50,
            ],
            [
                'product_name' => 'Colombian Supremo',
                'image' => ['/uploads/colombian-coffee.jpg'],
                'category' => 'Coffee',
                'description' => 'Rich and balanced with caramel sweetness from BrewBox Premium',
                'min_price' => 800.00,
                'max_price' => 1000.00,
                'rating' => 4.7,
                'num_reviews' => 18,
                'count_in_stock' => 40,
            ],
            [
                'product_name' => 'Brazilian Santos',
                'image' => ['/uploads/brazilian-coffee.jpg'],
                'category' => 'Coffee',
                'description' => 'Smooth and nutty with low acidity from BrewBox Premium',
                'min_price' => 650.00,
                'max_price' => 850.00,
                'rating' => 4.3,
                'num_reviews' => 9,
                'count_in_stock' => 60,
            ],
            [
                'product_name' => 'Kenyan AA',
                'image' => ['/uploads/kenyan-coffee.jpg'],
                'category' => 'Coffee',
                'description' => 'Bold and wine-like with berry notes from BrewBox Premium',
                'min_price' => 850.00,
                'max_price' => 1050.00,
                'rating' => 4.8,
                'num_reviews' => 21,
                'count_in_stock' => 35,
            ],
            [
                'product_name' => 'Monthly Coffee Subscription',
                'image' => ['/uploads/subscription.jpg'],
                'category' => 'Subscription',
                'description' => 'Get fresh coffee delivered every month with BrewBox subscription',
                'min_price' => 2500.00,
                'max_price' => 2500.00,
                'rating' => 5.0,
                'num_reviews' => 45,
                'count_in_stock' => 100,
            ],
            [
                'product_name' => '3 Months Coffee Subscription',
                'image' => ['/uploads/subscription-3.jpg'],
                'category' => 'Subscription',
                'description' => 'Save more with 3 months BrewBox subscription plan',
                'min_price' => 7000.00,
                'max_price' => 7000.00,
                'rating' => 5.0,
                'num_reviews' => 32,
                'count_in_stock' => 100,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        echo "✓ Products created successfully\n";
    }
}
