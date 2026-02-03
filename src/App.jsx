import { useState, useMemo, useEffect } from 'react';
import mockDataRaw from './data/mockData.json';
import fundingTrendsData from './data/fundingTrendsData';
import {
  calculateCompositeScore,
  sortAssets,
  filterAssets,
  calculateSensitivity
} from './utils/scoreCalculator';

// Import components
import DashboardHeader from './components/DashboardHeader';
import AssetGrid from './components/AssetGrid';
import AssetTable from './components/AssetTable';
import AssetDetailModal from './components/AssetDetailModal';
import WeightAdjustmentPanel from './components/WeightAdjustmentPanel';
import HelpModal from './components/HelpModal';
import PipelineView from './components/PipelineView';
import ReportsView from './components/ReportsView';
import UploadModal from './components/UploadModal';
import ApplicationClusterView from './components/ApplicationClusterView';

function App() {
  // State management
  const [mainView, setMainView] = useState('portfolio'); // 'portfolio', 'clusters', 'pipeline', or 'reports'
  const [view, setView] = useState('grid'); // 'grid' or 'table'
  const [theme, setTheme] = useState('default'); // 'default' or 'utah'
  const [filters, setFilters] = useState({
    type: 'all',
    discipline: 'all',
    scoreRange: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [weights, setWeights] = useState(mockDataRaw.defaultWeights);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showWeightPanel, setShowWeightPanel] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState('default');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Recalculate all asset scores based on current weights
  const assetsWithRecalculatedScores = useMemo(() => {
    return mockDataRaw.assets.map(asset => ({
      ...asset,
      compositeScore: calculateCompositeScore(asset.dimensions, weights),
      fundingTrends: fundingTrendsData[asset.id] || null
    }));
  }, [weights]);

  // Apply filters and sorting
  const processedAssets = useMemo(() => {
    const filtered = filterAssets(assetsWithRecalculatedScores, filters);
    return sortAssets(filtered, sortBy, sortOrder);
  }, [assetsWithRecalculatedScores, filters, sortBy, sortOrder]);

  // Calculate sensitivity (rank changes) when weights change
  const sensitivity = useMemo(() => {
    const originalScores = mockDataRaw.assets.map(asset => ({
      ...asset,
      compositeScore: calculateCompositeScore(asset.dimensions, mockDataRaw.defaultWeights)
    }));
    const sortedOriginal = sortAssets(originalScores, 'score', 'desc');
    const sortedCurrent = sortAssets(assetsWithRecalculatedScores, 'score', 'desc');
    return calculateSensitivity(sortedOriginal, sortedCurrent);
  }, [assetsWithRecalculatedScores]);

  // Handle weight changes
  const handleWeightChange = (dimension, value) => {
    setWeights(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  // Reset weights to default
  const handleResetWeights = () => {
    setWeights(mockDataRaw.defaultWeights);
    setActiveScenario('default');
  };

  // Apply preset scenario
  const handleApplyScenario = (scenarioKey) => {
    if (scenarioKey === 'default') {
      setWeights(mockDataRaw.defaultWeights);
    } else {
      const scenario = mockDataRaw.presetScenarios[scenarioKey];
      if (scenario) {
        setWeights(scenario.weights);
      }
    }
    setActiveScenario(scenarioKey);
  };

  // Save current weights as a scenario
  const handleSaveScenario = (name, description) => {
    const newScenario = {
      id: `custom-${Date.now()}`,
      name,
      description,
      weights: { ...weights }
    };
    setSavedScenarios(prev => [...prev, newScenario]);
    setActiveScenario(newScenario.id);
  };

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const types = [...new Set(mockDataRaw.assets.map(a => a.type))].sort();
    const disciplines = [...new Set(mockDataRaw.assets.map(a => a.discipline))].sort();
    return { types, disciplines };
  }, []);

  // Statistics for dashboard
  const stats = useMemo(() => {
    const total = processedAssets.length;
    const critical = processedAssets.filter(a => a.compositeScore >= 80).length;
    const high = processedAssets.filter(a => a.compositeScore >= 60 && a.compositeScore < 80).length;
    const avgScore = processedAssets.length > 0
      ? Math.round(processedAssets.reduce((sum, a) => sum + a.compositeScore, 0) / processedAssets.length)
      : 0;

    return { total, critical, high, avgScore };
  }, [processedAssets]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        stats={stats}
        mainView={mainView}
        onMainViewChange={setMainView}
        view={view}
        onViewChange={setView}
        filters={filters}
        onFiltersChange={setFilters}
        filterOptions={filterOptions}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onShowWeightPanel={() => setShowWeightPanel(true)}
        onShowHelp={() => setShowHelp(true)}
        onApplyScenario={handleApplyScenario}
        presetScenarios={mockDataRaw.presetScenarios}
        activeScenario={activeScenario}
        theme={theme}
        onUpload={() => setUploadModalOpen(true)}
      />

      {/* Main Content */}
      <main className={mainView === 'clusters' ? 'px-4 py-6' : 'container mx-auto px-4 py-6'}>
        {mainView === 'portfolio' ? (
          <>
            {view === 'grid' ? (
              <AssetGrid
                assets={processedAssets}
                onSelectAsset={setSelectedAsset}
                sensitivity={sensitivity}
              />
            ) : (
              <AssetTable
                assets={processedAssets}
                onSelectAsset={setSelectedAsset}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={(field) => {
                  if (sortBy === field) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(field);
                    setSortOrder('desc');
                  }
                }}
              />
            )}

            {processedAssets.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-500">No assets match your filters</p>
                <button
                  onClick={() => setFilters({ type: 'all', discipline: 'all', scoreRange: 'all', search: '' })}
                  className="mt-4 btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        ) : mainView === 'clusters' ? (
          <ApplicationClusterView
            assets={mockDataRaw.assets}
            applicationClusters={mockDataRaw.applicationClusters}
            onSelectAsset={setSelectedAsset}
          />
        ) : mainView === 'pipeline' ? (
          <PipelineView onSelectAsset={setSelectedAsset} />
        ) : (
          <AssetTable
            assets={processedAssets}
            onSelectAsset={setSelectedAsset}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(field) => {
              if (sortBy === field) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy(field);
                setSortOrder('desc');
              }
            }}
          />
        )}

        {processedAssets.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No assets match your filters</p>
            <button
              onClick={() => setFilters({ type: 'all', discipline: 'all', scoreRange: 'all', search: '' })}
              className="mt-4 btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          currentWeights={weights}
          contactsDatabase={mockDataRaw.contactsDatabase || []}
        />
      )}

      {/* Weight Adjustment Panel */}
      {showWeightPanel && (
        <WeightAdjustmentPanel
          weights={weights}
          onWeightChange={handleWeightChange}
          onReset={handleResetWeights}
          onClose={() => setShowWeightPanel(false)}
          onApplyScenario={handleApplyScenario}
          onSaveScenario={handleSaveScenario}
          presetScenarios={mockDataRaw.presetScenarios}
          savedScenarios={savedScenarios}
          activeScenario={activeScenario}
          topAffectedAssets={processedAssets.slice(0, 10)}
          sensitivity={sensitivity}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <HelpModal
          onClose={() => setShowHelp(false)}
          theme={theme}
          onThemeChange={setTheme}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
}

export default App;
