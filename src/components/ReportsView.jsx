import { useState } from 'react';
import { FileText, Download, Settings, CheckCircle } from 'lucide-react';

// Report templates data
const reportTemplates = [
  {
    id: 'annual-impact',
    name: 'Annual Impact Report',
    icon: '📊',
    description: 'Comprehensive year-end report with metrics, highlights, and regional impact',
    badge: 'Most Used',
    badgeColor: 'bg-green-100 text-green-800'
  },
  {
    id: 'quarterly-board',
    name: 'Quarterly Board Report',
    icon: '📈',
    description: 'Executive summary for board meetings with portfolio health and key decisions'
  },
  {
    id: 'autm-survey',
    name: 'AUTM Survey Report',
    icon: '📋',
    description: 'Pre-populated annual licensing survey with required metrics',
    badge: 'Annual',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'budget-justification',
    name: 'Budget Justification',
    icon: '💰',
    description: 'ROI analysis and resource allocation justification for leadership'
  },
  {
    id: 'grant-application',
    name: 'Grant Application Support',
    icon: '🎯',
    description: 'Portfolio evidence and impact metrics for funding proposals'
  },
  {
    id: 'strategic-review',
    name: 'Strategic Review',
    icon: '🔍',
    description: 'Deep-dive analysis of portfolio performance and strategic alignment'
  }
];

