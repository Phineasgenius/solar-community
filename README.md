# ☀️ SunShare — Community Solar Platform

**SunShare** is a web platform that makes community solar participation easier for residents, housing communities, and solar-plant hosts.

The platform allows users to discover nearby community solar plants, explore their availability, estimate potential savings through Virtual Net Metering (VNM), subscribe to solar capacity, and monitor their energy and savings through a dedicated dashboard.

Built as a hackathon-ready prototype using **Next.js, TypeScript, Tailwind CSS, Zustand, React Leaflet, and OpenStreetMap**.

---

## 🌱 What is SunShare?

Not everyone can install solar panels on their own rooftop.

SunShare explores a different approach: **community solar**.

A shared solar plant can serve multiple households or residents, allowing people who may not have suitable rooftops to participate in renewable energy generation.

SunShare provides a digital interface for this model by connecting:

**Residents → Community Solar Plants → Virtual Net Metering → Electricity Savings**

The application demonstrates how residents can discover plants, subscribe to available capacity, estimate their savings, and track their participation.

---

## ✨ Features

### 🗺️ Community Solar Marketplace

Discover available solar plants through an interactive marketplace.

* Interactive map powered by **React Leaflet**
* OpenStreetMap-based mapping
* Search for locations
* Location-aware plant discovery
* Distance calculation between the searched/current location and solar plants
* Sort plants by distance
* Filter plants by plant type and availability
* Radius-based filtering
* City-based filtering
* Plant capacity and availability information

The marketplace uses OpenStreetMap's **Nominatim** service for location search and does not require a Mapbox API key.

---

### 📍 Location Detection

SunShare can use the browser's Geolocation API to determine the user's current location.

When enabled, the application can:

* Center the map around the user
* Calculate distances to solar plants
* Sort nearby plants
* Filter plants within a selected radius

If location access is denied or unavailable, the application continues to work using manual location search.

---

### ☀️ Solar Plant Discovery

Each solar plant contains information such as:

* Plant name
* Location
* Capacity
* Available capacity
* Plant type
* Estimated generation
* Subscription status
* Distance from the user/search location

Plants with very limited remaining capacity can automatically switch from **Subscribe** to **Join Waitlist**.

---

### ⚡ Virtual Net Metering Calculator

The built-in VNM calculator provides an estimate of how community solar participation can affect an electricity bill.

Users can enter relevant consumption and solar parameters to estimate:

* Electricity consumption
* Solar allocation
* Estimated generation
* Grid energy usage
* Approximate bill savings
* Solar contribution

The calculator is intended for demonstration purposes and does not represent an official DISCOM billing calculation.

---

### 👤 Resident Dashboard

Residents can manage their community-solar participation through a dedicated dashboard.

The dashboard provides:

* Active solar subscriptions
* Multiple plant subscriptions
* Estimated generation
* Estimated savings
* Solar contribution
* Subscription management
* Activity notifications
* Settlement information
* Downloadable settlement statement

Multiple solar plants can be subscribed to simultaneously.

---

### 🏢 Host / RWA Dashboard

Housing societies, RWAs, and solar-plant hosts have a separate dashboard for managing their community.

It includes:

* Subscriber overview
* Subscriber ledger
* Search
* Subscription status filtering
* Plant information
* Capacity information
* Generation data
* Community-level statistics

The application supports switching between **Resident** and **RWA/Host** roles.

---

### 🔔 Notifications

SunShare includes a notification system for important activity such as:

* Solar credits
* Capacity alerts
* Billing-cycle events
* Nearby plant availability
* Subscription activity

Notifications are currently based on mock/demo data.

---

### 📄 Settlement Statement

Residents can generate and download a settlement statement directly from the dashboard.

The statement is generated client-side, so no backend service is required.

---

### 💾 Local Data Persistence

SunShare uses **Zustand with persistence** to maintain application state.

Data such as:

* User role
* Subscriptions
* Calculator inputs

is persisted using browser `localStorage`.

This allows the prototype to maintain state between page reloads without requiring a database.

---

## 🎨 Design

SunShare uses a clean **light Solarpunk-inspired interface** focused on renewable energy, accessibility, and modern technology.

The visual system uses:

* White and light-gray surfaces
* Sustainable green accents
* Soft green backgrounds
* Blue secondary accents
* Orange highlights
* Dark neutral typography
* Subtle technical grid patterns

### Core Palette

| Token     | Color       | Usage                      |
| --------- | ----------- | -------------------------- |
| `#FFFFFF` | White       | Primary background         |
| `#F8F9FA` | Light Gray  | Cards / secondary surfaces |
| `#F1F3F4` | Soft Gray   | Muted surfaces             |
| `#E6F4EA` | Soft Green  | Green accent backgrounds   |
| `#E8F0FE` | Soft Blue   | Blue accent backgrounds    |
| `#202124` | Dark Gray   | Primary text               |
| `#5F6368` | Gray        | Secondary text             |
| `#1E8E3E` | Green       | Primary accent             |
| `#137333` | Dark Green  | Hover states               |
| `#1A73E8` | Blue        | Secondary accent           |
| `#E37400` | Orange      | Highlights / warnings      |
| `#DADCE0` | Border Gray | Borders                    |

