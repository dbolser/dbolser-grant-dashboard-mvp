import { useState, useMemo } from 'react';
import mockDataRaw from '../data/mockData.json';
import MetricsPanel from './pipeline/MetricsPanel';
import TimelineView from './pipeline/TimelineView';
import RevenueForecastChart from './pipeline/RevenueForecastChart';
import ScenarioSelector from './pipeline/ScenarioSelector';
import { FileDown, GitCompare } from 'lucide-react';

// Transformation helpers
const getScoreLevel = (score) => {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
};

// Estimate value based on composite score (simple heuristic for demo)
const estimateValue = (asset) => {
  // Base value range 50k - 1M based on score
  const base = 50000;
  const variable = asset.compositeScore * 10000;
  return Math.round((base + variable) / 1000) * 1000;
};

// Determine horizon based on months to opportunity
const getHorizon = (months) => {
  if (months <= 12) return 1;
  if (months <= 36) return 2;
  return 3;
};

// Helper: Calculate metrics from a list of assets
const calculateMetrics = (assets) => {
  const pipelineValue = assets.reduce((sum, a) => sum + a.expectedValue, 0);
  const h1Value = assets.filter(a => a.currentHorizon === 1).reduce((sum, a) => sum + a.expectedValue, 0);
  const h2Value = assets.filter(a => a.currentHorizon === 2).reduce((sum, a) => sum + a.expectedValue, 0);
  const h3Value = assets.filter(a => a.currentHorizon === 3).reduce((sum, a) => sum + a.expectedValue, 0);

  // Mock resource req (FTEs) proportional to active assets
  const resourceReq = Number((assets.length * 0.5).toFixed(1));

  // Concentration (mock)
  const concentration = 65;

  // Alignment: average score
  const alignment = Math.round(assets.reduce((sum, a) => sum + a.score, 0) / (assets.length || 1));

  return {
    pipelineValue,
    h1Value,
    h2Value,
    h3Value,
    resourceReq,
    concentration,
    alignment
  };
};

function PipelineView({ onSelectAsset }) {
  const [currentScenario, setCurrentScenario] = useState('baseline');
  const [showCompare, setShowCompare] = useState(false);

  // 1. Transform mockData assets into pipeline format
  const basePipelineAssets = useMemo(() => {
    return mockDataRaw.assets.map(asset => {
      const months = asset.dimensions.timeToOpportunity.months;
      return {
        id: asset.id,
        // Keep reference to original for selection
        originalAsset: asset,

        // Pipeline specific fields
        title: asset.title,
        score: asset.compositeScore,
        scoreLevel: getScoreLevel(asset.compositeScore),
        discipline: asset.discipline,
        type: asset.type,
        faculty: asset.faculty,

        // Derived fields
        expectedValue: estimateValue(asset),
        horizonPosition: getHorizon(months),
        monthsToRevenue: months,
        successProbability: asset.dimensions.commercializationReadiness.score / 100,
        currentStage: `TRL ${asset.dimensions.commercializationReadiness.trl}`,
        milestones: [] // Could be populated if data existed
      };
    });
  }, []);

  // 2. Define Scenarios (generated dynamically to match current assets)
  const currentScenarios = useMemo(() => {
    const baselineAssets = basePipelineAssets.map(a => ({
      ...a,
      currentHorizon: a.horizonPosition,
      currentDiscipline: a.discipline
    }));

    // Example alternate scenario: Accelerate "Environment" or "Engineering" assets
    const climateFocusAssets = basePipelineAssets.map(a => {
      let h = a.horizonPosition;
      if (a.discipline === 'Engineering' || a.discipline === 'Materials Science') {
        h = Math.max(1, h - 1); // Accelerate
      }
      return {
        ...a,
        currentHorizon: h,
        currentDiscipline: a.discipline
      }
    });

    const quickWinsAssets = basePipelineAssets.map(a => {
      let h = a.horizonPosition;
      if (a.monthsToRevenue < 24) {
        h = 1; // Anything under 2y becomes immediate focus
      }
      return {
        ...a,
        currentHorizon: h,
        currentDiscipline: a.discipline
      }
    });

    return {
      baseline: {
        name: "Baseline",
        description: "Current portfolio as-is",
        assets: baselineAssets,
        metrics: calculateMetrics(baselineAssets)
      },
      climateFocus: {
        name: "Climate Focus Rebalancing",
        description: "Accelerate Engineering & Materials innovations",
        assets: climateFocusAssets,
        metrics: calculateMetrics(climateFocusAssets)
      },
      quickWins: {
        name: "Quick Wins Strategy",
        description: "Emphasize near-term revenue opportunities",
        assets: quickWinsAssets,
        metrics: calculateMetrics(quickWinsAssets)
      }
    };
  }, [basePipelineAssets]);

  // Get current scenario data
  const scenarioData = currentScenarios[currentScenario];
  const positionedAssets = scenarioData.assets;

  // Handle scenario change
  const handleScenarioChange = (scenarioKey) => {
    setCurrentScenario(scenarioKey);
  };

  // Handle asset selection - pass the original complete asset
  const handleSelectAsset = (pipelineAsset) => {
    if (pipelineAsset.originalAsset) {
      onSelectAsset(pipelineAsset.originalAsset);
    }
  };

  // Handle export
  const handleExport = () => {
    alert('Forecast exported! (Demo: In production, this would generate a PDF report)');
  };

  // Handle compare
  const handleCompare = () => {
    setShowCompare(!showCompare);
    if (!showCompare) {
      alert('Compare view coming soon! (Demo: Would show side-by-side scenario comparison)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Plan</h2>
          <p className="text-sm text-gray-600 mt-1">
            Visualize and plan your 3-year innovation portfolio through scenario planning
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScenarioSelector
            currentScenario={currentScenario}
            scenarios={currentScenarios}
            onScenarioChange={handleScenarioChange}
          />
          <button
            onClick={handleCompare}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <GitCompare size={18} />
            <span className="text-sm font-medium">Compare Scenarios</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FileDown size={18} />
            <span className="text-sm font-medium">Export Forecast</span>
          </button>
        </div>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel metrics={scenarioData.metrics} />

      {/* Timeline View */}
      <TimelineView
        assets={positionedAssets}
        onSelectAsset={handleSelectAsset}
      />

      {/* Revenue Forecast */}
      <RevenueForecastChart
        assets={positionedAssets}
        scenarioName={scenarioData.name}
      />
    </div>
  );
}

export default PipelineView;