function ReportsView() {
  const [selectedTemplate, setSelectedTemplate] = useState('annual-impact');
  const [selectedPeriod, setSelectedPeriod] = useState('fy-2025');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedBranding, setSelectedBranding] = useState('university');
  const [showSuccess, setShowSuccess] = useState(false);
  const [includedSections, setIncludedSections] = useState({
    executiveSummary: true,
    portfolioPerformance: true,
    financialMetrics: true,
    strategicInitiatives: true,
    economicImpact: true,
    caseStudies: false,
    appendix: false
  });

  const selectedTemplateData = reportTemplates.find(t => t.id === selectedTemplate);

  const handleGenerateReport = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const toggleSection = (section) => {
    if (section === 'executiveSummary') return; // Always required
    setIncludedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-280px)]">
      {/* Left Panel: Template List */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Report Templates</h2>
          <div className="space-y-3">
            {reportTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                      {template.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${template.badgeColor}`}>
                          {template.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Configuration & Preview */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedTemplateData.name}</h2>
                <p className="text-sm text-gray-600">Configure settings and preview your report</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Advanced customization options would appear in a modal in the full version.')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Settings size={18} />
                  Customize Settings
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-green-900">Report generated successfully!</p>
                  <p className="text-xs text-green-700 mt-1">
                    In the full version, your {selectedFormat.toUpperCase()} report would download automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Configuration */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Time Period */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="fy-2025">Fiscal Year 2025 (Apr 1, 2024 - Mar 31, 2025)</option>
                  <option value="cy-2025">Calendar Year 2025 (Jan 1 - Dec 31, 2025)</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {/* Output Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Output Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="pdf">PDF Report</option>
                  <option value="pptx">PowerPoint Presentation</option>
                  <option value="xlsx">Excel Data Export</option>
                  <option value="web">Interactive Web Version</option>
                </select>
              </div>

              {/* Branding */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Branding</label>
                <select
                  value={selectedBranding}
                  onChange={(e) => setSelectedBranding(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="university">University of Innovation (Default Logo)</option>
                  <option value="custom">Custom Logo (Upload...)</option>
                  <option value="enginuity">Enginuity Branding Only</option>
                </select>
              </div>

              {/* Sections to Include */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sections to Include</label>
                <div className="space-y-2">
                  {[
                    { id: 'executiveSummary', label: 'Executive Summary', disabled: true },
                    { id: 'portfolioPerformance', label: 'Portfolio Performance' },
                    { id: 'financialMetrics', label: 'Financial Metrics' },
                    { id: 'strategicInitiatives', label: 'Strategic Initiatives' },
                    { id: 'economicImpact', label: 'Regional Economic Impact' },
                    { id: 'caseStudies', label: 'Detailed Case Studies' },
                    { id: 'appendix', label: 'Appendix: Full Asset List' }
                  ].map(section => (
                    <label key={section.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={includedSections[section.id]}
                        onChange={() => toggleSection(section.id)}
                        disabled={section.disabled}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={section.disabled ? 'text-gray-500' : 'text-gray-700'}>
                        {section.label}
                        {section.disabled && ' (Required)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Report Preview */}
          {selectedTemplate === 'annual-impact' && <AnnualImpactPreview />}
          {selectedTemplate === 'quarterly-board' && <QuarterlyBoardPreview />}
          {selectedTemplate !== 'annual-impact' && selectedTemplate !== 'quarterly-board' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">
                Preview for <span className="font-semibold">{selectedTemplateData.name}</span> will be available in the full version.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Annual Impact Report Preview Component
function AnnualImpactPreview() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Preview Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Technology Transfer Office</p>
          <h3 className="text-xl font-bold text-gray-900">Annual Impact Report</h3>
          <p className="text-sm text-gray-600 mt-1">Fiscal Year 2025 (Apr 1, 2024 - Mar 31, 2025)</p>
          <p className="text-xs text-gray-500 mt-1">Generated: January 26, 2026</p>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6 space-y-8">
        {/* Executive Summary */}
        <section>
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
            EXECUTIVE SUMMARY
          </h4>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Invention Disclosures', value: '156', change: '+8%', icon: '📝' },
              { label: 'Licensing Revenue', value: '£1.28M', change: '+15%', icon: '💰' },
              { label: 'Licenses Executed', value: '8', change: '+2', icon: '📄' },
              { label: 'Startups Formed', value: '3', change: '+1', icon: '🚀' }
            ].map((metric, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl mb-2">{metric.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-green-600 font-medium mb-1">{metric.change} YoY</p>
                <p className="text-xs text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <h5 className="text-sm font-semibold text-indigo-900 mb-3">Key Highlights:</h5>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Strengthened Engineering portfolio to 40% of assets, up from 32%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Improved portfolio efficiency by 12 points through strategic asset pruning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Executed £850K landmark license with GlobalTech Industries for AI semiconductor technology</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Achieved 78% strategic alignment score vs. target of 70%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Secured £4.2M in follow-on funding for spinouts, supporting 45 regional jobs</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Portfolio Performance */}
        <section>
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
            PORTFOLIO PERFORMANCE
          </h4>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Active Assets', value: '28', sublabel: 'In portfolio' },
              { label: 'Average Score', value: '73/100', sublabel: 'Portfolio quality' },
              { label: 'Pipeline Value', value: '£4.2M', sublabel: 'Expected revenue' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.sublabel}</p>
              </div>
            ))}
          </div>

          {/* Portfolio Composition Placeholder */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200 text-center">
            <p className="text-sm font-semibold text-indigo-900 mb-2">Portfolio Composition by Discipline</p>
            <div className="flex justify-center items-center gap-6 mt-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                  40%
                </div>
                <p className="text-xs font-medium text-gray-700">Engineering</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                  35%
                </div>
                <p className="text-xs font-medium text-gray-700">Life Sciences</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                  25%
                </div>
                <p className="text-xs font-medium text-gray-700">Computer Science</p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Initiatives */}
        <section>
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
            STRATEGIC INITIATIVES
          </h4>

          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Initiative
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Impact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Climate & Sustainability Focus', status: '✅ Complete', impact: '18% of portfolio', statusColor: 'text-green-700' },
                  { name: 'Portfolio Efficiency Program', status: '✅ Complete', impact: '£58K saved annually', statusColor: 'text-green-700' },
                  { name: 'Industry Partnership Expansion', status: '🔄 In Progress', impact: '+50% YoY partnerships', statusColor: 'text-blue-700' },
                  { name: 'Researcher Engagement Campaign', status: '✅ Complete', impact: '+8% disclosure rate', statusColor: 'text-green-700' }
                ].map((initiative, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{initiative.name}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${initiative.statusColor}`}>{initiative.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{initiative.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Regional Economic Impact */}
        <section>
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
            REGIONAL ECONOMIC IMPACT
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Jobs Supported', value: '45', icon: '👥' },
              { label: 'Products Launched', value: '2', icon: '🎁' },
              { label: 'Capital Raised by Spinouts', value: '£2.4M', icon: '💵' },
              { label: 'Active Corporate Partnerships', value: '12', icon: '🤝' }
            ].map((impact, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl">{impact.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{impact.value}</p>
                  <p className="text-sm text-green-700">{impact.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Sections Indicator */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Additional sections (Financial Metrics, Case Studies, Appendices) would appear in the full report...
          </p>
        </div>
      </div>
    </div>
  );
}

// Quarterly Board Report Preview Component
function QuarterlyBoardPreview() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Preview Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Technology Transfer Office</p>
          <h3 className="text-xl font-bold text-gray-900">Quarterly Board Report</h3>
          <p className="text-sm text-gray-600 mt-1">Q4 FY2025 (Jan - Mar 2025)</p>
          <p className="text-xs text-gray-500 mt-1">Board Meeting: March 28, 2025</p>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <section>
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
            QUARTERLY HIGHLIGHTS
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'New Disclosures', value: '42', change: '+12% vs Q3', positive: true },
              { label: 'Licensing Activity', value: '3 deals', change: '£320K total value', positive: true },
              { label: 'Portfolio Health', value: '73/100', change: '+2 pts vs Q3', positive: true },
              { label: 'Resource Utilization', value: '4.8 FTE', change: 'On target', positive: true }
            ].map((metric, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm font-medium text-gray-900 mb-1">{metric.label}</p>
                <p className={`text-xs font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Decisions Required */}
        <section>
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
            DECISIONS REQUIRED
          </h4>

          <div className="space-y-3">
            {[
              {
                title: 'CleanTech Spinout Capital Request',
                description: 'Battery recycling technology requires £150K seed funding to reach pilot phase',
                recommendation: 'Approve with conditions'
              },
              {
                title: 'Patent Portfolio Pruning',
                description: '8 low-value patents identified for abandonment, saving £28K annually',
                recommendation: 'Approve abandonment'
              }
            ].map((decision, idx) => (
              <div key={idx} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-yellow-900 mb-1">{decision.title}</h5>
                    <p className="text-sm text-yellow-800 mb-2">{decision.description}</p>
                    <p className="text-xs font-medium text-yellow-900">
                      Recommendation: <span className="font-bold">{decision.recommendation}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Risk/Opportunity Highlights */}
        <section>
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">
            RISKS & OPPORTUNITIES
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <span>🔴</span> Key Risks
              </h5>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• 2 major patents pending office actions (6-month timeline)</li>
                <li>• Competitor filed similar disclosure in quantum computing</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span>🟢</span> Key Opportunities
              </h5>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• GlobalTech expressing interest in 3 additional assets</li>
                <li>• Federal climate tech grant opens Q1 2026 (£2M available)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Additional Sections Indicator */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Full quarterly metrics and detailed portfolio analysis available in appendix...
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReportsView;
