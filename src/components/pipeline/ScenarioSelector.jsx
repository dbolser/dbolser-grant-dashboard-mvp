import { useState } from 'react';
import { ChevronDown, Plus, Save } from 'lucide-react';

function ScenarioSelector({ currentScenario, scenarios, onScenarioChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');

  const currentScenarioData = scenarios[currentScenario];

  const handleScenarioSelect = (scenarioKey) => {
    onScenarioChange(scenarioKey);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    setIsOpen(false);
    setShowSaveDialog(true);
  };

  const handleSave = () => {
    if (newScenarioName.trim()) {
      alert(`Scenario "${newScenarioName}" saved! (Demo: In production, this would persist the current configuration)`);
      setShowSaveDialog(false);
      setNewScenarioName('');
    }
  };

  const handleSaveCurrentChanges = () => {
    alert('Current changes saved! (Demo: In production, this would update the scenario configuration)');
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-indigo-300 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors min-w-[240px]"
        >
          <span className="flex-1 text-left">
            <span className="text-xs font-medium block text-indigo-600">Scenario:</span>
            <span className="text-sm font-semibold">{currentScenarioData.name}</span>
          </span>
          <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                Available Scenarios
              </div>

              {Object.entries(scenarios).map(([key, scenario]) => (
                <button
                  key={key}
                  onClick={() => handleScenarioSelect(key)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    currentScenario === key
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                      currentScenario === key
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {currentScenario === key && (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{scenario.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{scenario.description}</p>
                    </div>
                  </div>
                </button>
              ))}

              <div className="border-t border-gray-200 mt-2 pt-2 space-y-1">
                <button
                  onClick={handleCreateNew}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Plus size={16} />
                  <span>Create New Scenario</span>
                </button>
                <button
                  onClick={handleSaveCurrentChanges}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors font-medium"
                >
                  <Save size={16} />
                  <span>Save Current Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Save New Scenario Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create New Scenario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name *
                </label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g., Q1 2026 Strategy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  placeholder="Describe this scenario..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setNewScenarioName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!newScenarioName.trim()}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Scenario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ScenarioSelector;
