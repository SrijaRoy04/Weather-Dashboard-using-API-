# 🌦️ SkyPulse • Modern Weather Dashboard

A weather application built with **React**, **Vite**, and **Tailwind CSS**, consuming the **OpenWeatherMap API**. 

Featuring glassmorphic card design, dynamic atmospheric themes, animated weather badges, and detailed meteorological metrics.

---

## 🌟 Key Features

- **🌡️ Comprehensive Weather Metrics**:
  - Current Temperature, "Feels Like", Daily Min & Max
  - One-click **°C / °F Unit Switcher**
  - **Humidity** level with comfort indicator and visual progress bar
  - **Wind Speed** (km/h or mph) with interactive **Compass Directional Needle**
  - **Sunrise & Sunset Times** calibrated to the city's local timezone offset with **Daylight Arc Tracker**
  - Barometric **Pressure** (hPa), **Visibility** (km), and **Cloud Cover** (%)
- **🔍 City Search & Discovery**:
  - Search any city across the globe with instant feedback
  - Quick-select popular hub cities (London, New York, Tokyo, Paris, Mumbai, Sydney)
  - One-click **GPS Geolocation** ("Use My Location")
- **📅 5-Day & Hourly Forecast**:
  - 5-Day Outlook with weather icons, condition descriptions, and temperature ranges
  - 24-Hour Horizon broken down into 3-hour intervals with precipitation probability
- **⏳ Modern Loading Spinner**:
  - High-tech glowing pulse rings and radar sync indicators
- **🛡️ Robust Error Handling**:
  - City not found (HTTP 404) with recommended cities
  - Invalid/inactive API Key (HTTP 401) with inline key entry modal
  - Network disconnection fallback
- **✨ Instant Interactive Demo Mode**:
  - Out-of-the-box realistic simulation for major cities if an API key is not yet configured, allowing testing of all features instantly.

---

## 🛠️ Tech Stack & Prerequisites Implemented

- **React 18+** with Hooks:
  - `useEffect`: Automates weather loading on component mount, city query change, and unit change.
  - `useState`: Manages search query, units, error states, and weather metrics.
  - `useCallback`: Memoizes API fetch cycles.
- **Fetch API & Async-Await**:
  - Handles parallel network requests (`Promise.all`) for current weather and 5-day forecast.
  - Proper HTTP error status code translation (`404`, `401`, `429`).
- **Tailwind CSS (v4)**: Modern glassmorphism, dynamic gradients, responsive grid layouts.
- **Lucide React**: Clean icons.

---

## 🚀 Getting Started

### 1. Installation

Navigate to the project directory:
```bash
cd weather-dashboard
npm install
```

### 2. Configure OpenWeatherMap API Key (Optional)

You can obtain a free API key at [OpenWeatherMap API Keys](https://home.openweathermap.org/api_keys).

You have two easy options to configure it:
- **Option A (UI Modal)**: Click the **API Key** button in the top navbar and paste your key. It will be stored in your browser's `localStorage`.
- **Option B (.env file)**: Create a `.env` file in the root directory:
  ```env
  VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
  ```
- **Option C (GitHub Secrets & Variables)**: For GitHub Actions / CI / CD deployments:
  1. Open your repository on GitHub: `Settings` > `Secrets and variables` > `Actions`.
  2. Under **Repository secrets** (or **Repository variables**), click **New repository secret**.
  3. Name: `VITE_OPENWEATHER_API_KEY`
  4. Secret: `your_actual_api_key_here`
- **Option D (Interactive Demo Mode)**: If you don't have an API key right now, simply toggle **Demo Mode** in the settings modal to explore all features with high-fidelity realistic data!

### 3. Run the Development Server

```bash
npm run dev
```

Visit the local server URL (e.g. `http://localhost:5173`) in your browser.

---

## 📁 Directory Structure

```
weather-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx      # API key settings modal & Demo mode toggle
│   │   ├── ErrorMessage.jsx     # Graceful error screens with retry & suggestions
│   │   ├── Forecast.jsx         # 5-day daily forecast and hourly intervals
│   │   ├── LoadingSpinner.jsx   # Animated radar loading spinner
│   │   ├── Navbar.jsx           # Search bar, unit toggle, quick city buttons
│   │   ├── WeatherDetails.jsx   # Humidity, wind compass, sunrise/sunset arc
│   │   └── WeatherHero.jsx      # City hero card, current temp & condition badge
│   ├── services/
│   │   └── weatherService.js    # Fetch API, async/await, timezone and unit helpers
│   ├── App.jsx                  # Main orchestrator with useEffect hook
│   ├── index.css                # Glassmorphic Tailwind styles & animations
│   └── main.jsx                 # React root mount
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```
