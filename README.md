# Rio Banking — Enterprise Prototype

A presentation-ready, cleanly coded banking application built for executive demonstrations and peer reviews.

## Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 14 Frontend (:3000)                 │
│         Tailwind CSS • Minimalist Rio UI • INR (₹)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ JWT / REST
┌──────────────────────────────▼──────────────────────────────┐
│                Node.js Express Backend (:5000)              │
│       Role-Based Route Guards • In-Memory Reactive Store    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Microservice Calls
┌──────────────────────────────▼──────────────────────────────┐
│            Python Data & Risk Microservice (:8000)          │
│        Zero-dependency Native Server • INR Risk Engine      │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide icons, `en-IN` Rupee formatters.
- **Backend API**: Node.js, Express, Helmet CSP, CORS, JWT authentication, OWASP baseline.
- **Data Microservice**: Python 3 standard library `ThreadingHTTPServer` (zero external dependencies needed).

---

## 3 Live RBAC Roles & Credentials

Switch personas at any time using the **Demo Switcher** at the top right of the navigation bar, or select on the home portal:

1. **Manager Portal (`/manager`)**
   - **Persona**: Rajesh Sharma (Vice President & Branch Manager)
   - **Features**: Nariman Point branch AUM (₹842.50 Cr), live turnover metrics, channel breakdown, and an interactive **Dual-Control Approvals Queue** with working Approve/Reject actions.
2. **Employee Operations (`/employee`)**
   - **Persona**: Priya Nair (Senior Operations Officer)
   - **Features**: Customer 360 lookup (search by name, A/C, or PAN), RBI KYC status toggles, and a **Branch Counter Simulator** for instant cash deposit/withdrawal vouchers.
3. **Customer NetBanking (`/customer`)**
   - **Persona**: Aarav Patel (Premier Wealth Client)
   - **Features**: Savings balance (₹8,45,250.00), Fixed Deposit portfolio (₹15,00,000.00 @ 7.25%), instant IMPS/NEFT fund transfer with autonomous Python risk scoring, and a real-time digital passbook.

---

## Quick Start (Run Locally)

### Option A: 1-Click Windows Launcher
Double-click:
```cmd
run-demo.bat
```
This automatically launches the Python microservice, Node backend, Next.js frontend, and opens `http://localhost:3000` in your browser.

### Option B: Manual Terminal Execution

#### 1. Python Microservice (:8000)
```bash
cd data-service
python app/main.py
```

#### 2. Node.js Backend (:5000)
```bash
cd backend
node src/server.js
```

#### 3. Next.js Frontend (:3000)
```bash
cd frontend
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to begin the demonstration.

