<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
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
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'payment_result' => 'array',
        'items_price' => 'decimal:2',
        'tax_price' => 'decimal:2',
        'shipping_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'is_paid' => 'boolean',
        'is_delivered' => 'boolean',
        'paid_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
