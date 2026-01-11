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

- **Home Page:** [http://localhost:3000](http://localhost:3000)
  - Landing page with platform overview

- **Browse Properties (Køb):** [http://localhost:3000/koeb](http://localhost:3000/koeb)
  - See all 7 available properties with mock data
  - View property cards with details

- **Create Property (Sælg):** [http://localhost:3000/saelg/ny](http://localhost:3000/saelg/ny)
  - **This is where the magic happens! 🎯**
  - Multi-step form to create a property listing
  - **Step 2 shows the real-time Price Slider** with buyer count feedback
  - Try adjusting the price and see how many buyers are interested!

### Key Features to Test

#### 1. Price Slider (Step 2 of Create Property)
- Navigate to [http://localhost:3000/saelg/ny](http://localhost:3000/saelg/ny)
- Click "Næste" to go to Step 2
- **Drag the price slider** and watch:
  - Real-time buyer count update
  - Demand level indicator (red/orange/yellow/green)
  - Visual demand chart showing interest at different price points
  - Contextual insights based on current pricing

#### 2. Property Browsing
- Go to [http://localhost:3000/koeb](http://localhost:3000/koeb)
- Browse 7 different properties across different regions
- See property cards with:
  - Price, size, rooms, build year
  - Energy labels
  - Anonymous regions (København K, Aarhus, etc.)

## 🎨 What's Implemented

✅ **Complete UI:**
- Landing page with feature showcase
- Property browsing with filtering
- Multi-step property creation form
- Real-time price slider component
- Responsive design with Tailwind CSS

✅ **Backend (tRPC):**
- Property CRUD operations
- Buyer profile management
- Real-time buyer count calculations
- Price slider data generation
- Matching algorithms

✅ **Mock Data:**
- 7 properties across 4 regions
- 5 buyer profiles with different budgets
- Property features and preferences
- Full type safety with TypeScript

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
