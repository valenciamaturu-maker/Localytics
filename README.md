# Localytics

**Localytics** is a mobile-first, offline-first business intelligence tool built for small businesses selling on social platforms (TikTok, Instagram, Facebook, WhatsApp) in Kenya. It turns messy social sales data into clear, actionable insights — fast.

> Tagline: *Turn your social sales into clear insights.*

---

## ✨ Features

- 📤 **Upload** CSV / Excel sales files
- 📋 **Paste** raw CSV data (for users who can't download files)
- ✍️ **Manual entry** of individual sales records
- ✅ **Non-blocking data quality check** (missing, duplicate, invalid values)
- 📊 **Insights dashboard** with totals, top products, platform breakdown, and trends
- 📴 **Offline-first** — all data stored locally in the browser (`localStorage`)
- 📱 **Mobile-first** UI with large buttons and minimal text

---

## 🧭 Application Flow

```
        ┌──────────────┐
        │     Home     │
        │  (entry pt)  │
        └──────┬───────┘
               │
     ┌─────────┴─────────┐
     ▼                   ▼
┌──────────┐       ┌──────────┐
│  Upload  │       │  Manual  │
│ CSV/XLSX │       │  Entry   │
│ or Paste │       │   Form   │
└────┬─────┘       └────┬─────┘
     │                  │
     └────────┬─────────┘
              ▼
     ┌─────────────────┐
     │  Data Quality   │
     │     Check       │
     │  (non-blocking) │
     └────────┬────────┘
              │
   ┌──────────┴───────────┐
   ▼                      ▼
Issues found?        No issues
   │                      │
   ▼                      │
┌─────────────────┐       │
│ ⚠️ Warning Card │       │
│ • Continue      │       │
│ • Fix Data      │       │
└────────┬────────┘       │
         │                │
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │   Insights     │
         │   Dashboard    │
         │ (with banner   │
         │  if dirty)     │
         └────────────────┘
```

### Step-by-step

1. **Home** — User chooses to upload a file, paste data, or enter sales manually.
2. **Upload / Manual** — Data is parsed and normalized (column names mapped to `product`, `quantity`, `price`, `date`, `platform`).
3. **Data Quality Check** — The app validates rows for:
   - Missing values (product, price, quantity, date)
   - Duplicate entries
   - Invalid values (negative price, zero/negative quantity, malformed date)
4. **Warning (if needed)** — A non-blocking card shows issue counts. The user can:
   - **Continue Anyway** — proceeds with best-effort defaults; a "dirty" flag is set.
   - **Fix Data** — returns to the input screen.
5. **Insights Dashboard** — Shows revenue totals, top-selling products, platform breakdown, and simple recommendations (e.g. *"You should restock Product A"*). If data was dirty, a banner warns that results may be inaccurate.

---

## 🗄️ Data Model / Tables

Localytics currently runs **fully offline** using `localStorage`. The "tables" below are the JSON shapes stored in the browser. They map 1:1 to the database tables you would need if/when the app moves to a backend (e.g. Lovable Cloud).

### 1. `sales` — validated, committed sales records

| Column     | Type                                                     | Notes                              |
|------------|----------------------------------------------------------|------------------------------------|
| `id`       | `uuid` (PK)                                              | Generated on insert                |
| `product`  | `text`                                                   | Product / item name                |
| `quantity` | `numeric`                                                | Units sold (>= 0)                  |
| `price`    | `numeric`                                                | Unit price (>= 0)                  |
| `date`     | `timestamptz`                                            | ISO date of the sale               |
| `platform` | `text` (`TikTok` / `Instagram` / `Facebook` / `WhatsApp` / `Other`) | Sales channel        |
| `is_dirty` | `boolean` (default `false`)                              | True if imported via "Continue Anyway" |
| `created_at` | `timestamptz` (default `now()`)                        |                                    |

**localStorage key:** `ghostledger.sales.v1`

### 2. `pending_imports` — raw rows awaiting quality review

Holds the parsed-but-not-yet-committed rows between the Upload/Manual step and the Quality Check step.

| Column      | Type        | Notes                                   |
|-------------|-------------|-----------------------------------------|
| `id`        | `uuid` (PK) |                                         |
| `payload`   | `jsonb`     | Array of normalized raw rows            |
| `source`    | `text`      | `upload` / `paste` / `manual`           |
| `created_at`| `timestamptz` |                                       |

**localStorage key:** `ghostledger.pending.v1`

### 3. `quality_reports` — last computed quality report

| Column        | Type        | Notes                                        |
|---------------|-------------|----------------------------------------------|
| `id`          | `uuid` (PK) |                                              |
| `total`       | `int`       | Total rows analyzed                          |
| `valid`       | `int`       | Rows that passed all checks                  |
| `missing`     | `int`       | Rows with missing values                     |
| `duplicates`  | `int`       | Duplicate rows detected                      |
| `invalid`     | `int`       | Rows with invalid values (e.g. negative price) |
| `issues`      | `jsonb`     | Detailed list: `{ rowIndex, type, field, message }` |
| `created_at`  | `timestamptz` |                                            |

**localStorage key:** `ghostledger.report.v1`

### 4. `app_state` — lightweight UI/session flags

| Key         | Type      | Notes                                           |
|-------------|-----------|-------------------------------------------------|
| `is_dirty`  | `boolean` | Set when user chose "Continue Anyway" — drives the dashboard warning banner |

**localStorage key:** `ghostledger.dirty.v1`

---

### 🔮 If/when you move to Lovable Cloud

Add a `user_id uuid references auth.users(id)` column to **every** table above and enable Row-Level Security so each user only sees their own rows. Roles (e.g. admin) should live in a **separate `user_roles` table** — never on the `sales` or profile table.

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5** + **TypeScript**
- **Tailwind CSS v3** + **shadcn/ui**
- **Recharts** for charts
- **PapaParse** + **SheetJS (xlsx)** for file parsing
- **localStorage** for offline persistence

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open the preview and start with **Home → Upload** or **Home → Manual Entry**.
