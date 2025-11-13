# BrewBox - Complete Feature & Function List

## Project Overview
BrewBox is a full-stack e-commerce coffee shop application built with:
- **Frontend**: React.js with Redux Toolkit, Tailwind CSS, Vite
- **Backend**: Laravel (PHP) with Sanctum authentication
- **Database**: SQLite
- **Features**: Product management, orders, subscriptions, reviews with sentiment analysis, and AI-powered recommendations

---

## 🎯 CORE FEATURES

### 1. USER AUTHENTICATION & AUTHORIZATION

#### Authentication Features:
- **User Registration**
  - Username validation (minimum 5 characters)
  - Email validation
  - Phone number validation (10 digits, must start with 98)
  - Password hashing
  - Duplicate email/phone/username prevention

- **User Login**
  - Email/username-based login
  - JWT token-based authentication (Laravel Sanctum)
  - Session management
  - Remember me functionality

- **User Profile Management**
  - View profile information
  - Update profile (name, email, phone)
  - Profile page with order history

- **Logout**
  - Secure token invalidation
  - Session cleanup

#### Authorization:
- **Role-Based Access Control (RBAC)**
  - Regular users
  - Admin users (isAdmin flag)
  - Protected routes (PrivateRoute component)
  - Admin-only routes (AdminRoute component)

---

### 2. PRODUCT MANAGEMENT

#### Customer Features:
- **Product Browsing**
  - View all products with pagination (8 products per page)
  - Product search by keyword
  - Product filtering:
    - By category
    - By price range (min/max)
    - By minimum rating
    - In-stock only filter
  - Product sorting
  - Product grid/list view

- **Product Details**
  - Detailed product information
  - Multiple product images
  - Product description
  - Price range (min_price, max_price)
  - Stock availability
  - Customer reviews and ratings
  - Related/recommended products

- **Product Customization** (for coffee products)
  - Size selection (250g, 500g, 1kg, etc.)
  - Grind type selection (whole beans, coarse, medium, fine, etc.)
  - Roast level selection (light, medium, dark)
  - Quantity selector

#### Admin Features:
- **Product CRUD Operations**
  - Create new products
  - Update existing products
  - Delete products (with image cleanup)
  - Bulk product management
  - Product list with pagination

- **Product Fields:**
  - Product name
  - Category
  - Description
  - Min price / Max price
  - Multiple images (array)
  - Stock count
  - Rating (auto-calculated)
  - Number of reviews (auto-calculated)

---

### 3. SHOPPING CART

#### Cart Features:
- **Add to Cart**
  - Add products with customizations (size, grind, roast)
  - Quantity selection
  - Price calculation based on selections
  - Cart persistence (Redux state)

- **Cart Management**
  - View cart items
  - Update quantities
  - Remove items
  - Clear cart
  - Cart total calculation
  - Item count display

- **Cart Validation**
  - Stock availability check
  - Quantity limits
  - Price validation

---

### 4. ORDER MANAGEMENT

#### Customer Order Features:
- **Order Placement**
  - Multi-step checkout process:
    1. Cart review
    2. Shipping address entry
    3. Payment method selection
    4. Order confirmation
  - Order summary
  - Order total calculation (items + shipping + tax)

- **Order Tracking**
  - View order history
  - Order details page
  - Order status tracking
  - Delivery status

- **Shipping Information**
  - Full name
  - Address (street, city, state, postal code, country)
  - Phone number
  - Address validation

#### Admin Order Management:
- **Order Management**
  - View all orders
  - Filter orders
  - View order details
  - Update order status
  - Mark orders as delivered
  - View customer information for each order

- **Subscription Order Handling**
  - Special handling for subscription orders
  - Automatic recurring delivery calculation
  - Next delivery date tracking
  - Subscription status management

---

### 5. PAYMENT SYSTEM

#### Payment Methods:
- **Esewa Integration**
  - Online payment gateway
  - Payment success/failure handling
  - Payment verification
  - Redirect to Esewa payment page

- **Cash on Delivery (COD)**
  - Available for regular orders
  - Not available for subscriptions
  - Payment on delivery

- **Payment Processing**
  - Payment method selection
  - Payment status tracking
  - Payment history
  - Order payment confirmation

---

### 6. SUBSCRIPTION SYSTEM

#### Subscription Features:
- **Subscription Plans**
  - View available subscription plans
  - Subscription categories
  - Plan details (duration, price, frequency)
  - Subscription benefits display

