# Boligbolig - Quickstart Guide

## 🚀 Getting Started

This guide will help you run the Boligbolig platform locally in just a few minutes!

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! The platform is now running with mock data.

## 📍 Where to Find Things

### Main Pages

#### For Everyone
- **Home Page:** [http://localhost:3000](http://localhost:3000)
  - Landing page with platform overview
  - Feature showcase

#### For Buyers
- **Browse Properties:** [http://localhost:3000/koeb](http://localhost:3000/koeb)
  - See all 7 available properties
  - Filter by region and property type
  - Click any property to see full details

- **Property Detail:** [http://localhost:3000/bolig/prop-1](http://localhost:3000/bolig/prop-1)
  - Full property information
  - Price slider showing demand
  - Area statistics

- **Create Buyer Profile:** [http://localhost:3000/koeber/ny](http://localhost:3000/koeber/ny)
  - 3-step wizard to set up your search
  - Define budget, property types, and areas

- **Buyer Matches:** [http://localhost:3000/koeber/matches](http://localhost:3000/koeber/matches)
  - See properties that match your profile
  - View match scores
  - Track your search criteria

#### For Sellers
- **Create Property:** [http://localhost:3000/saelg/ny](http://localhost:3000/saelg/ny)
  - **This is where the price slider magic happens! 🎯**
  - Multi-step form to create a property listing
  - **Step 2 shows the real-time Price Slider** with buyer count feedback
  - Try adjusting the price and see how many buyers are interested!

- **Seller Dashboard:** [http://localhost:3000/saelg/matches](http://localhost:3000/saelg/matches)
  - Overview of your properties
  - See matched buyers
  - Track interest levels

### Key Features to Test

#### 1. Price Slider (Step 2 of Create Property)
- Navigate to [http://localhost:3000/saelg/ny](http://localhost:3000/saelg/ny)
- Click "Næste" to go to Step 2
- **Drag the price slider** and watch:
  - Real-time buyer count update
  - Demand level indicator (red/orange/yellow/green)
  - Visual demand chart showing interest at different price points
  - Contextual insights based on current pricing

#### 2. Property Browsing with Filters
- Go to [http://localhost:3000/koeb](http://localhost:3000/koeb)
- Click "Filtre" to show/hide filter panel
- Filter by region (København K, Aarhus, etc.)
- Filter by property type (Villa, Lejlighed, etc.)
- Clear filters individually or all at once
- See result count update in real-time

#### 3. Property Detail View
- Click "Se detaljer" on any property card
- See full property information with price slider
- View area statistics and gennemsnit m² prices
- Click "Opret køberprofil" to start matching process

#### 4. Buyer Profile Creation
- Go to [http://localhost:3000/koeber/ny](http://localhost:3000/koeber/ny)
- **Step 1:** Set budget with flexibility slider
- **Step 2:** Define size, rooms, and build year requirements
- **Step 3:** Select one or more regions
- See profile summary before submission

#### 5. Matching Dashboards
- **Buyer side:** [http://localhost:3000/koeber/matches](http://localhost:3000/koeber/matches)
  - View all properties that match your criteria
  - See match scores (percentage)
  - Edit your profile

- **Seller side:** [http://localhost:3000/saelg/matches](http://localhost:3000/saelg/matches)
  - View all your properties
  - See number of matches per property
  - See interested buyer count
  - View potential buyers with match scores

## 🎨 What's Implemented

✅ **Complete UI - 11 Pages:**
- Landing page with feature showcase
- Property browsing with advanced filtering
- Property detail page with full information
- Multi-step property creation form (3 steps)
- Multi-step buyer profile creation (3 steps)
- Buyer matching dashboard
- Seller matching dashboard
- Responsive design with Tailwind CSS throughout

✅ **Backend (tRPC) - 3 Routers:**
- Property router: CRUD, filtering, buyer count, price slider data
- Buyer router: Profile management, matching queries
- Match router: Direct matches, property/buyer lookups
- Real-time buyer count calculations
- Price slider data generation
- Matching algorithms

✅ **Mock Data - Production-Ready:**
- 7 diverse properties across 4 regions
- 5 buyer profiles with varied budgets and preferences
- Match data showing algorithm results
- Property features and preferences
- Full type safety with TypeScript
- Ready to swap with real Supabase data

## 📊 Mock Data Overview

### Properties
1. **København K** - 85m² lejlighed - 4.5M kr
2. **Nordsjælland** - 150m² villa - 6.8M kr
3. **Aarhus** - 120m² rækkehus - 3.2M kr
4. **København K** - 105m² lejlighed - 5.2M kr
5. **Odense** - 180m² villa - 4.8M kr
6. **Aarhus** - 72m² lejlighed - 2.4M kr
7. **Nordsjælland** - 135m² rækkehus - 5.5M kr

### Buyers
- 5 active buyers with budgets ranging from 2-8M kr
- Different property type preferences
- Various flexibility levels (10-20%)
- Multiple region preferences

## 🔧 Development Tips

### Key Files to Explore

- **Price Slider:** `src/components/properties/price-slider.tsx`
- **Property Card:** `src/components/properties/property-card.tsx`
- **Mock Data:** `src/lib/db/mock-data.ts`
- **tRPC Routers:** `src/lib/trpc/routers/`
- **Type Definitions:** `src/types/database.ts`

### Making Changes

The app uses hot-reload, so any changes you make will automatically refresh the browser.

**Try this:**
1. Open `src/lib/db/mock-data.ts`
2. Change a property price or add a new buyer
3. Go to the price slider - it updates immediately!

## 🎯 Best Demo Path

1. Start at homepage: [http://localhost:3000](http://localhost:3000)
2. Click "Kom i gang" or navigate to [http://localhost:3000/saelg/ny](http://localhost:3000/saelg/ny)
3. Fill in basic property details (Step 1)
4. Click "Næste" to reach **Step 2 - The Price Slider** ⭐
5. Experiment with different price points
6. Watch the buyer count and demand chart update in real-time
7. See contextual insights change based on demand

## 🚧 What's Not Implemented (Yet)

- Image upload (Step 3 is a placeholder)
- Actual data persistence (using mock data)
- Authentication / MitID integration
- Ring-matching algorithm visualization
- Auction functionality
- Payment integration

## 📝 Next Steps

To continue development:
1. Replace mock data with actual Supabase integration
2. Implement authentication
3. Add image upload with blur functionality
4. Build out the matching algorithm UI
5. Add real-time notifications

## ❓ Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎉 Enjoy!

The platform is ready to demo. The price slider on Step 2 of property creation is the star feature - it shows real-time buyer interest as you adjust the price!
