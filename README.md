# 🍔 TastyBite - Full-Stack Food Ordering Platform

TastyBite is a premium, modern, and fully responsive full-stack food ordering application. It features a decoupled client-server architecture powered by a high-performance **Django REST Framework (DRF)** backend API and a visually stunning **Vanilla HTML/CSS/Bootstrap/JS** frontend client.

Perfect for both standard food enthusiasts looking to order their favorite cuisines and business administrators managing menus, orders, and sales performance.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technologies Used](#-technologies-used)
4. [Project Structure](#-project-structure)
5. [Installation & Setup](#-installation--setup)
    - [Backend Configuration](#1-backend-setup-django-drf)
    - [Frontend Configuration](#2-frontend-setup-htmlcssjs)
6. [API Directory Overview](#-api-directory-overview)
7. [Admin Dashboard Highlights](#-admin-dashboard-highlights)
8. [Screenshots](#-screenshots)
9. [Future Roadmap](#-future-roadmap)
10. [Author & Portfolio](#-author--portfolio)

---

## 🌟 Project Overview

TastyBite delivers a seamless, interactive food e-commerce experience. The frontend client features state-of-the-art visual enhancements, glassmorphic layout elements, dynamic rating stars, interactive Swiffy Sliders, and smooth animations. The backend service provides secure user registration with automated activation emails, robust Token-based authentication, a writable nested customer profile system, database-driven signals for automated pricing computations, and restricted administrative dashboard viewsets.

---

## ⚡ Key Features

### 👤 Customer Features
- **Account Verification**: Secure sign-up triggering automatic verification emails with unique activation hashes.
- **Dynamic Catalog**: Categorized food item lists with instant search filters and discounts.
- **Interactive Ratings & Count**: Renders golden star rating badges and calculated quantities dynamically based on user reviews.
- **Favorites Hub**: Save and bookmark preferred dishes.
- **Snappy Quantity Control**: Real-time checkout quantity adjustments with responsive subtotal updates.
- **Review Guard**: Enforces that only users with **completed purchases** can submit reviews.
- **Order History Tracks**: Instantly check order history and real-time status transitions.
- **Aggregated Notifications**: Interactive navbar alert tray populated dynamically.

### 🛡️ Admin Dashboard Features
- **Overview Stat Cards**: Dynamic revenue calculations, active orders count, food counts, and customer base metrics.
- **Chart.js Visualizations**: Premium graphical representations of Sales Categories and Revenue Over Time.
- **Full Foods CRUD Modal**: Admin-only access to add, edit, and delete food items with category mapping.
- **Order Status Manager**: Live order history tables with active choice dropdowns (`Pending`, `Processing`, `Completed`, `Cancelled`).
- **Registered Customers Grid**: Direct access to user database lists and details.

---

## 🛠️ Technologies Used

### Backend (REST API Engine)
- **Core**: Python 3.x, Django Web Framework
- **API Architecture**: Django REST Framework (DRF)
- **Database**: SQLite3 (Local Development)
- **Authentication**: DRF Token-Based Security
- **Email Dispatch**: Django SMTP MultiAlternatives (Gmail Backend)

### Frontend (Client Interface)
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 Custom Variables, CSS Grid/Flexbox
- **Frameworks**: Bootstrap 5 (Responsive utilities)
- **Interactions**: Vanilla Modern ES6 Javascript
- **Visuals**: FontAwesome 4.7 Icons, Swiffy Slider
- **Charts**: Chart.js 4.x (Dynamic visualizations)

---

## 📂 Project Structure

```
TastyBites/
│
├── TastyBite (Back-end)/        # Django REST Backend
│   ├── TastyBite/                # Settings, core routers, WSGI/ASGI
│   ├── customer/                 # Profiles, verification, auth endpoints, reviews
│   ├── food/                     # Catalogue, category models, views, serializers
│   ├── carts/                    # Shopping carts, items, price-signals
│   ├── order/                    # Deprecated legacy apps folder
│   ├── db.sqlite3                # Local SQLite Database
│   ├── manage.py                 # Django command-line execution entry
│   └── requirements.txt          # Python packages list
│
└── TastyBite (Front-end)/       # Client-Side Frontend
    ├── index.html                # App root/landing page
    ├── food.html                 # Food catalogue explorer
    ├── Food_details.html         # Item details and reviews
    ├── place_order.html          # Dynamic cart checkout sheet
    ├── favorite_foods.html       # Bookmarked favorite foods
    ├── order_history.html        # Customer orders history
    ├── profile.html              # Customer profile card
    ├── edit_profile.html         # Writable nested customer profile form
    ├── admin_dashboard.html      # Administrative panel
    ├── app.js                    # Core app script & routing guards
    ├── style.css                 # Premium custom stylesheets and design tokens
    └── [feature].js              # Feature-specific JavaScript engines
```

---

## 🚀 Installation & Setup

Ensure you have **Python 3.x** and **Git** installed on your system.

### 1. Backend Setup (Django DRF)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/TastyBite.git
   cd TastyBite/TastyBite (Back-end)
   ```

2. **Create and Activate a Virtual Environment**:
   - **Windows**:
     ```bash
     python -m venv .venv
     .venv\Scripts\activate
     ```
   - **Unix/MacOS**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Environment Variables**:
   Create a `.env` file in the root backend directory to host your secure credentials:
   ```env
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-specific-password
   ```

5. **Run Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a Superuser (Admin account)**:
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Backend Server**:
   ```bash
   python manage.py runserver
   ```
   The backend API will now run at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup (HTML/CSS/JS)

1. **Navigate to the frontend folder**:
   ```bash
   cd ../TastyBite (Front-end)
   ```

2. **Serve the project**:
   TastyBite is completely server-independent on the client side. You can run it by:
   - Double-clicking `index.html` to open it in your browser.
   - Or, opening the directory inside **VS Code** and clicking **"Go Live"** via the **Live Server** extension to serve it at:
     `http://127.0.0.1:5500/` (Recommended to prevent local CORS issues).

---

## 📡 API Directory Overview

Below are the primary endpoints exposed by the DRF API:

| Category | Endpoint | Method | Authentication | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/customer/register/` | `POST` | None | New user registration |
| **Auth** | `/customer/login/` | `POST` | None | User validation; returns token |
| **Profile** | `/customer/list/?user_id=<id>`| `GET` | Token | Fetches customer credentials |
| **Profile** | `/customer/list/<id>/` | `PATCH`| Token | Edits nested User & Customer fields |
| **Catalog**| `/fooditem/items/` | `GET` | None | Lists menu; supports filtering |
| **Catalog**| `/fooditem/items/` | `POST` | Token + Admin| Adds new dishes |
| **Cart** | `/carts/cart/?user_id=<id>` | `GET` | Token | Fetches user's active/placed carts |
| **Cart** | `/carts/cart/<id>/` | `PATCH`| Token | Order submission (`ordered = true`) |
| **Items** | `/carts/cartitems/` | `POST` | Token | Adds/increments item quantity |
| **Items** | `/carts/cartitems/<id>/` | `PATCH`| Token | Modifies individual item quantities |
| **Reviews**| `/customer/reviews/` | `POST` | Token | Submits reviews (orders verified) |

---

## 🛡️ Admin Dashboard Highlights

TastyBite embeds an advanced administrative panel that dynamically adapts using Chart.js analytics:
- **Visual Analytics**: Dynamic Line charts tracing daily income aggregates and Bar charts displaying category order frequencies.
- **Direct Catalog Alterations**: In-place edit forms, and real-time category updates.
- **Interactive Order Pipelines**: Admins can change order states via custom dropdown items, triggering instant changes in the client's `order_history.html` view.

---

## 📸 Screenshots

> [!NOTE]
> Below are placeholders. Replace them with links to your own screenshots once deployed to your portfolio.

### 🏠 Customer Food Catalog View
![Food Catalog](https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop)
*Beautifully categorized dish catalogue with dynamic rating stars and discount tags.*

### 🛡️ Premium Admin Analytical Panel
![Admin Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)
*Chart.js analytics, active order management rows, and Food CRUD management panels.*

---

## 🔮 Future Roadmap
- [ ] **Stripe/SSLCommerz Integration**: Secure end-to-end online payments checkout.
- [ ] **Real-time Order Status Updates**: Live WebSockets notifications using Django Channels.
- [ ] **Multi-Merchant Registration**: Transform into a fully multi-vendor food marketplace.

---

## 👨‍💻 Author & Portfolio

Developed by **Md Asraful Hasan**

- **GitHub**: https://github.com/MDAsrafulhasan
- **Email**: [EMAIL_ADDRESS]

