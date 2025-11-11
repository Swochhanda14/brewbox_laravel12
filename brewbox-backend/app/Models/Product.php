<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_name',
        'image',
        'category',
        'description',
        'min_price',
        'max_price',
        'rating',
        'num_reviews',
        'count_in_stock',
    ];

    protected $casts = [
        'image' => 'array',
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'num_reviews' => 'integer',
        'count_in_stock' => 'integer',
    ];

    // Relationships
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Update rating after review
    public function updateRating()
    {
        $this->rating = $this->reviews()->avg('rating') ?? 0;
        $this->num_reviews = $this->reviews()->count();
        $this->save();
    }
}
