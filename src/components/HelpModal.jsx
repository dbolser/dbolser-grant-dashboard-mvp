import { X, Target, Sliders, DollarSign, BarChart3, FileText, Zap } from 'lucide-react';

function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Guide</h2>
            <p className="text-sm text-gray-600 mt-1">
              Learn how to use the Commercial Opportunity Dashboard effectively
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Overview */}
          <section>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Target size={24} className="text-indigo-600" />
              What is this Dashboard?
            </h3>
            <p className="text-gray-700">
              The Commercial Opportunity Dashboard helps University Technology Transfer Office (TTO)
              Licensing Managers identify and prioritize innovation portfolio assets based on commercial
              opportunity scores. It demonstrates Enginuity's AI-native IP intelligence platform capabilities.
            </p>
          </section>

          {/* Key Features */}
          <section>
            <h3 className="text-xl font-bold mb-4">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                icon={<BarChart3 className="text-indigo-600" />}
                title="Composite Scoring"
                description="Each asset receives a 0-100 composite score based on six weighted dimensions: Investment Appetite, Competitive Position, Funding Alignment, Time to Opportunity, Commercialization Readiness, and Strategic Fit."
              />
              <FeatureCard
                icon={<Sliders className="text-indigo-600" />}
                title="Adjustable Weights"
                description="Customize how dimensions contribute to scores by adjusting weights. Watch rankings update in real-time and see which assets are most sensitive to your priorities."
              />
              <FeatureCard
                icon={<DollarSign className="text-indigo-600" />}
                title="Funding Matches"
                description="View matched funding opportunities for each asset, including government grants, tax incentives, philanthropic funding, and industry partnerships."
              />
              <FeatureCard
                icon={<FileText className="text-indigo-600" />}
                title="Full Transparency"
                description="Explore data sources, scoring logic, and detailed breakdowns for every score. Understand exactly how each number is calculated."
              />
            </div>
          </section>

          {/* Score Bands */}
          <section>
            <h3 className="text-xl font-bold mb-4">Score Interpretation</h3>
            <div className="space-y-3">
              <ScoreBandInfo
                range="80-100"
                label="Critical Opportunity"
                color="bg-green-100 text-green-800 border-green-300"
                description="High-priority assets with strong commercial potential across multiple dimensions. These deserve immediate attention."
              />
              <ScoreBandInfo
                range="60-79"
                label="High Potential"
                color="bg-blue-100 text-blue-800 border-blue-300"
                description="Solid opportunities with good prospects. Worth pursuing but may require more development or strategic alignment."
              />
              <ScoreBandInfo
                range="40-59"
                label="Moderate Opportunity"
                color="bg-yellow-100 text-yellow-800 border-yellow-300"
                description="Assets with mixed characteristics. May be worth monitoring or investing in specific improvements."
              />
              <ScoreBandInfo
                range="0-39"
                label="Low Priority"
                color="bg-red-100 text-red-800 border-red-300"
                description="Limited commercial potential based on current assessment. Consider for portfolio pruning or major repositioning."
              />
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap size={24} className="text-yellow-500" />
              Quick Start Scenarios
            </h3>
            <div className="space-y-3">
              <ScenarioCard
                title="ROI Maximizer"
                description="Focus on assets with highest revenue potential by emphasizing Investment Appetite and Competitive Position."
              />
              <ScenarioCard
                title="Quick Wins"
                description="Find near-term opportunities by prioritizing Time to Opportunity and Funding Alignment."
              />
              <ScenarioCard
                title="Grant Season"
                description="Maximize funding success by heavily weighting Funding Alignment and showing upcoming deadlines."
              />
              <ScenarioCard
                title="Portfolio Pruning"
                description="Filter for low-scoring assets to identify candidates for abandonment or strategic pivot."
              />
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-xl font-bold mb-4">Pro Tips</h3>
            <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
              <Tip text="Click any asset card or table row to see full details, including dimension breakdowns, funding matches, and data sources." />
              <Tip text="Use the preset scenarios in the top bar to quickly switch between different prioritization strategies." />
              <Tip text="Adjust weights to reflect your organization's strategic priorities and see how rankings change in real-time." />
              <Tip text="Check the 'Sensitivity Analysis' in the weight panel to see which assets are most affected by your changes." />
              <Tip text="Export detailed reports for stakeholder presentations and decision-making discussions." />
              <Tip text="All data includes confidence levels - pay attention to these when making high-stakes decisions." />
            </div>
          </section>

          {/* About */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold mb-3">About This Demonstrator</h3>
            <p className="text-gray-700 mb-3">
              This dashboard demonstrates Enginuity's AI-native approach to IP intelligence. It showcases how
              technology transfer offices can leverage data-driven insights to make better commercialization decisions.
            </p>
            <p className="text-sm text-gray-600">
              Built with React, Tailwind CSS, and Recharts. All data is simulated for demonstration purposes.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button onClick={onClose} className="btn-primary w-full">
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreBandInfo({ range, label, color, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-32">
        <span className={`score-badge ${color} inline-block`}>{range}</span>
        <p className="text-xs font-medium mt-1">{label}</p>
      </div>
      <p className="text-sm text-gray-700 flex-1">{description}</p>
    </div>
  );
}

function ScenarioCard({ title, description }) {
  return (
    <div className="card bg-gray-50">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Tip({ text }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-indigo-600 font-bold flex-shrink-0">•</span>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}

export default HelpModal;