- **Subscription Management**
  - Subscribe to plans
  - Automatic recurring deliveries
  - Delivery frequency management
  - Pause/cancel subscriptions
  - Subscription status tracking

- **Subscription Delivery**
  - Automatic delivery scheduling
  - Next delivery date calculation
  - Delivery reminders
  - Subscription order tracking

#### Admin Subscription Features:
- **Subscription Management**
  - View all subscriptions
  - Subscription list page
  - Subscription status updates
  - Delivery management for subscriptions

---

### 7. REVIEW & RATING SYSTEM

#### Review Features:
- **Product Reviews**
  - Write reviews for products
  - Star rating (1-5 stars)
  - Text comments
  - One review per user per product
  - Review display on product pages

- **Review Filtering**
  - Filter by rating (1-5 stars)
  - Filter by keywords
  - Review sorting
  - Review pagination

- **Sentiment Analysis** (AI-Powered)
  - Automatic sentiment analysis of reviews
  - Sentiment score calculation (-1 to 1)
  - Positive/negative/neutral classification
  - AFINN lexicon-based analysis
  - Coffee-specific sentiment words

- **Keyword Extraction**
  - Automatic keyword extraction from reviews
  - Coffee-specific keywords (aroma, smooth, bold, etc.)
  - Keyword-based filtering

- **Rating Aggregation**
  - Automatic average rating calculation
  - Review count tracking
  - Product rating updates on new reviews

---

### 8. RECOMMENDATION SYSTEM (AI-Powered)

#### Recommendation Features:
- **Product Recommendations**
  - TF-IDF (Term Frequency-Inverse Document Frequency) analysis
  - Sentiment-based recommendations
  - Rating-based recommendations
  - Combined scoring algorithm
  - Top recommended products display

- **Recommendation Algorithm:**
  - Analyzes product descriptions
  - Considers review sentiment scores
  - Factors in product ratings
  - Calculates combined recommendation score
  - Returns top 4 recommended products

---

### 9. STOCK MANAGEMENT

#### Stock Features:
- **Stock Tracking**
  - Real-time stock count
  - Stock availability display
  - Low stock alerts (≤ 5 items)
  - Out of stock handling

- **Stock Alerts**
  - Email notifications for back-in-stock
  - Stock alert registration
  - Alert management

- **Automatic Stock Updates**
  - Stock decrement on order placement
  - Stock validation before checkout
  - Stock restoration (if needed)

#### Admin Stock Management:
- **Stock Monitoring**
  - View all products with stock levels
  - Low stock alerts dashboard
  - Stock update functionality
  - Stock reports

---

### 10. ADMIN DASHBOARD

#### Dashboard Features:
- **Analytics & Statistics**
  - Total orders count
  - Total revenue
  - Total users count
  - Total products count
  - Average order value
  - Pending subscriptions count
  - Delivered orders count
  - Not delivered orders count
  - New users (last 30 days)

- **Charts & Visualizations**
  - Sales overview bar chart
  - Monthly revenue trend line chart
  - 6-month revenue analysis
  - Top selling products

- **Low Stock Alerts**
  - Products with stock ≤ 5
  - Alert list display
  - Quick stock management

- **Top Products**
  - Best selling products
  - Sales quantity tracking
  - Product performance metrics

---

### 11. USER MANAGEMENT (Admin)

#### User Management Features:
- **User List**
  - View all registered users
  - User information display
  - User search/filter

- **User CRUD Operations**
  - View user details
  - Update user information
  - Delete users
  - Toggle admin status

- **User Update Features:**
  - Update username
  - Update email
  - Update phone number
  - Grant/revoke admin privileges
  - Validation on updates

---

### 12. SEARCH & FILTERING

#### Search Features:
- **Product Search**
  - Keyword-based search
  - Search by product name
  - Search results pagination
  - Search highlighting

#### Filtering Features:
- **Product Filters**
  - Category filter
  - Price range filter (min/max)
  - Rating filter (minimum rating)
  - Stock availability filter
  - Filter reset functionality
  - Active filter indicators

---

### 13. UI/UX FEATURES

#### Design Features:
- **Responsive Design**
  - Mobile-first approach
  - Tablet optimization
  - Desktop layouts
  - Responsive navigation

- **Modern UI Components**
  - Tailwind CSS styling
  - Gradient backgrounds
  - Card-based layouts
  - Smooth animations (Framer Motion)
  - Loading spinners
  - Toast notifications

