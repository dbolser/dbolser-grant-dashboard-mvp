import { DollarSign, Users, AlertTriangle, Target } from "lucide-react";

function MetricsPanel({ metrics }) {
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `£${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `£${(value / 1000).toFixed(0)}K`;
    }
    return `£${value}`;
  };

  const getConcentrationColor = (concentration) => {
    if (concentration > 65) return "text-red-600";
    if (concentration > 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getAlignmentColor = (alignment) => {
    if (alignment >= 80) return "text-green-600";
    if (alignment >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="card">
      <div className="grid grid-cols-4 gap-6">
        {/* Pipeline Value */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase">
              Pipeline Value
            </h3>
          </div>
          <p className="mb-2 text-3xl font-bold text-gray-900">
            {formatCurrency(metrics.pipelineValue)}
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>H1: {formatCurrency(metrics.h1Value)}</p>
            <p>H2: {formatCurrency(metrics.h2Value)}</p>
            <p>H3: {formatCurrency(metrics.h3Value)}</p>
          </div>
        </div>

        {/* Resource Requirements */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase">
              Resource Req
            </h3>
          </div>
          <p className="mb-2 text-3xl font-bold text-gray-900">
            {metrics.resourceReq} FTE
          </p>
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 transition-all bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min((metrics.resourceReq / 8) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((metrics.resourceReq / 8) * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500">of 8 FTE capacity</p>
          </div>
        </div>

        {/* Concentration Risk */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase">
              Concentration
            </h3>
          </div>
          <p
            className={`text-3xl font-bold mb-2 ${getConcentrationColor(metrics.concentration)}`}
          >
            {metrics.concentration}%
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Top 3 assets</p>
            <p
              className={`text-xs font-medium ${metrics.concentration > 65 ? "text-red-600" : "text-gray-600"}`}
            >
              {metrics.concentration > 65 ? "Risk: High" : "Risk: Moderate"}
            </p>
          </div>
        </div>

        {/* Strategic Alignment */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="text-purple-600" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase">
              Alignment
            </h3>
          </div>
          <p
            className={`text-3xl font-bold mb-2 ${getAlignmentColor(metrics.alignment)}`}
          >
            {metrics.alignment}%
            <span className="ml-2 text-lg">
              {metrics.alignment >= 80
                ? "✓"
                : metrics.alignment >= 70
                  ? "○"
                  : "⚠"}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            {metrics.alignment >= 80
              ? "Strong alignment"
              : metrics.alignment >= 70
                ? "Good alignment"
                : "Needs improvement"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;
