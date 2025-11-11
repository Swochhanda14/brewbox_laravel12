<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Check if user_id doesn't exist and add it
            if (!Schema::hasColumn('orders', 'user_id')) {
                $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
            }

            // Ensure other columns exist
            if (!Schema::hasColumn('orders', 'shipping_address')) {
                $table->json('shipping_address')->nullable();
            }
            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method');
            }
            if (!Schema::hasColumn('orders', 'items_price')) {
                $table->decimal('items_price', 10, 2)->default(0);
            }
            if (!Schema::hasColumn('orders', 'shipping_price')) {
                $table->decimal('shipping_price', 10, 2)->default(0);
            }
            if (!Schema::hasColumn('orders', 'tax_price')) {
                $table->decimal('tax_price', 10, 2)->default(0);
            }
            if (!Schema::hasColumn('orders', 'total_price')) {
                $table->decimal('total_price', 10, 2)->default(0);
            }
            if (!Schema::hasColumn('orders', 'is_paid')) {
                $table->boolean('is_paid')->default(false);
            }
            if (!Schema::hasColumn('orders', 'paid_at')) {
                $table->timestamp('paid_at')->nullable();
            }
            if (!Schema::hasColumn('orders', 'is_delivered')) {
                $table->boolean('is_delivered')->default(false);
            }
            if (!Schema::hasColumn('orders', 'delivered_at')) {
                $table->timestamp('delivered_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'shipping_address',
                'payment_method',
                'items_price',
                'shipping_price',
                'tax_price',
                'total_price',
                'is_paid',
                'paid_at',
                'is_delivered',
                'delivered_at',
            ]);
        });
    }
};