- **Navigation**
  - Navbar with user menu
  - Breadcrumb navigation
  - Footer with links
  - Admin sidebar navigation

- **Components:**
  - Product cards
  - Rating display
  - Star rating input
  - Quantity selector
  - Search box
  - Pagination
  - Checkout steps indicator
  - Hero section
  - Banner component
  - Product carousel
  - Top rated products section
  - Recommended products section

---

### 14. ADDITIONAL FEATURES

#### Utility Features:
- **Image Upload**
  - Multiple image upload for products
  - Image storage (Laravel Storage)
  - Image deletion on product removal
  - Image display optimization

- **Pagination**
  - Product list pagination
  - Review pagination
  - Order history pagination
  - Page navigation

- **Error Handling**
  - Form validation
  - API error handling
  - User-friendly error messages
  - Error toast notifications

- **Loading States**
  - Loading spinners
  - Skeleton loaders
  - Loading indicators

- **Toast Notifications**
  - Success messages
  - Error messages
  - Info messages
  - Warning messages

---

## 🔧 TECHNICAL FEATURES

### Backend (Laravel):
- **API Endpoints:**
  - Authentication endpoints (login, register, logout, profile)
  - Product endpoints (CRUD, search, top products, recommendations)
  - Order endpoints (create, list, details, update status)
  - Review endpoints (create, list)
  - User management endpoints (CRUD)
  - Upload endpoints (image upload)

- **Services:**
  - SentimentAnalyzer service (AFINN-based sentiment analysis)
  - RecommendationService (TF-IDF + sentiment-based recommendations)

- **Middleware:**
  - Authentication middleware (Sanctum)
  - Admin middleware
  - CORS configuration

- **Database Models:**
  - User model
  - Product model
  - Order model
  - OrderItem model
  - Review model
  - StockAlert model

### Frontend (React):
- **State Management:**
  - Redux Toolkit
  - RTK Query for API calls
  - Cart slice (Redux)
  - Auth slice (Redux)
  - API slices (products, orders, users)

- **Routing:**
  - React Router v7
  - Protected routes
  - Admin routes
  - Dynamic routing

- **API Integration:**
  - Axios for HTTP requests
  - RTK Query for data fetching
  - Error handling
  - Loading states

---

## 📊 DATA MODELS

### User:
- id, name, email, number, password, isAdmin, created_at, updated_at

### Product:
- id, product_name, image (array), category, description, min_price, max_price, rating, num_reviews, count_in_stock

### Order:
- id, user_id, shipping_address (JSON), payment_method, items_price, shipping_price, tax_price, total_price, is_paid, paid_at, is_delivered, delivered_at

### OrderItem:
- id, order_id, product_id, name, qty, image, size, grind, roast, price

### Review:
- id, product_id, user_id, name, rating, comment, sentiment_score, keywords (array)

### StockAlert:
- id, product_id, email

---

## 🎨 PAGES & ROUTES

### Public Pages:
1. Home Page (`/`)
2. Shop Page (`/shop`)
3. Product Details (`/product/:id`)
4. Subscription Page (`/subscription`)
5. About Us (`/about-us`)
6. Contact Us (`/contact-us`)
7. Cart (`/cart`)
8. Login (`/login`)
9. Register (`/register`)

### Protected Pages (User):
1. Shipping (`/shipping`)
2. Payment (`/payment`)
3. Place Order (`/placeorder`)
4. Order Details (`/order/:id`)
5. Profile (`/profile`)
6. Payment Success (`/payment_success`)

### Admin Pages:
1. Admin Dashboard (`/admin/dashboard`)
2. Product List (`/admin/productlist`)
3. Add Product (`/admin/product/create`)
4. Update Product (`/admin/product/:id/edit`)
5. Order List (`/admin/orderlist`)
6. Subscription List (`/admin/subscriptionlist`)
7. User List (`/admin/userlist`)
8. Update User (`/admin/user/:id/edit`)

---

## 🔐 SECURITY FEATURES

- Laravel Sanctum authentication
- Password hashing (bcrypt)
- CSRF protection
- SQL injection prevention (Eloquent ORM)
- XSS protection
- Input validation
- Role-based access control
- Protected API routes
- Secure file uploads

---

## 📱 RESPONSIVE BREAKPOINTS

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🚀 DEPLOYMENT FEATURES

- Environment configuration
- Database migrations
- Seeders for initial data
- Error logging
- Production optimizations

---

This comprehensive list covers all major features and functions of the BrewBox e-commerce coffee shop application.

