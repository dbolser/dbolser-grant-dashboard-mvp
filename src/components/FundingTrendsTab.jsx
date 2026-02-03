import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function FundingTrendsTab({ asset }) {
  const trends = asset.fundingTrends;

  if (!trends) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No funding trend data available for this asset.</p>
      </div>
    );
  }

  const labels = trends.quarters.map(q => q.period);

  const fundingChartData = {
    labels,
    datasets: [{
      label: 'Total Funding (£M)',
      data: trends.quarters.map(q => q.funding),
      borderColor: '#000',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      pointBackgroundColor: '#000',
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.2,
      fill: true,
      borderWidth: 2
    }]
  };

  const opportunitiesChartData = {
    labels,
    datasets: [{
      label: 'Number of Opportunities',
      data: trends.quarters.map(q => q.opportunities),
      borderColor: '#000',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      pointBackgroundColor: '#000',
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.2,
      fill: true,
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.06)' },
        ticks: {
          font: { family: 'Outfit, sans-serif', size: 11 },
          color: '#6b7280'
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Outfit, sans-serif', size: 10 },
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Explanation */}
      <div className="card bg-blue-50 border-l-4 border-blue-500">
        <p className="text-sm text-blue-800">
          This chart shows the aggregate value of relevant funding opportunities
          matched to this asset over the past 5 years, based on keyword matching
          and technology alignment to government, foundation, and corporate
          funding programs.
        </p>
      </div>

      {/* Chart 1: Total Funding */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Total Funding Availability (£M)</h3>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <Line data={fundingChartData} options={chartOptions} />
        </div>
      </div>

      {/* Chart 2: Number of Opportunities */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Number of Opportunities</h3>
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <Line data={opportunitiesChartData} options={chartOptions} />
        </div>
      </div>

      {/* Key Insights */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <ul className="space-y-3 text-sm">
          <li>
            <strong>Peak funding:</strong> {trends.insights.peak.period} (£{trends.insights.peak.funding.toFixed(1)}M across {trends.insights.peak.opportunities} opportunities)
          </li>
          <li>
            <strong>Recent trend:</strong> {trends.insights.trend} ({trends.insights.trendPercentage})
          </li>
          <li>
            <strong>Major drivers:</strong>
            <ul className="ml-4 mt-2 space-y-1">
              {trends.insights.drivers.map((driver, i) => (
                <li key={i} className="text-gray-700 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FundingTrendsTab;
