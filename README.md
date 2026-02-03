This is the landing page for Commercialisation Console

# Enginuity Commercialisation Dashboard - Technical Reference

## Overview

This document contains all technical context about the Enginuity Commercial Opportunity Scoring Dashboard for university Technology Transfer Offices (TTOs). Use this as a reference when creating new Claude Code prompts for extensions or modifications.

**Last Updated**: January 2026

---

## Repository & Tech Stack

### Repository Information
- **URL**: https://github.com/urburn/sprint-zero/
- **Owner**: urburn
- **Access**: Claude Code has direct access to this repository
- **Primary Branch**: main (confirm current default branch)

### Technology Stack

**NOT a single HTML file** - This is a modern JavaScript application:

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Package Manager**: npm
- **Language**: JavaScript (JSX)
- **Charts**: Chart.js (may need to install `chart.js` and `react-chartjs-2`)
- **Node.js**: Required (version 16+ recommended)

### Project Structure

```
sprint-zero/
├── README.md
├── package.json              # Dependencies and scripts
├── package-lock.json
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind customization
├── postcss.config.js         # PostCSS for Tailwind
├── index.html                # HTML entry point
├── index-landing-page.html   # Separate landing page
├── node_modules/             # Dependencies (gitignored)
├── public/                   # Static assets
└── src/                      # Source code
    ├── main.jsx              # React entry point
    ├── App.jsx               # Main application component
    ├── index.css             # Global styles (Tailwind imports)
    ├── components/           # React components
    ├── data/                 # Asset data and configurations
    ├── config/               # Configuration files
    └── utils/                # Utility functions
```

### Setup Commands

