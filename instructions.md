# Personal Finance Tracker Web App

## Project Overview

The **Personal Finance Tracker Web App** is designed to help users efficiently manage their income, expenses, and savings goals. Featuring a clean and minimalistic UI/UX, the platform offers an intuitive experience for tracking finances. 

The **frontend** is built with **React** and **Tailwind CSS**, while the **backend** leverages **Django** for robust data handling and logic.

---

## Key Flow

### 1. Login
- **Secure Authentication**: Users log in using Django itself.
- **Access**: Upon successful authentication, users are directed to the main workspace.

### 2. Cash Flow and Transactions
- **Add Income**: Users can add income transactions, which increase the current balance.  
- **Add Expense**: Users can log expenses, reducing the balance. Negative balances are permitted.  
- **Transaction Categories**:  
  - Pre-defined categories are available.  
  - Users can create, delete, or rename custom categories.

### 3. Export Transactions
- Users can export their transaction history in `.csv` or `.xlsx` formats for external analysis or record-keeping.

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons  
- **Authentication**: Django with JWT Authentication.
- **Backend**: Django with its own ORM

---

## Core Functionality

### 1. Login and User Authentication

#### 1.1 Login Implementation
- **Login Process**: Handled via Django and JWT Authentication for secure user authentication.  
- **Login Page**: Displayed to unauthenticated users.  
- **Currency Selection**: After authentication, users choose their currency, which is saved for future use.  
- **Post-Login**: Authenticated users are redirected to the main workspace.

#### Error Handling:
- Display user-friendly error messages if authentication fails.

---

### 2. Workspace

#### 2.1 Add Transaction

A dedicated section at the top-left of the workspace for adding income or expense transactions.

- **Implementation**:  
  - **UI**: Create a card section in the main workspace for transaction entry.  
  - **Data Storage**: Transactions are stored using Django ORM.  
  - **Database Table**: `transactions`  
    | Field        | Type         | Description                                           |
    |--------------|--------------|-------------------------------------------------------|
    | `id`         | INT (PK)     | Unique transaction ID                               |
    | `title`      | VARCHAR      | Transaction title                                  |
    | `description`| TEXT         | Optional description                               |
    | `user`       | INT (FK)     | Reference to the user                              |
    | `category`   | INT (FK)     | Reference to the transaction category             |
    | `amount`     | DECIMAL      | Positive for income, negative for expense           |
    | `created_at` | TIMESTAMP    | Timestamp (user can specify, defaults to now)      |

#### 2.2 Transaction Categories

Users can assign categories to transactions or use the default "undefined" category.

- **Implementation**:  
  - **Data Storage**: Categories stored using Django ORM.  
  - **Database Table**: `categories`  
    | Field     | Type         | Description                             |
    |-----------|--------------|-----------------------------------------|
    | `id`      | INT (PK)     | Unique category ID                      |
    | `name`    | VARCHAR      | Category name                           |
    | `color`   | VARCHAR      | Category color (e.g., hex code)         |
    | `user`    | INT (FK)     | Reference to the user                   |

#### 2.3 Transaction History

Displays a list of past transactions in the workspace.

- **Implementation**:  
  - **UI**: Card section showing transaction history in the main workspace.  
  - **Displayed Information**:  
    - Title  
    - Description thumbnail (if available)  
    - Category  
    - Amount (red for expenses, green for income)  
    - Date (sorted descending by default)  
  - **Search Functionality**: Users can filter by title, date, category, or amount. The search bar is placed at the top.

#### 2.4 Current Balance

A card at the top of the workspace displays the current balance in real-time.

#### 2.5 Charts

Visual representation of financial data to enhance user insights.

- **Pie Chart**:  
  - Displays current month’s expenses by category.  
  - Only expenses are shown.

- **Line Chart**:  
  - Shows balance changes over the current month.

- **Implementation**:  
  - **Library**: Use **MUI X Charts** for charting.  
  - **Data Source**: Fetch transaction data from the `transactions` table.

---

## Database Structure

### Transactions Table (`transactions`)
| Field        | Type         | Description                                           |
|--------------|--------------|-------------------------------------------------------|
| `id`         | INT (PK)     | Unique transaction ID                               |
| `title`      | VARCHAR      | Transaction title                                  |
| `description`| TEXT         | Optional transaction details                       |
| `user`       | INT (FK)     | Reference to the user                              |
| `category`   | INT (FK)     | Reference to the transaction category             |
| `amount`     | DECIMAL      | Positive for income, negative for expense           |
| `created_at` | TIMESTAMP    | Date and time of transaction (defaults to now)      |

---

### Categories Table (`categories`)
| Field     | Type         | Description                             |
|-----------|--------------|-----------------------------------------|
| `id`      | INT (PK)     | Unique category ID                      |
| `name`    | VARCHAR      | Category name                           |
| `color`   | VARCHAR      | Category color (e.g., hex code)         |
| `user`    | INT (FK)     | Reference to the user                   |

---

## Summary

The **Personal Finance Tracker Web App** offers a streamlined and secure way for users to manage their finances. With its clean UI, secure authentication via django and JWT Authentication, robust data handling with Django, and insightful charts, users can efficiently track income, expenses, and savings goals. The app provides flexibility through custom categories, transaction history, and export features, empowering users to make informed financial decisions.


## File Structure
### Current Backend File Structure
```
.
|-- manage.py
`-- pft_backend
    |-- __init__.py
    |-- asgi.py
    |-- settings.py
    |-- urls.py
    `-- wsgi.py
```
### Expected Backend File Structure
```
.
├── pft_backend/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── transactions/
    ├── models.py           # Transaction + Category models
    ├── serializers.py      # Transaction + Category serializers
    ├── views.py            # Combined API views
    ├── urls.py             # All API endpoints
    └── admin.py
```

### Current Frontend File Structure
```
.
|-- README.md
|-- package-lock.json
|-- package.json
|-- public
|   |               `-- favicon.ico
|   |               `-- index.html
|   |               `-- logo192.png
|   |               `-- logo512.png
|   |               `-- manifest.json
|                   `-- robots.txt
`-- src
    |               `-- App.css
    |               `-- App.js
    |               `-- App.test.js
    |               `-- index.css
    |               `-- index.js
    |               `-- logo.svg
    |               `-- reportWebVitals.js
                    `-- setupTests.js
```

### Expected Frontend File Structure
```
.
├── App.js                  # main router
├── Dashboard.js            # Main workspace component
├── api/
│   └── api.js              # All API calls (transactions/categories)
├── components/
│   ├── Transactions.js     # AddTransaction + TransactionList/Item
│   ├── BalanceChart.js     # Balance + both charts
│   └── CategoryManager.js  # Category CRUD operations
├── context/
│   └── FinanceContext.js   # Combined state management
└── utils/
    └── export.js           # CSV/XLSX export logic
```