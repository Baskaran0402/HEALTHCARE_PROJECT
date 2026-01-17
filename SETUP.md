# 🛠️ Setup & Execution Guide

Follow these steps to set up and run the AI Doctor Healthcare Project.

## 📋 Prerequisites

- **Python 3.10 or higher**
- **Node.js & npm** (for the frontend)
- **PostgreSQL** (for the database)
- **Groq API Key** (for the LLM Doctor Agent)
  - Get one here: [https://console.groq.com/keys](https://console.groq.com/keys)

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <repository_url>
cd HEALTHCARE_PROJECT
```

### 2. Backend Setup

1.  **Create Virtual Environment**:

    ```bash
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    # source venv/bin/activate  # Mac/Linux
    ```

2.  **Install Python Dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure Environment**:

    - Create `.env` in the root directory:

    ```env
    GROQ_API_KEY=your_api_key
    DATABASE_URL=postgresql://user:password@localhost/healthcare_db
    ```

4.  **Initialize Database**:
    ```bash
    python -m backend.init_db
    ```

### 3. Frontend Setup

1.  **Navigate to frontend directory**:

    ```bash
    cd frontend
    ```

2.  **Install Node Dependencies**:
    ```bash
    npm install
    ```

## 🚀 How to Run

### 1. Start Backend Server (Terminal 1)

**Important**: Run this from the project root (`HEALTHCARE_PROJECT`), NOT inside `backend/`.

```bash
# Ensure venv is active
python -m backend.main
```

_Expected: Server running at `http://localhost:8000`_

### 2. Start Frontend Application (Terminal 2)

**Important**: Run this from the `frontend/` directory.

```bash
cd frontend
npm run dev
```

_Expected: App running at `http://localhost:5173`_

## 🧪 Testing

To verify the system is working:

```bash
# From project root
python test_system.py
```

## ❓ Troubleshooting

- **ModuleNotFoundError: No module named 'fastapi'**:

  - Ensure you activated your `venv` and ran `pip install -r requirements.txt`.

- **npm error: no such file or directory 'package.json'**:

  - Ensure you are inside the `frontend` directory (`cd frontend`) before running npm commands.

- **Database Connection Errors**:
  - Verify PostgreSQL is running and your `DATABASE_URL` in `.env` is correct.
