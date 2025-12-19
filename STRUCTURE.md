# Food Ordering System - Project Structure

```
Food_Ordering_System/
│
├── backend/                          # Python/Pyramid Backend Application
│   ├── alembic.ini                  # Alembic configuration for database migrations
│   ├── development.ini              # Development environment configuration
│   ├── requirements.txt             # Python dependencies
│   ├── setup.py                     # Package setup configuration
│   ├── wsgi.py                      # WSGI application entry point
│   │
│   ├── alembic/                     # Database migration management
│   │   ├── env.py                   # Alembic environment configuration
│   │   ├── README                   # Alembic documentation
│   │   ├── script.py.mako           # Migration script template
│   │   └── versions/                # Database migration versions
│   │       ├── 22032e4f93dc_tambah_tabel_review.py
│   │       ├── 5dce65c1eb74_tambah_tabel_review.py
│   │       ├── ab3588ff20ff_add_payment_fields_to_orders.py
│   │       └── c01dc02dba80_add_payment_columns_to_orders.py
│   │
│   └── app/                         # Application package
│       ├── __init__.py              # App initialization
│       ├── database.py              # Database connection and configuration
│       ├── jwt.py                   # JWT authentication utilities
│       ├── routes.py                # Route definitions
│       ├── security.py              # Security utilities
│       │
│       ├── models/                  # Database models (SQLAlchemy ORM)
│       │   ├── __init__.py          # Models package init
│       │   ├── user.py              # User model
│       │   ├── menu.py              # Menu/Food items model
│       │   ├── order.py             # Orders model
│       │   ├── order_item.py        # Order items model
│       │   ├── review.py            # Reviews model
│       │   └── __pycache__/         # Python cache directory
│       │
│       ├── views/                   # API views/endpoints (request handlers)
│       │   ├── auth.py              # Authentication endpoints
│       │   ├── menu.py              # Menu management endpoints
│       │   ├── orders.py            # Order management endpoints
│       │   ├── reviews.py           # Reviews endpoints
│       │   └── __pycache__/         # Python cache directory
│       │
│       └── __pycache__/             # Python cache directory
│
├── frontend/                         # React Frontend Application
│   ├── package.json                 # NPM dependencies and scripts
│   ├── README.md                    # Frontend documentation
│   │
│   ├── public/                      # Static public files
│   │   ├── index.html               # Main HTML file
│   │   ├── manifest.json            # PWA manifest
│   │   └── robots.txt               # SEO robots file
│   │
│   └── src/                         # React source code
│       ├── App.js                   # Main App component
│       ├── App.css                  # Global app styles
│       ├── index.js                 # React entry point
│       ├── index.css                # Global styles
│       │
│       ├── Assets/                  # Images and static assets
│       │
│       ├── components/              # Reusable React components
│       │   ├── AuthModal.jsx        # Authentication modal
│       │   ├── CartModal.jsx        # Shopping cart modal
│       │   ├── Header.jsx           # Header component
│       │   ├── MenuCard.jsx         # Menu item card display
│       │   ├── MenuReviewsModal.jsx # Reviews display modal
│       │   ├── OrderCard.jsx        # Order card component
│       │   ├── PaymentModal.jsx     # Payment processing modal
│       │   ├── PaymentProofModal.jsx # Payment proof upload modal
│       │   ├── ReviewCard.jsx       # Review display card
│       │   ├── ReviewModal.jsx      # Review creation modal
│       │   └── StarRating.jsx       # Star rating component
│       │
│       ├── pages/                   # Page-level components
│       │   ├── MenuPage.jsx         # Menu browsing page
│       │   ├── OrdersPage.jsx       # Orders management page
│       │   └── ManageMenuPage.jsx   # Menu management page (admin)
│       │
│       └── services/                # API and external services
│           └── api.js               # Axios API client configuration
│
└── README.old.md                    # Old documentation (archived)
```

## Architecture Overview

### Backend (Python/Pyramid)
- **Framework**: Pyramid web framework
- **Database**: SQLAlchemy ORM with Alembic migrations
- **Authentication**: JWT-based
- **Structure**: MVC pattern with models, views, and routes

### Frontend (React)
- **Framework**: React.js
- **Components**: Modular component-based architecture
- **Services**: Centralized API communication layer
- **Pages**: Main pages for different features

## Key Features

### User Management
- Authentication (Auth model & auth views)
- User profiles and permissions

### Menu Management
- Menu items (Menu model)
- Menu display and filtering
- Admin menu management capabilities

### Orders System
- Order creation and tracking (Order, OrderItem models)
- Payment processing (PaymentModal)
- Payment proof upload

### Reviews System
- Product/restaurant reviews (Review model)
- Star ratings
- Review display and management

### Database Migrations
- Version controlled schema changes
- Payment fields and order columns additions
- Review table management
