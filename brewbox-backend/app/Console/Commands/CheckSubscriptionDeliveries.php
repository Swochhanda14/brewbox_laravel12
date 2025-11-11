<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Carbon\Carbon;

class CheckSubscriptionDeliveries extends Command
{
    protected $signature = 'subscriptions:check';
    protected $description = 'Check and update subscription delivery status';

    public function handle()
    {
        $this->info('Checking subscription deliveries...');

        $orders = Order::with('orderItems.product')
            ->where('is_delivered', true)
            ->get();

        $now = Carbon::now();
        $updated = 0;

        foreach ($orders as $order) {
            $isSubscription = $order->orderItems->contains(function ($item) {
                return $item->product && $item->product->category === 'Subscription';
            });

            if (!$isSubscription) continue;

            $subItem = $order->orderItems->first(function ($item) {
                return $item->product && $item->product->category === 'Subscription';
            });

            // Extract duration from product name
            $duration = 3;
            if ($subItem && preg_match('/(\d+)\s*months?/i', $subItem->product->product_name, $match)) {
                $duration = (int) $match[1];
            }

            $start = Carbon::parse($order->created_at);
            $end = $start->copy()->addMonths($duration);

            // Check if subscription ended
            if ($now >= $end) {
                continue;
            }

            // Calculate next delivery
            $next = $start->copy();
            while ($next <= $now && $next < $end) {
                $next->addMonth();
            }

            if ($next > $end) {
                $next = $end;
            }

            $daysUntilNext = $now->diffInDays($next, false);

            // Skip if recently delivered (within 3 days)
            if ($order->delivered_at) {
                $deliveredAt = Carbon::parse($order->delivered_at);
                $daysBetween = $deliveredAt->diffInDays($next, false);

                if ($daysBetween >= 0 && $daysBetween <= 3) {
                    continue;
                }
            }

            // Set to not delivered if within 3 days of next delivery
            if ($daysUntilNext >= 0 && $daysUntilNext <= 3 && $next <= $end) {
                $order->is_delivered = false;
                $order->save();
                $updated++;

                $this->info("Order #{$order->id} updated: Next delivery in {$daysUntilNext} days");
            }
        }

        $this->info("Updated {$updated} subscription orders");
        return 0;
    }
}
