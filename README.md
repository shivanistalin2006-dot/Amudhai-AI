# AMUDHAI (அமுதை) 🌾✨

## AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem

> *"Every Grain Matters. Every Meal Counts."*  
> **Mission:** **Predict Smart. Waste Less. Feed More.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_Vite_TS-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn_Pandas-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 📌 Project Overview & Vision

**AMUDHAI (அமுதை)** is an enterprise-grade AI food sustainability ecosystem built to eliminate institutional food waste and bridge food accessibility. It connects college mess halls, hotels, catering kitchens, food processing factories, NGOs, food banks, shelters, and cold-chain delivery fleets into an autonomous, synchronized network.

Built around four core principles:
1. **Prevent food waste before it happens** through machine learning demand forecasting.
2. **Redistribute safe surplus food before it spoils** through a real-time marketplace.
3. **Optimize food production, storage, and transportation** with FEFO inventory and IoT telemetry.
4. **Measure sustainability and ESG impact** using standard UNEP/FAO environmental conversion factors.

---

## 🏛️ Target Users & Role-Based Access

The platform features role-based access control with one-click demo role switching:

| Role | Organization Example | Key Capabilities |
| :--- | :--- | :--- |
| **Institution / Kitchen Admin** | *Loyola College Mega Mess*, *Hotel Annapoorna Grand* | Manage production, run AI demand forecasting, track FEFO inventory, publish surplus food, review ESG reports. |
| **NGO / Food Bank** | *Akshaya Food Bank*, *Annai Teresa Shelter*, *FeedNeedy* | Discover nearby surplus food, review safety & pickup deadlines, accept/reject donations, track meal arrivals. |
| **Delivery Partner** | *GreenExpress Eco-Van*, *SwiftEco Cargo Scooter* | View assigned dispatches, navigate GPS routes, update status (`Assigned` → `Picked Up` → `In Transit` → `Delivered`), record proof notes. |
| **Platform Administrator** | *Amudhai Ecosystem HQ* | Oversee institutions, verify NGOs, manage fleet, review ecosystem-wide telemetry. |

---

## 🚀 Key Modules & Architecture

### 1. Dashboard & Ecosystem Telemetry
- Dynamic KPI metrics calculated from real database records: meals prepared, meals consumed, food waste generated, food redistributed, meals delivered, CO2e emissions avoided, and financial savings.
- Interactive visualizations: Daily production vs. consumption, 7-day and 30-day waste trends against target benchmarks, waste breakdown by category (Cooked meals, vegetables, fruits, grains, dairy), and donation status distribution.
- Live synchronized ecosystem activity feed with date and institution filters.

### 2. AI Food Demand Forecasting (Pandas + Scikit-Learn)
- Multi-variable ML regressor trained on historical institutional dining patterns.
- Inputs: Expected attendance, meal period (Breakfast/Lunch/Dinner), day of the week, weather conditions, holidays/events, and safety buffer slider (0% to 15%).
- Outputs: Projected actual meal consumption, recommended preparation quantity, ingredient requirement breakdowns (Rice, Dal, Veggies, Cooking Oil, Spices in kg/L), and estimated waste prevented.
- Post-meal actuals recording form: Saves prepared, consumed, waste, and surplus figures directly to the database for model retraining.

### 3. Smart Food Inventory with FEFO (First-Expiry, First-Out)
- Normalized inventory registry with batch codes, suppliers, purchase dates, expiry dates, and storage units.
- Autonomous FEFO sorting ensures batches with earlier expiry dates are prioritized for daily kitchen preparation.
- Status classification: `Fresh`, `Near Expiry`, `Low Stock`, and `Expired`.
- Hard safety constraint: Expired stock is strictly blocked from donation.

### 4. Food Quality & IoT Cold-Chain Monitoring
- Simulated IoT sensor streams for Hot Holding Chambers (target ≥60°C) and Refrigerated Cold Storage (target 2°C - 5°C).
- Threshold alert system triggers when temperatures enter bacterial danger zones.
- Computer Vision surface and discoloration assessment demonstration.
- **Mandatory Safety Notice:** *"AI image assessment is indicative only. Food safety must be verified through appropriate food handling, storage, and inspection procedures."*

### 5. Surplus Food Management & NGO Redistribution Marketplace
- Institutional kitchens publish surplus food with meal portions, weight (kg), preparation timestamp, pickup deadline, storage conditions, allergens, and FSSAI safety confirmation.
- Interactive NGO marketplace with distance and expiration countdowns.
- Concurrency-safe acceptance workflow with database locks to prevent duplicate claims.
- Automated creation of dispatch assignments for delivery drivers upon donation acceptance.

### 6. NGO Network & AI Smart Matching Engine
- Directory of 5+ verified organizations across Chennai (*Akshaya Food Bank*, *Annai Teresa Shelter*, *FeedNeedy*, *Karunai Illam*, *Sneha Youth Pantry*).
- Multi-factor AI matching algorithm ranking NGOs by:
  - Proximity / Distance (35%)
  - Category Compatibility (25%)
  - Daily Capacity (20%)
  - Verification & Readiness (20%)
- Transparent match reasoning tags (e.g., `Nearby (2.4 km)`, `Accepts Cooked Meals`, `Capacity 500 meals/day`).

### 7. Smart Logistics & Delivery Fleet Tracking
- Live vector route telemetry showing donor kitchen, delivery vehicle, and recipient NGO.
- Complete four-stage delivery workflow: `Assigned` → `Picked Up` → `In Transit` → `Delivered`.
- Proof-of-delivery notes and handover timestamp logging.

