# PolicyPro - Insurance Policy Holder Management Platform



---

## About The Project

PolicyPro is a web-based policy holder management system built for life insurance agents and branch managers. The goal of this project is to provide a clean, centralized workspace to manage client records, issue policies, collect renewal premiums, and process claims without needing complicated backend setups or databases.

Everything runs entirely in the browser using HTML5, CSS3, and vanilla JavaScript. Data is stored directly in browser `localStorage`, which means all changes, new client registrations, payments, and claim updates persist across page reloads.

---

## Key Modules & Features

### 1. Dashboard & Analytics
- Overview of total registered policy holders, active policies, total premiums collected, and overdue renewals.
- Interactive charts powered by Chart.js showing monthly premium collections and policy distribution across plans.
- Quick summary tables for recent policy holders and urgent renewal due dates.

### 2. Policy Holder Registration (KYC)
- Complete onboarding form capturing personal details (Name, Contact, DOB, Gender, Address, City, State, Pincode).
- Financial profile fields (Occupation, Annual Income, PAN card reference).
- Nominee details (Nominee Name, Relationship, and Phone).

### 3. Policy Issuance & Auto-Calculator
- Issue new policies for registered holders across 6 plan categories:
  - Endowment Plan (e.g., LIC Jeevan Labh)
  - Term Insurance (e.g., LIC Tech Term)
  - Health Insurance (e.g., LIC Arogya Rakshak)
  - Money Back Plan
  - Child Plan (e.g., LIC Amritbaal)
  - Pension Plan (e.g., LIC Saral Pension)
- Built-in premium calculator that automatically calculates periodic premium based on sum assured, term, and payment frequency (Yearly, Half-Yearly, Quarterly, Monthly, Single Premium).
- Generates an official, printable Digital Policy Bond certificate with policy details and underwriter signatures.

### 4. Policy Holders Directory
- Search bar that filters in real-time by name, phone, email, PAN, or city.
- Filters by policy type and active/due status.
- Switch between a compact Table view and an interactive Card Grid view.
- Direct links to view complete profile or issue a new policy.

### 5. Detailed Client Dossier
- 360-degree profile view for each holder.
- Displays all linked insurance policies, complete premium payment history, filed claims, and sent messages in one organized screen.

### 6. Premium Collection & Receipts
- Record incoming premium payments with support for UPI, Net Banking, Debit/Credit Card, Cash, and Cheque.
- Automatically calculates the next renewal date and updates policy status.
- Generates a verified, printable payment receipt eligible for tax deductions under Section 80C.

### 7. Renewal Management & Grace Periods
- Tracks upcoming, due, and overdue policy renewals.
- Automatically computes the standard 30-day grace period.
- 1-click button to send simulated SMS/WhatsApp reminder alerts to individual clients or broadcast reminders to all overdue policies at once.

### 8. Claim Processing Workflow
- Register new claims for hospitalization reimbursement, critical illness, survival benefits, maturity settlements, or death claims.
- Simulated document proof upload and incident notes.
- Review workflow allowing managers to update status: *Submitted → Under Investigation → Approved → Settled / Rejected*.

### 9. Client Communications (Simulated)
- Send custom or template-based notifications via SMS, WhatsApp, or Email.
- Includes pre-written templates for welcome notices, upcoming premium reminders, overdue grace warnings, and claim status updates.
- Full searchable log of all sent messages.

### 10. Reports & Data Export
- Financial summary showing Total Sum Assured in Force, Annualized Premium, and Claim Settlement Ratio.
- 1-click export to CSV for:
  - Policy Holders list (`.csv`)
  - All Policies list (`.csv`)
  - Premium Payment Collections (`.csv`)
- Printable official summary view formatted for physical printing or saving as PDF.

---

## Extra Features Included

- **Dark Mode / Light Mode:** Quick theme toggle in the top bar with saved user preference.
- **Role Switcher:** Switch between Branch Admin, Claims Manager, and LIC Agent to simulate different user views.
- **Notifications Bell:** Live dropdown highlighting overdue premiums and newly filed claims.
- **Print Optimization:** Clean `@media print` styling that hides navigation sidebars and headers when printing receipts and policy bonds.
- **Reset Demo Data:** Includes realistic pre-loaded Indian insurance data (sample clients, policies, claims) and a 1-click button to reset back to initial demo data anytime.

---

## Technologies Used

- **HTML5:** Semantic page structure and modals
- **CSS3:** Custom styles, CSS variables, responsive layout, dark theme, and print styles
- **JavaScript (ES6):** State management, DOM manipulation, dynamic filtering, and calculations
- **Storage:** Browser `localStorage` (No database required)
- **Chart.js:** Visual data charts on dashboard and reports
- **Font Awesome:** Icons throughout the interface
- **Google Fonts:** Poppins and Inter typography

---

## How to Run Locally

You do not need to install any heavy packages, databases, or dependencies.

1. **Direct Launch:**
   Double-click `index.html` or right-click and open it with any web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).

2. **Using a Local Server (Optional):**
   If you have Python installed, open your terminal in this folder and run:
   ```bash
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

---