---

## 🧰 Tech Stack

### Frontend

* **Next.js 14**
* **React**
* **TypeScript**
* **Tailwind CSS**

### UI

* Custom components following the shadcn/ui design pattern
* Responsive layouts
* Reusable cards, buttons, badges, dialogs, tabs, tables, and sliders

### State Management

* **Zustand**
* Zustand Persist
* Browser `localStorage`

### Maps & Location

* **React Leaflet**
* **OpenStreetMap**
* **Nominatim**
* Browser Geolocation API

### Charts & Data Visualization

* Client-side analytics/chart components for generation and savings visualization

### Notifications

* **Sonner**

---

## 🏗️ Project Structure

```text
solar-community/
│
├── public/
│   └── assets/
│       └── hero-bg.jpg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── host/
│   │   │       └── page.tsx
│   │   │
│   │   └── marketplace/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── Navbar.tsx
│   │   ├── LiveTicker.tsx
│   │   ├── VnmCalculator.tsx
│   │   ├── SolarMap.tsx
│   │   └── AnalyticsChart.tsx
│   │
│   ├── lib/
│   │   ├── discomRates.ts
│   │   ├── mockData.ts
│   │   └── utils.ts
│   │
│   └── store/
│       └── useUserStore.ts
│
├── package.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── next-env.d.ts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### 1. Clone the repository

```bash
git clone https://github.com/Phineasgenius/solar-community.git
cd solar-community
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application should now be running locally.

---

## 🖼️ Hero Image

The landing page uses:

```text
public/assets/hero-bg.jpg
```

Replace this image with your own solar-energy or renewable-energy photograph if desired.

A wide image is recommended for the best result.

---

## 🔑 API Keys & Environment Variables

**The current application does not require environment variables to run.**

There is no required:

* Supabase configuration
* Mapbox token
* Database connection
* Authentication provider

The marketplace uses React Leaflet and OpenStreetMap, while application state is stored locally using Zustand.

---

## 🗺️ Maps

SunShare currently uses:

**React Leaflet + OpenStreetMap**

This keeps the prototype simple and avoids requiring a commercial map API key.

Location search uses the OpenStreetMap **Nominatim** geocoding service.

For a production application, appropriate API usage limits, caching, attribution, and potentially a dedicated geocoding provider should be considered.

---

## 📊 Data & Calculations

SunShare is currently a **prototype/demo application**.

The following data is mocked:

* Solar plants
* Plant capacity
* Subscribers
* Generation history
* Notifications
* Solar generation
* DISCOM tariff values

The DISCOM tariff calculations are illustrative and should **not** be treated as current electricity tariffs or official billing calculations.

Similarly, the solar-generation and carbon-reduction figures are estimates intended for demonstrating the application's functionality.

---

## 🔄 Application Flow

```text
                    ┌──────────────────┐
                    │     SunShare     │
                    └────────┬─────────┘
                             │
             ┌───────────────┴───────────────┐
             │                               │
      ┌──────▼──────┐                 ┌──────▼──────┐
      │   Resident  │                 │ RWA / Host  │
      └──────┬──────┘                 └──────┬──────┘
             │                               │
      Discover Plants                Manage Community
             │                               │
      ┌──────▼──────┐                 ┌──────▼──────┐
      │ Marketplace │                 │   Dashboard  │
      └──────┬──────┘                 └──────────────┘
             │
      Select Solar Plant
             │
      ┌──────▼──────┐
      │  Subscribe  │
      │ / Waitlist  │
      └──────┬──────┘
             │
      Virtual Net Metering
             │
      ┌──────▼──────┐
      │   Savings   │
      │  & Energy   │
      └─────────────┘
```

---

## 🔮 Future Improvements

SunShare can be extended into a production-ready community-solar platform by adding:

* Real user authentication
* Database-backed subscriptions
* Real DISCOM tariff data
* Real-time solar-generation data
* Payment integration
* Digital agreements
* Automated billing
* Production-grade geocoding
* Real solar plant APIs
* Advanced energy analytics
* Carbon-impact tracking
* Admin dashboard
* Role-based authentication and authorization
* Notifications through email/SMS
* Mobile application
* Multi-language support

A backend such as **Supabase, PostgreSQL, or another database service** could be introduced when persistent multi-user data is required.

---

## ⚠️ Disclaimer

SunShare is currently a **prototype for demonstration and educational purposes**.

The solar plants, subscriber information, generation data, tariff values, savings estimates, and other numerical values are simulated or illustrative.

The application should not be used to make actual electricity billing, financial, or solar-investment decisions without replacing the demo data and calculations with verified real-world data.

---

## 📄 License

This project is intended as an educational and hackathon prototype.

Add an explicit open-source license to the repository if you intend to permit redistribution or modification.

---

## 👨‍💻 Author

**Praneel Patil**

GitHub: **@Phineasgenius**

---

## 🌍 Vision

> **Making renewable energy accessible beyond the rooftop.**

SunShare explores how community solar and digital platforms can make participation in renewable energy more accessible to households that cannot install their own solar systems.

**Discover. Share. Generate. Save.** ☀️🌱
