import { useMemo } from 'react';

function RevenueForecastChart({ assets, scenarioName }) {
  // Generate quarterly revenue forecast with confidence bands
  const quarterlyData = useMemo(() => {
    const quarters = [];
    const years = [2026, 2027, 2028];

    years.forEach(year => {
      for (let q = 1; q <= 4; q++) {
        quarters.push({
          label: `Q${q} ${year}`,
          year,
          quarter: q,
          revenue: 0,
          optimistic: 0,
          pessimistic: 0,
          quarterIndex: quarters.length
        });
      }
    });

    // Distribute asset revenues across quarters based on horizons
    assets.forEach(asset => {
      const expectedRevenue = asset.expectedValue * asset.successProbability;
      const horizon = asset.currentHorizon;

      // Calculate confidence bounds based on success probability and time horizon
      // Lower success probability = wider confidence band
      // Further time horizon = wider confidence band
      const baseUncertainty = 0.15; // 15% base uncertainty
      const probabilityFactor = 1 - asset.successProbability; // Higher uncertainty for lower probability
      const horizonFactor = horizon * 0.1; // 10% additional uncertainty per horizon
      const totalUncertainty = baseUncertainty + probabilityFactor * 0.3 + horizonFactor;

      const optimisticRevenue = expectedRevenue * (1 + totalUncertainty);
      const pessimisticRevenue = expectedRevenue * (1 - totalUncertainty);

      if (horizon === 1) {
        // H1: 0-12 months = Q1-Q4 2026
        const perQuarter = expectedRevenue / 4;
        const perQuarterOptimistic = optimisticRevenue / 4;
        const perQuarterPessimistic = pessimisticRevenue / 4;
        for (let i = 0; i < 4; i++) {
          quarters[i].revenue += perQuarter;
          quarters[i].optimistic += perQuarterOptimistic;
          quarters[i].pessimistic += perQuarterPessimistic;
        }
      } else if (horizon === 2) {
        // H2: 12-24 months = Q1-Q4 2027
        const perQuarter = expectedRevenue / 4;
        const perQuarterOptimistic = optimisticRevenue / 4;
        const perQuarterPessimistic = pessimisticRevenue / 4;
        for (let i = 4; i < 8; i++) {
          quarters[i].revenue += perQuarter;
          quarters[i].optimistic += perQuarterOptimistic;
          quarters[i].pessimistic += perQuarterPessimistic;
        }
      } else if (horizon === 3) {
        // H3: 24-36 months = Q1-Q4 2028
        const perQuarter = expectedRevenue / 4;
        const perQuarterOptimistic = optimisticRevenue / 4;
        const perQuarterPessimistic = pessimisticRevenue / 4;
        for (let i = 8; i < 12; i++) {
          quarters[i].revenue += perQuarter;
          quarters[i].optimistic += perQuarterOptimistic;
          quarters[i].pessimistic += perQuarterPessimistic;
        }
      }
    });

    return quarters;
  }, [assets]);

  // Calculate chart dimensions and scales
  // Use optimistic values to determine max scale so confidence band fits
  const maxRevenue = Math.max(...quarterlyData.map(q => q.optimistic));
  const chartWidth = 1000;
  const chartHeight = 300;
  const padding = { top: 20, right: 40, bottom: 60, left: 80 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Create path for line chart
  const linePath = useMemo(() => {
    const points = quarterlyData.map((q, i) => {
      const x = padding.left + (i / (quarterlyData.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - (q.revenue / maxRevenue) * innerHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return points;
  }, [quarterlyData, maxRevenue, innerWidth, innerHeight, padding]);

  // Create confidence band path (area between optimistic and pessimistic)
  const confidenceBandPath = useMemo(() => {
    // Upper bound (optimistic) - trace forward
    const upperPath = quarterlyData.map((q, i) => {
      const x = padding.left + (i / (quarterlyData.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - (q.optimistic / maxRevenue) * innerHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Lower bound (pessimistic) - trace backward to close the shape
    const lowerPath = quarterlyData.map((q, i) => {
      const reverseIndex = quarterlyData.length - 1 - i;
      const x = padding.left + (reverseIndex / (quarterlyData.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - (quarterlyData[reverseIndex].pessimistic / maxRevenue) * innerHeight;
      return `L ${x} ${y}`;
    }).join(' ');

    return upperPath + ' ' + lowerPath + ' Z';
  }, [quarterlyData, maxRevenue, innerWidth, innerHeight, padding]);

  // Format currency for Y-axis
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `£${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `£${(value / 1000).toFixed(0)}K`;
    }
    return `£${value}`;
  };

  // Y-axis ticks
  const yTicks = [0, maxRevenue * 0.33, maxRevenue * 0.67, maxRevenue];

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Revenue Forecast</h3>
        <p className="text-sm text-gray-600">Projected quarterly revenue - {scenarioName}</p>
      </div>

      <svg
        width={chartWidth}
        height={chartHeight}
        className="w-full h-auto"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        {/* Grid lines */}
        {yTicks.map((tick, i) => {
          const y = padding.top + innerHeight - (tick / maxRevenue) * innerHeight;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={padding.left + innerWidth}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => {
          const y = padding.top + innerHeight - (tick / maxRevenue) * innerHeight;
          return (
            <text
              key={i}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {formatCurrency(tick)}
            </text>
          );
        })}

        {/* Confidence Band - shaded area between optimistic and pessimistic bounds */}
        <path
          d={confidenceBandPath}
          fill="#10b981"
          opacity="0.15"
        />

        {/* Upper bound line (optimistic) - dashed */}
        <path
          d={quarterlyData.map((q, i) => {
            const x = padding.left + (i / (quarterlyData.length - 1)) * innerWidth;
            const y = padding.top + innerHeight - (q.optimistic / maxRevenue) * innerHeight;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.5"
        />

        {/* Lower bound line (pessimistic) - dashed */}
        <path
          d={quarterlyData.map((q, i) => {
            const x = padding.left + (i / (quarterlyData.length - 1)) * innerWidth;
            const y = padding.top + innerHeight - (q.pessimistic / maxRevenue) * innerHeight;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.5"
        />

        {/* Expected revenue line (center) - solid */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {quarterlyData.map((q, i) => {
          const x = padding.left + (i / (quarterlyData.length - 1)) * innerWidth;
          const y = padding.top + innerHeight - (q.revenue / maxRevenue) * innerHeight;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="white"
                stroke="#10b981"
                strokeWidth="2"
              />
              <title>{`${q.label}: ${formatCurrency(q.revenue)}`}</title>
            </g>
          );
        })}

        {/* X-axis labels (every other quarter) */}
        {quarterlyData.map((q, i) => {
          if (i % 2 !== 0) return null; // Show every other label
          const x = padding.left + (i / (quarterlyData.length - 1)) * innerWidth;
          return (
            <text
              key={i}
              x={x}
              y={padding.top + innerHeight + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {q.label}
            </text>
          );
        })}

        {/* Year labels */}
        <text
          x={padding.left + innerWidth * 0.17}
          y={padding.top + innerHeight + 45}
          textAnchor="middle"
          fontSize="13"
          fill="#374151"
          fontWeight="600"
        >
          2026
        </text>
        <text
          x={padding.left + innerWidth * 0.5}
          y={padding.top + innerHeight + 45}
          textAnchor="middle"
          fontSize="13"
          fill="#374151"
          fontWeight="600"
        >
          2027
        </text>
        <text
          x={padding.left + innerWidth * 0.83}
          y={padding.top + innerHeight + 45}
          textAnchor="middle"
          fontSize="13"
          fill="#374151"
          fontWeight="600"
        >
          2028
        </text>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend and Explanation */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-gray-600">Expected Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500 opacity-50" style={{ borderTop: '1.5px dashed #10b981' }}></div>
            <span className="text-gray-600">Optimistic/Pessimistic Bounds</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 opacity-15"></div>
            <span className="text-gray-600">Confidence Band</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 italic">
            Confidence band calculated based on asset success probabilities, time horizon uncertainty, and market risk factors.
            Wider bands indicate higher uncertainty in revenue projections.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RevenueForecastChart;