```bash
# Clone repository
git clone https://github.com/urburn/sprint-zero/
cd sprint-zero

# Install dependencies (REQUIRED before running)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Important**: Always run `npm install` after cloning. The project will not work without dependencies installed.

---

## Core Concepts

### Platform Purpose
**Enginuity** is an AI-native IP intelligence platform that helps university Technology Transfer Offices (TTOs) assess and prioritize innovation assets for commercialization.

### Primary Users
- TTO Directors
- Licensing Managers
- Technology Transfer Officers
- University research leadership

### Value Proposition
- **Problem**: TTOs manually assess hundreds of invention disclosures with limited resources
- **Solution**: AI-powered scoring across 6 dimensions to identify high-potential assets
- **Outcome**: Data-driven portfolio management and resource allocation

---

## Scoring Framework: The 6 Dimensions

Every innovation asset is scored 0-100 across six **mutually exclusive and collectively exhaustive** dimensions:

### 1. Investment Appetite (formerly "Market Demand")
**Question**: *Does the market want this?*
- External market demand and commercial interest
- Company inquiries, NDAs, competitive interest
- VC funding trends in the sector
- Industry R&D spending

### 2. Competitive Position
**Question**: *Can we defend this advantage?*
- Patent strength and breadth
- Freedom to operate (FTO)
- Technical differentiation
- Barriers to entry

### 3. Funding Alignment
**Question**: *Can we get grant support?*
- Match to specific funding opportunities (NIH, NSF, Innovate UK, etc.)
- Alignment with government priorities
- Number and size of relevant grant programs
- Deadline urgency

### 4. Time To Opportunity
**Question**: *How soon can we monetize this?*
- Expected timeline to revenue generation
- Deal stage and velocity
- Regulatory pathway complexity
- Partner readiness

### 5. Commercialization Readiness
**Question**: *Is the technology mature enough?*
- Technology Readiness Level (TRL 1-9)
- Prototype status
- Validation data
- Manufacturing readiness

### 6. Strategic Fit
**Question**: *Does this advance institutional priorities?*
- Alignment with university strategic plan
- Fit with research priorities
- Stakeholder expectations
- Reputational value

### Composite Score
The **Composite Opportunity Score** (0-100) aggregates all six dimensions using a weighted algorithm. Individual dimension scores often matter more than composite for portfolio decisions.

---

## Data Architecture

### Asset Data Structure

Assets are stored in `src/data/` directory (exact filename may vary - common patterns: `assets.js`, `mockData.js`, `portfolio.js`).

**Core Asset Properties**:
```javascript
{
  id: 1,                                    // Unique identifier
  title: "CRISPR-based Gene Therapy...",   // Asset name
  description: "Brief description...",      // 1-2 sentences
  
  // Scoring
  score: 87,                                // Composite score (0-100)
  dimensions: {
    investmentAppetite: 85,                 // Individual dimension scores
    competitivePosition: 92,
    fundingAlignment: 88,
    timeToOpportunity: 75,
    commercializationReadiness: 78,
    strategicFit: 90
  },
  
  // Classification
  type: "Life Sciences",                    // Technology category
  discipline: "Biotechnology",              // Sub-category
  faculty: "Medicine",                      // Academic department
  
  // Metadata
  inventor: "Prof. Jane Smith",
  disclosureDate: "2024-03-15",
  stage: "Patent Filed",
  
  // Additional properties vary by implementation
  tags: ["gene therapy", "rare disease", "CRISPR"],
  fundingPotential: "High",
  // ... other properties
}
```

**Number of Assets**: Currently **25 assets** in the demo dataset

**Asset Types/Disciplines**:
- Life Sciences / Biotechnology
- Engineering / Materials Science
- Computer Science / AI & Machine Learning
- Cleantech / Environmental Technology
- Medical Devices
- Software / Digital

### Extension Points for New Features

When adding new features (like funding data), extend the asset structure:

```javascript
{
  id: 1,
  title: "...",
  score: 87,
  // ... existing properties ...
  
  // NEW FEATURE: Funding matches
  fundingMatches: [
    {
      id: 1,
      source: "NIH",
      title: "R01 Grant...",
      alignment: 94,
      amount: 2500000,
      deadline: "2026-03-15",
      // ... opportunity details
    }
  ],
  
  // NEW FEATURE: Historical trends
  fundingTrends: {
    quarters: [ /* 20 quarterly data points */ ],
    insights: { /* peak, trend, drivers */ }
  }
}
```

---

## Component Architecture

### Key Components (Location: `src/components/`)

Component names may vary - examine the directory to find:

**Layout Components**:
- Header/Navigation
- Sidebar (if applicable)
- Main content area
- Footer

**Core Dashboard Components**:
- **AssetTable/AssetGrid**: Displays all assets in table or grid format
- **AssetCard/AssetDetail**: Modal or panel showing detailed asset information
- **FilterPanel**: Controls for filtering assets by dimension, type, etc.
- **ScoreCard/MetricCard**: Individual dimension score displays

**Tab Components** (if asset cards have tabs):
- Overview tab
- Score Dimensions tab
- Data Sources tab
- Scoring Logic tab
- (Potentially more)

**Common Component Patterns**:
```jsx
// Typical component structure
import { useState } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  const handleAction = () => {
    // Event handler
  };
  
  return (
    <div className="tailwind classes">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### State Management
- Currently using **React hooks** (useState, useEffect)
- May use **Context API** for global state (check App.jsx)
- No Redux or external state management libraries (as of last check)

### Routing
Check if React Router is installed:
- If yes: Routes may be defined in App.jsx
- If no: View switching via state management

---

## Styling System

### Tailwind CSS Configuration

**Primary Approach**: Utility-first CSS with Tailwind classes

**Configuration File**: `tailwind.config.js`

**Custom Theme Elements** (check tailwind.config.js for exact values):
- **Colors**: Black/white primary, soft gradients, accent colors
- **Fonts**: 
  - Body: 'Outfit' (sans-serif)
  - Headings: 'Lora' (serif)
- **Spacing**: Custom spacing scale (if defined)

**Common Tailwind Patterns in Project**:
```jsx
// Buttons
<button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
  
// Cards
<div className="bg-white rounded-lg shadow-md p-6">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox layouts
<div className="flex items-center justify-between">
```

### Enginuity Brand Guidelines

**Visual Identity**:
- **Node Symbol**: Grid of dots forming Enginuity logo (may be SVG or icon component)
- **Color Palette**: 
  - Black (#000000) - primary
  - White (#FFFFFF) - backgrounds
  - Soft gradients - accent backgrounds
  - Score-based colors:
    - Orange (#FF8652) - Critical/Low scores
    - Green (#93FBD3) - High scores
    - Yellow (#FFE78F) - Moderate scores
    - Gray - Neutral/Low priority
    
**Typography**:
- **Outfit**: Body text, UI elements
- **Lora**: Headings, emphasis

**Design Principles**:
- Clean, minimal, professional
- Data-forward (emphasize metrics and scores)
- University-appropriate (conservative, trustworthy)
- AI-native aesthetic (modern, intelligent)

### Custom CSS
Check `src/index.css` for:
- Tailwind imports (@tailwind base/components/utilities)
- Custom CSS classes (if any)
- Font imports (Google Fonts or local)
- Global styles

---

## Development Workflow

### Before Making Changes

**1. Examine Current Implementation**:
```bash
# Clone if not already local
git clone https://github.com/urburn/sprint-zero/

# Install dependencies
cd sprint-zero
npm install

# Run development server
npm run dev

# Open browser and explore:
# - What views exist (Portfolio, Pipeline, Reports?)
# - How navigation works
# - What components are used
# - How data flows through the app
```

**2. Review Project Structure**:
```bash
# List all components
ls src/components/

# Find data files
ls src/data/

# Check configuration
cat tailwind.config.js
cat vite.config.js
cat package.json  # Check dependencies
```

**3. Identify Extension Points**:
- Where to add new components
- Where asset data is defined
- How to integrate new features
- What existing patterns to follow

### Creating a New Feature/Variant

**Step 1: Branch Strategy**
```bash
# Create feature branch
git checkout -b feature-name

# Or create variant branch
git checkout -b dashboard-variant-name
```

**Step 2: Install New Dependencies** (if needed)
```bash
# Example: Adding Chart.js
npm install chart.js react-chartjs-2

# Dependencies are saved to package.json automatically
```

**Step 3: Create New Components**
```bash
# Create component file
touch src/components/NewComponent.jsx

# Follow existing component patterns
# Import in parent component
# Export default at bottom
```

**Step 4: Extend Data** (if needed)
```javascript
// In src/data/assets.js (or similar)
// Add new properties to asset objects
// Maintain consistency across all 25 assets
```

**Step 5: Test Continuously**
```bash
# Keep dev server running
npm run dev

# Check browser for:
# - Console errors
# - Component rendering
# - Data flow
# - Styling consistency
```

**Step 6: Commit and Push**
```bash
git add .
git commit -m "Descriptive commit message"
git push origin branch-name
```

### Common Pitfalls to Avoid

1. **Assuming Single HTML File**: This is a React app, not vanilla JS
2. **Skipping npm install**: Dependencies must be installed
3. **Breaking Existing Components**: Test that existing features still work
4. **Ignoring Existing Patterns**: Match component structure and styling
5. **Hardcoding Values**: Use props and state management
6. **Mixing Styling Approaches**: Use Tailwind, avoid inline styles
7. **Not Testing All Views**: Ensure all tabs/views still function

---

## Common Modifications

### Adding a New Tab to Asset Cards

**Step 1**: Locate AssetCard component
```bash
# Find the file
find src/components -name "*Asset*Card*"
```

**Step 2**: Add tab to navigation array
```jsx
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'dimensions', label: 'Score Dimensions' },
  { id: 'new-tab', label: 'New Tab' },  // Add here
  // ... existing tabs
];
```

**Step 3**: Create tab content component
```jsx
// src/components/NewTabContent.jsx
const NewTabContent = ({ asset }) => {
  return (
    <div>
      <h3>New Tab Content for {asset.title}</h3>
      {/* Tab content here */}
    </div>
  );
};

export default NewTabContent;
```

**Step 4**: Add conditional rendering
```jsx
{activeTab === 'new-tab' && <NewTabContent asset={asset} />}
```

### Adding New Asset Properties

**Step 1**: Extend data structure in `src/data/`
```javascript
{
  id: 1,
  title: "...",
  // ... existing properties ...
  newProperty: "new value",  // Add to ALL assets
  newArray: [/* items */],
  newObject: { /* nested data */ }
}
```

**Step 2**: Update TypeScript types (if using TypeScript)

**Step 3**: Access in components via props
```jsx
const MyComponent = ({ asset }) => {
  return <div>{asset.newProperty}</div>;
};
```

### Adding New Views/Pages

**Step 1**: Check if React Router is used
```bash
grep -r "react-router" package.json
```

**Step 2**: If router exists, add route
```jsx
<Route path="/new-view" element={<NewViewComponent />} />
```

**Step 3**: If no router, use conditional rendering
```jsx
const [currentView, setCurrentView] = useState('portfolio');

{currentView === 'portfolio' && <PortfolioView />}
{currentView === 'new-view' && <NewView />}
```

**Step 4**: Add navigation button
```jsx
<button onClick={() => setCurrentView('new-view')}>
  New View
</button>
```

---

## Data Generation Guidelines

### Synthetic Data Requirements

When creating demo/test data:

**Realistic Patterns**:
- Scores should distribute normally (most 50-80, some outliers)
- High scores in one dimension don't guarantee high composite score
- Different asset types have different scoring profiles:
  - Life Sciences: High Commercialization Readiness takes longer
  - Software: Fast Time To Opportunity
  - Cleantech: High Strategic Fit (current priorities)
  
**Correlation Rules**:
- High Funding Alignment → More funding opportunities
- High Commercialization Readiness → Shorter Time To Opportunity
- High Investment Appetite → Higher valuations
- Low Strategic Fit can be overridden by strong commercial metrics

**Variety**:
- Include assets across score spectrum (40-95)
- Represent all major disciplines
- Mix early-stage and mature technologies
- Include both "sure bets" and "high risk, high reward"

### Time-Series Data

When adding historical trends:
- Use realistic time periods (5 years quarterly = 20 points)
- Show sector-specific patterns:
  - **Life Sciences**: COVID spike 2020-2021, then recovery
  - **Climate/Energy**: IRA boost 2022-2023
  - **AI/Computing**: ChatGPT boom 2023
  - **Engineering**: Steady gradual growth
- Add seasonality (Q4 fiscal year peaks)
- Include random variation (not perfectly smooth lines)

---

## Testing Checklist

Before considering a modification complete:

### Functionality Tests
- [ ] Application starts without errors (`npm run dev`)
- [ ] All existing views/pages still work
- [ ] Asset table displays all 25 assets
- [ ] Filters and sorting function correctly
- [ ] Asset cards open and display data
- [ ] All tabs within asset cards work
- [ ] New features function as intended
- [ ] No console errors or warnings

### Visual Tests
- [ ] Styling consistent with existing components
- [ ] Responsive on different screen sizes
- [ ] Fonts render correctly (Outfit, Lora)
- [ ] Colors match brand guidelines
- [ ] Spacing and alignment look professional
- [ ] No layout breaks or overlapping elements

### Data Tests
- [ ] All 25 assets have required properties
- [ ] New data properties present for all assets
- [ ] No missing or null values (unless intentional)
- [ ] Data relationships logical (correlations make sense)
- [ ] Test data realistic and varied

### Browser Tests
- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] No browser-specific issues
- [ ] Console clean in all browsers

---

## Reference Examples

### Example: Complete Asset Object
```javascript
{
  id: 1,
  title: "CRISPR-based Gene Therapy for Muscular Dystrophy",
  description: "Novel CRISPR/Cas9 gene editing approach for treating Duchenne muscular dystrophy through targeted correction of dystrophin gene mutations.",
  
  // Scoring
  score: 87,
  dimensions: {
    investmentAppetite: 85,
    competitivePosition: 92,
    fundingAlignment: 88,
    timeToOpportunity: 75,
    commercializationReadiness: 78,
    strategicFit: 90
  },
  
  // Classification
  type: "Life Sciences",
  discipline: "Biotechnology",
  subdiscipline: "Gene Therapy",
  faculty: "Medicine",
  department: "Molecular Biology",
  
  // People
  inventor: "Prof. Jane Smith",
  inventors: ["Prof. Jane Smith", "Dr. John Doe"],
  contact: "j.smith@university.edu",
  
  // Timeline
  disclosureDate: "2024-03-15",
  patentFiledDate: "2024-06-20",
  stage: "Patent Pending",
  
  // Engagement
  inquiries: 12,
  ndasSigned: 3,
  activeNegotiations: 2,
  
  // Tags
  tags: ["gene therapy", "rare disease", "CRISPR", "pediatric"],
  keywords: ["muscular dystrophy", "gene editing", "dystrophin"],
  
  // Potential
  marketSize: "£2.5B",
  targetRevenue: "£850K",
  fundingPotential: "High"
}
```

### Example: React Component Pattern
```jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ asset, onAction }) => {
  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState(null);
  
  // Effects
  useEffect(() => {
    // Side effects, data fetching, etc.
  }, [asset.id]); // Dependencies
  
  // Handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onAction?.(asset.id); // Optional chaining
  };
  
  // Render
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">{asset.title}</h3>
      
      {isExpanded && (
        <div className="mt-4">
          {/* Expanded content */}
        </div>
      )}
      
      <button 
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

// PropTypes for type checking
ComponentName.propTypes = {
  asset: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  onAction: PropTypes.func
};

export default ComponentName;
```

### Example: Chart.js Integration
```jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      label: 'Dataset',
      data: data.map(d => d.value),
      borderColor: '#000',
      backgroundColor: 'transparent'
    }]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };
  
  return <Line data={chartData} options={options} />;
};
```

---

## Quick Reference

### File Locations
- **Components**: `src/components/`
- **Data**: `src/data/`
- **Styles**: `src/index.css`
- **Config**: Root directory (tailwind.config.js, vite.config.js)
- **Entry**: `src/main.jsx` → `src/App.jsx`

### Commands
- **Install**: `npm install`
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

### Key Concepts
- **25 assets** in demo dataset
- **6 dimensions** for scoring
- **0-100** score range
- **React + Vite + Tailwind** tech stack
- **Enginuity branding** (Outfit/Lora, black/white)

### Common Tasks
- **Add tab**: Extend tab array in AssetCard
- **Add component**: Create .jsx file in components/
- **Extend data**: Modify files in src/data/
- **Style**: Use Tailwind classes
- **Test**: Keep `npm run dev` running

---

## Important Notes

### What This Is NOT
- ❌ Single HTML file
- ❌ Vanilla JavaScript
- ❌ jQuery or older libraries
- ❌ Bootstrap styling
- ❌ Backend/database (pure frontend demo)

### What This IS
- ✅ React single-page application
- ✅ Vite build tool
- ✅ Tailwind CSS styling
- ✅ npm package management
- ✅ Modern ES6+ JavaScript
- ✅ Component-based architecture
- ✅ Static demo data (no API calls)

### Key Success Factors
1. **Always examine existing code first** before making assumptions
2. **Follow existing patterns** for consistency
3. **Test incrementally** during development
4. **Maintain all existing functionality** when adding features
5. **Use Tailwind** for all styling
6. **Keep it realistic** - demo data should be plausible
7. **Document changes** in commit messages

---

## Future Enhancement Ideas

Potential features to add (ordered by complexity):

### Easy (1-2 hours)
- Additional filters (by faculty, by date range)
- Sort by individual dimensions
- Export asset list to CSV
- Print-friendly asset cards
- Keyboard shortcuts

### Medium (4-8 hours)
- Comparison view (side-by-side assets)
- Portfolio analytics dashboard
- Saved filters/views
- Asset search functionality
- Timeline view of asset progression

### Complex (2-5 days)
- Historical scoring trends per asset
- Predictive analytics (ML score projections)
- Integration with external data sources
- Collaborative features (comments, sharing)
- Advanced reporting suite

### Major Features (1-2 weeks)
- Multi-user support with authentication
- Real-time collaboration
- API integration (actual TTO systems)
- Mobile app version
- Advanced data visualization library

---

## Contact & Resources

### Documentation
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Chart.js**: https://www.chartjs.org/

### Project Resources
- **Repository**: https://github.com/urburn/sprint-zero/
- **Issues**: Check GitHub issues for known problems
- **README**: See project README.md for any project-specific notes

### Getting Help
If Claude Code encounters issues:
1. Check console errors first
2. Verify `npm install` was run
3. Check Node.js version (16+ required)
4. Review existing component patterns
5. Search for similar implementations in codebase
6. Check Tailwind classes are correct
7. Ensure React syntax is valid

---

## Version History

**January 2026**: Initial reference document created
- Documented React/Vite/Tailwind architecture
- Captured 6-dimension scoring framework
- Established 25-asset demo dataset structure
- Defined Enginuity brand guidelines
- Created development workflow documentation

**Future Updates**: Add notes here when significant changes are made to the architecture, data structure, or development approach.

---

## End of Reference Document
