<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->json('image'); // Store array of image paths
            $table->string('category');
            $table->text('description');
            $table->decimal('min_price', 10, 2)->default(0);
            $table->decimal('max_price', 10, 2)->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('num_reviews')->default(0);
            $table->integer('count_in_stock')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
