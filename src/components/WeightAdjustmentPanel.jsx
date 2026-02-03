import { useState } from 'react';
import { X, RotateCcw, Save, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

function WeightAdjustmentPanel({
  weights,
  onWeightChange,
  onReset,
  onClose,
  onApplyScenario,
  onSaveScenario,
  presetScenarios,
  savedScenarios,
  activeScenario,
  topAffectedAssets,
  sensitivity
}) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const isValid = Math.abs(totalWeight - 100) < 0.01;

  const dimensionLabels = {
    marketDemand: 'Investment Appetite',
    competitivePosition: 'Competitive Positioning',
    fundingAlignment: 'Funding Alignment',
    timeToOpportunity: 'Time to Opportunity',
    commercializationReadiness: 'Commercialization Readiness',
    strategicFit: 'Strategic Fit'
  };

  const handleSave = () => {
    if (scenarioName.trim()) {
      onSaveScenario(scenarioName, scenarioDescription);
      setShowSaveDialog(false);
      setScenarioName('');
      setScenarioDescription('');
    }
  };

  // Get most affected assets (largest rank changes)
  const mostAffected = topAffectedAssets
    .map(asset => ({
      ...asset,
      rankChange: sensitivity[asset.id] || 0
    }))
    .sort((a, b) => Math.abs(b.rankChange) - Math.abs(a.rankChange))
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Adjust Scoring Weights</h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize how dimensions contribute to the composite score
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Total Weight Indicator */}
          <div className={`card ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2`}>
            <div className="flex items-center gap-3">
              {isValid ? (
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  ✓
                </div>
              ) : (
                <AlertTriangle className="text-red-500" size={40} />
              )}
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  Total Weight: <span className={isValid ? 'text-green-700' : 'text-red-700'}>{totalWeight}%</span>
                </p>
                <p className="text-sm text-gray-600">
                  {isValid ? 'Weights are properly balanced' : 'Weights must sum to exactly 100%'}
                </p>
              </div>
            </div>
          </div>

          {/* Weight Sliders */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Dimension Weights</h3>
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {dimensionLabels[key]}
                  </label>
                  <span className="text-lg font-bold text-indigo-600">{value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={value}
                  onChange={(e) => onWeightChange(key, parseInt(e.target.value))}
                  className="input-range"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Preset Scenarios */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Preset Scenarios</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(presetScenarios).map(([key, scenario]) => (
                <button
                  key={key}
                  onClick={() => onApplyScenario(key)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    activeScenario === key
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <p className="font-semibold text-sm">{scenario.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Custom Scenarios */}
          {savedScenarios.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Your Saved Scenarios</h3>
              <div className="space-y-2">
                {savedScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      onWeightChange('marketDemand', scenario.weights.marketDemand);
                      onWeightChange('competitivePosition', scenario.weights.competitivePosition);
                      onWeightChange('fundingAlignment', scenario.weights.fundingAlignment);
                      onWeightChange('timeToOpportunity', scenario.weights.timeToOpportunity);
                      onWeightChange('commercializationReadiness', scenario.weights.commercializationReadiness);
                      onWeightChange('strategicFit', scenario.weights.strategicFit);
                    }}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-300 text-left transition-all"
                  >
                    <p className="font-semibold text-sm">{scenario.name}</p>
                    {scenario.description && (
                      <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sensitivity Analysis */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-lg mb-3">Sensitivity Analysis</h3>
            <p className="text-sm text-gray-700 mb-3">
              Assets most affected by current weight adjustments:
            </p>
            <div className="space-y-2">
              {mostAffected.map(asset => {
                if (asset.rankChange === 0) return null;
                return (
                  <div key={asset.id} className="flex items-center justify-between bg-white p-2 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{asset.title}</p>
                      <p className="text-xs text-gray-600">{asset.id}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      asset.rankChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.rankChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {Math.abs(asset.rankChange)} {Math.abs(asset.rankChange) === 1 ? 'position' : 'positions'}
                    </div>
                  </div>
                );
              })}
              {mostAffected.every(a => a.rankChange === 0) && (
                <p className="text-sm text-gray-600 italic">No significant ranking changes detected</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onReset}
              className="btn-secondary flex items-center gap-2 flex-1"
            >
              <RotateCcw size={16} />
              Reset to Default
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              disabled={!isValid}
              className="btn-primary flex items-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              Save Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Save Scenario Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Save Weight Scenario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name *
                </label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g., Q1 2026 Priorities"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={scenarioDescription}
                  onChange={(e) => setScenarioDescription(e.target.value)}
                  placeholder="Describe this scenario..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!scenarioName.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeightAdjustmentPanel;
