<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'qty',
        'image',
        'size',
        'grind',
        'roast',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Accessor to normalize empty strings to 'N/A' for size and grind
    public function getSizeAttribute($value)
    {
        return ($value === '' || $value === null) ? 'N/A' : $value;
    }

    public function getGrindAttribute($value)
    {
        return ($value === '' || $value === null) ? 'N/A' : $value;
    }

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
