import {
  Search,
  Grid,
  List,
  Sliders,
  HelpCircle,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  Upload,
  Network,
  FileText,
} from "lucide-react";
import { getTheme } from "../config/themes";

function DashboardHeader({
  stats,
  mainView,
  onMainViewChange,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  filterOptions,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  onShowWeightPanel,
  onShowHelp,
  onApplyScenario,
  presetScenarios,
  activeScenario,
  theme,
  onUpload,
}) {
  const currentTheme = getTheme(theme);
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="text-white bg-black">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo.svg"
                alt="Enginuity Logo"
                className="w-auto h-24"
                style={{ aspectRatio: "4/2" }}
              />
              <div>
                <h1 className="text-2xl font-bold">
                  Commercial Opportunity Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-300">
                  Market Demand System for IP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onUpload}
                className="flex items-center gap-2 px-4 py-2 font-medium text-black transition-colors bg-white rounded-lg hover:bg-gray-100"
              >
                <Upload size={18} />
                <span>Upload Innovation Asset</span>
              </button>
              <button
                onClick={onShowWeightPanel}
                className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur"
              >
                <Sliders size={18} />
                <span className="font-medium">Adjust Weights</span>
              </button>
              <button
                onClick={onShowHelp}
                className="flex items-center gap-2 px-3 py-2 transition-colors rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur"
              >
                <HelpCircle size={18} />
                <span className="sr-only">Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container px-4 py-3 mx-auto">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Assets</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Critical Opportunities</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.critical}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">High Potential</p>
                <p className="text-lg font-bold text-gray-900">{stats.high}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="text-purple-600"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600">Average Score</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.avgScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-gray-200">
        <div className="container px-4 mx-auto">
          <div className="flex gap-1">
            <button
              onClick={() => onMainViewChange("portfolio")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
                mainView === "portfolio"
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BarChart3 size={18} />
              Assets
            </button>
            <button
              onClick={() => onMainViewChange("clusters")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
                mainView === "clusters"
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Network size={18} />
              Clusters
            </button>
            <button
              onClick={() => onMainViewChange("pipeline")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
                mainView === "pipeline"
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <TrendingUp size={18} />
              Portfolio
            </button>
            <button
              onClick={() => onMainViewChange("reports")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
                mainView === "reports"
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileText size={18} />
              Reports
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls (only show for portfolio view) */}
      {mainView === "portfolio" && (
        <div className="container px-4 py-4 mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search
                  className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by title, faculty, or ID..."
                  value={filters.search}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, search: e.target.value })
                  }
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Asset Type Filter */}
            <select
              value={filters.type}
              onChange={(e) =>
                onFiltersChange({ ...filters, type: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {filterOptions.types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Discipline Filter */}
            <select
              value={filters.discipline}
              onChange={(e) =>
                onFiltersChange({ ...filters, discipline: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Disciplines</option>
              {filterOptions.disciplines.map((disc) => (
                <option key={disc} value={disc}>
                  {disc}
                </option>
              ))}
            </select>

            {/* Score Range Filter */}
            <select
              value={filters.scoreRange}
              onChange={(e) =>
                onFiltersChange({ ...filters, scoreRange: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Scores</option>
              <option value="critical">Critical (80-100)</option>
              <option value="high">High (60-79)</option>
              <option value="moderate">Moderate (40-59)</option>
              <option value="low">Low (0-39)</option>
            </select>

            {/* Preset Scenarios */}
            <select
              value={activeScenario}
              onChange={(e) => onApplyScenario(e.target.value)}
              className="px-4 py-2 font-medium text-indigo-700 border border-indigo-300 rounded-lg bg-indigo-50 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="default">Default Weights</option>
              {Object.entries(presetScenarios).map(([key, scenario]) => (
                <option key={key} value={key}>
                  {scenario.name}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => onViewChange("grid")}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                  view === "grid"
                    ? "bg-white shadow text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid size={18} />
                <span className="text-sm font-medium">Grid</span>
              </button>
              <button
                onClick={() => onViewChange("table")}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                  view === "table"
                    ? "bg-white shadow text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={18} />
                <span className="text-sm font-medium">Table</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;
