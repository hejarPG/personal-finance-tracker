# Personal Finance Tracker

A modern personal finance tracking application built with Django and React for efficient financial management.

## 🤖 About the Development

This project is unique because it was developed **entirely through collaboration with AI**:

- Built using [Cursor](https://cursor.sh/) - an AI-first code editor
- All code was written, debugged, and optimized with the assistance of LLMs
- Zero manual coding - all implementation decisions and solutions were AI-driven

## 🚀 Features

- Secure user authentication with JWT
- Track income and expenses
- Categorize transactions with custom categories and colors
- Visualize spending patterns with interactive charts
- Export transactions to CSV or Excel formats
- Responsive design for all devices

## 💻 Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- Chart visualization using MUI X-Charts
- Lucide React for icons

### Backend
- Django REST Framework
- SQLite database (easily configurable to PostgreSQL, MySQL)
- JWT authentication
- Django ORM for data modeling

## 🏁 Getting Started

### Prerequisites
- Python 3.8+ for backend
- Node.js (v14.x or higher) for frontend
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
```

2. Set up and start the backend server
```bash
cd backend
# Create a virtual environment (recommended)
python -m venv venv
# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create a superuser for admin access
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

3. Set up and start the frontend
```bash
cd frontend
npm install
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 📝 Project Structure

```
personal-finance-tracker/
├── backend/                # Django backend
│   ├── transactions/       # Main app for financial data
│   │   ├── models.py       # Data models (Transaction, Category)
│   │   ├── serializers.py  # API serializers
│   │   ├── views.py        # API views and endpoints
│   │   └── urls.py         # URL routing
│   └── users/              # User authentication app
├── frontend/               # React application
│   ├── public/             # Static files
│   └── src/                # React components and logic
│       ├── components/     # UI components
│       ├── context/        # React context providers
│       └── api/            # API service layer
└── README.md               # Project documentation
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/personal-finance-tracker/issues).

## 📸 Screenshots

### Login Screen
![Login Screen](assets/images/login-screen.png)

### Dashboard
![Dashboard Overview](assets/images/dashboard-overview.png)

### Transaction Management
![Adding Transactions](assets/images/add-transaction.png)
![Transaction History](assets/images/transaction-list.png)

### Category Management
![Category Management](assets/images/category-management.png)

### Analytics
![Financial Analytics](assets/images/charts-analytics.png)

## 🔮 Future Enhancements

- Mobile applications
- Recurring transaction management
- Financial goal tracking
- Budget planning
- Investment portfolio tracking

---

**Note:** This entire application, including this README, was created with the assistance of AI through Cursor IDE. No manual coding was performed, demonstrating the power of AI-assisted development. 