<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockAlert;
use Illuminate\Support\Str;
use App\Models\Review;
use Illuminate\Http\Request;
use App\Services\SentimentAnalyzer;
use App\Services\RecommendationService;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    protected $sentimentAnalyzer;
    protected $recommendationService;

    public function __construct(
        SentimentAnalyzer $sentimentAnalyzer,
        RecommendationService $recommendationService
    ) {
        $this->sentimentAnalyzer = $sentimentAnalyzer;
        $this->recommendationService = $recommendationService;
    }

    // Get all products with pagination
    public function index(Request $request)
    {
        $pageSize = 8;
        $page = $request->input('pageNumber', 1);
        $keyword = $request->input('keyword');

        $query = Product::query();

        if ($keyword) {
            $query->where('product_name', 'like', "%{$keyword}%");
        }

        $count = $query->count();
        $products = $query->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get();

        return response()->json([
            'products' => $products,
            'page' => $page,
            'pages' => ceil($count / $pageSize),
        ]);
    }

    // Get single product
    public function show($id)
    {
        $product = Product::with('reviews.user:id,name')->findOrFail($id);
        return response()->json($product);
    }

    // Create product (Admin)
    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string',
            'min_price' => 'required|numeric',
            'max_price' => 'required|numeric',
            'image' => 'required|array|min:1',
            'category' => 'required|string',
            'countInStock' => 'required|integer',
            'description' => 'required|string',
        ]);

        $product = Product::create([
            'product_name' => $request->product_name,
            'min_price' => $request->min_price,
            'max_price' => $request->max_price,
            'image' => $request->image,
            'category' => $request->category,
            'count_in_stock' => $request->countInStock,
            'description' => $request->description,
        ]);

        return response()->json($product, 201);
    }

    // Update product (Admin)
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'product_name' => 'string',
            'min_price' => 'numeric',
            'max_price' => 'numeric',
            'image' => 'array|min:1',
            'category' => 'string',
            'countInStock' => 'integer',
            'description' => 'string',
        ]);

        $product->update([
            'product_name' => $request->product_name ?? $product->product_name,
            'min_price' => $request->min_price ?? $product->min_price,
            'max_price' => $request->max_price ?? $product->max_price,
            'image' => $request->image ?? $product->image,
            'category' => $request->category ?? $product->category,
            'count_in_stock' => $request->countInStock ?? $product->count_in_stock,
            'description' => $request->description ?? $product->description,
        ]);

        return response()->json($product);
    }

    // Delete product (Admin)
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Delete associated images
        if (is_array($product->image)) {
            foreach ($product->image as $imagePath) {
                $path = ltrim($imagePath, '/');
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $product->delete();

        return response()->json(['message' => 'Product removed']);
    }

    // Create review
    public function createReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $product = Product::findOrFail($id);
        $user = $request->user();

        // Check if already reviewed
        $alreadyReviewed = Review::where('product_id', $product->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'message' => 'Product already reviewed'
            ], 400);
        }

        // Analyze sentiment
        $sentimentScore = $this->sentimentAnalyzer->analyze($request->comment);

        Review::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'name' => $user->name,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'sentiment_score' => $sentimentScore,
            'keywords' => $this->extractKeywords($request->comment),
        ]);

        $product->updateRating();

        return response()->json(['message' => 'Review added'], 201);
    }

    // Get top products
    public function getTopProducts()
    {
        $products = Product::orderBy('rating', 'desc')->limit(4)->get();
        return response()->json($products);
    }

    // Get recommended products
    public function getRecommendedProducts()
    {
        $products = $this->recommendationService->getRecommended();
        return response()->json($products);
    }

    public function notifyWhenAvailable(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $product = Product::findOrFail($id);

        StockAlert::updateOrCreate(
            [
                'product_id' => $product->id,
                'email' => $request->email,
            ],
            []
        );

        return response()->json([
            'message' => 'You will be notified when this product is back in stock.',
        ]);
    }

    private function extractKeywords(string $comment): array
    {
        $keywords = collect(Str::of($comment)->lower()->replaceMatches('/[^a-z0-9\s]/', '')->explode(' '))
            ->filter()
            ->unique()
            ->values();

        $interesting = $keywords->intersect([
            'aroma', 'smooth', 'strong', 'bold', 'light',
            'rich', 'balanced', 'fruity', 'nutty', 'bitter',
            'sweet', 'creamy', 'chocolatey', 'floral', 'earthy',
            'fresh', 'stale', 'acidic', 'caramel', 'smoky',
        ]);

        if ($interesting->isEmpty()) {
            return $keywords->take(5)->values()->all();
        }

        return $interesting->take(8)->values()->all();
    }
}