### 8. Food Processing Unit & Conversion Yield Management
- Dedicated module for industrial food manufacturing lines and processing units (pulping, purees, dehydration).
- Conversion efficiency formula:  
  $$\text{Processing Efficiency (\%)} = \left(\frac{\text{Useful Output (kg)}}{\text{Total Input (kg)}}\right) \times 100$$
- Scrap/waste tracking, machine downtime logging, and energy consumption metrics (kWh).

### 9. Sustainability & ESG Analytics
- Standard environmental calculations:
  - **CO2e Avoided:** 2.5 kg $\text{CO}_2\text{e}$ per 1 kg food waste diverted (UNEP benchmark).
  - **Virtual Water Conserved:** 1,500 Liters per 1 kg grain and produce saved.
  - **Economic Value:** ₹120 average economic value per 1 kg meal.
  - **Waste Reduction Rate:** $\left(\frac{\text{Baseline} - \text{Current}}{\text{Baseline}}\right) \times 100$.
- One-click downloadable CSV export and printable sustainability report.

### 10. In-App Notification Center
- Event-driven notifications for surplus postings, donation acceptances, dispatch assignments, and expiry warnings.

---

## 💻 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts
- **Backend:** Python 3.12, FastAPI 0.115, Pydantic v2, SQLAlchemy ORM
- **Database:** SQLite (default zero-config persistent `amudhai.db`) / MySQL compatible via `DATABASE_URL`
- **Machine Learning & Analytics:** Scikit-Learn Regressor, Pandas, NumPy

---

## 🛠️ Quickstart & Installation

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Install Python dependencies
pip install fastapi uvicorn sqlalchemy pydantic pandas scikit-learn python-multipart

# Start the FastAPI server (runs on http://127.0.0.1:8000)
python -m uvicorn backend.main:app --port 8000 --host 127.0.0.1
```
*Note: The SQLite database `amudhai.db` is initialized and pre-seeded automatically with realistic institutional records on first startup.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run build     # Compiles production bundle served by FastAPI
# Or for interactive HMR dev server:
npm run dev       # Runs on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

You can use the in-app **Quick Switch Demo Role** dropdown in the top navbar, or log in with:

| Role | Username | Password | Organization |
| :--- | :--- | :--- | :--- |
| **Institution Admin** | `kitchen_admin` | `admin123` | Loyola College Mega Mess |
| **Hotel / Kitchen Admin** | `hotel_admin` | `hotel123` | Hotel Annapoorna Grand |
| **NGO / Food Bank** | `ngo_user` | `ngo123` | Akshaya Food Bank Chennai |
| **Delivery Driver** | `delivery_driver` | `driver123` | GreenExpress Eco-Van 01 |
| **Platform Admin** | `platform_admin` | `super123` | Amudhai Ecosystem HQ |

---

## 🧪 End-to-End Verification Test Suite

A comprehensive test suite is included at `backend/test_api_and_dom.py`. Run it at any time:

```bash
python backend/test_api_and_dom.py
```

### Verified Test Results:
```text
Running AMUDHAI Ecosystem End-to-End Verification Test Suite...

  [PASS] GET /api/health
  [PASS] GET /api/dashboard/summary KPIs & Recharts Data
  [PASS] POST /api/forecasts/predict (Scikit-Learn ML Model)
  [PASS] GET /api/inventory with FEFO Expiry Sorting
  [PASS] GET /api/quality/readings with Mandatory Safety Disclaimer
  [PASS] GET /api/surplus Listings
  [PASS] GET /api/ngos and AI Proximity Matching Algorithm
  [PASS] Donation Claim Concurrency Lock & Delivery Status Flow
  [PASS] POST /api/processing/batches Efficiency Formula Check
  [PASS] GET /api/sustainability/report & CSV Export
  [PASS] GET / Frontend SPA Mount & Bundle

[SUCCESS] All 11 End-to-End Workflow Tests Passed Successfully!
```

---

## 🌟 10-Step Demonstration Scenario

1. **Step 1:** Kitchen admin logs in and reviews real-time dashboard KPIs.
2. **Step 2:** Admin selects tomorrow's lunch and inputs expected attendance (850 persons).
3. **Step 3:** Scikit-learn AI regressor computes meal demand (812 meals) and recommends preparing 852 meals (with 5% safety buffer), calculating exact ingredient allocations.
4. **Step 4:** After lunch service, admin records actual consumption (850 prepared, 815 consumed, 22 kg surplus) to retrain the forecasting model.
5. **Step 5:** Admin publishes 22 kg safe surplus Vegetable Biryani with a 3.5-hour pickup deadline.
6. **Step 6:** Akshaya Food Bank logs in, views the AI-matched listing, and accepts the donation.
7. **Step 7:** Backend automatically generates delivery assignment `#DEL-101` and dispatches GreenExpress Eco-Van.
8. **Step 8:** Driver confirms pickup, transitions to `In Transit`, and verifies handover at the shelter (`Delivered`).
9. **Step 9:** Dashboard telemetry updates automatically: meals fed, waste diverted, emissions avoided, and financial savings.
10. **Step 10:** Admin downloads the complete ESG Sustainability Audit Report in CSV format.

---

## 📄 License & Credits

Built with ❤️ by **Shivani Stalin** for **AMUDHAI (அமுதை)**.  
Repository: [https://github.com/shivanistalin2006-dot/Amudhai-AI](https://github.com/shivanistalin2006-dot/Amudhai-AI)
