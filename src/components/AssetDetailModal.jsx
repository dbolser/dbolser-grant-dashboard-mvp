import { useState } from 'react';
import { X, ExternalLink, TrendingUp, Calendar, DollarSign, AlertCircle, FileText, Database, BarChart3, Users } from 'lucide-react';
import CommercialContactsTab from './CommercialContactsTab';
import { getScoreBand, formatTimeToOpportunity, getCompetitivenessColor, getConfidenceColor, calculateCompositeScore } from '../utils/scoreCalculator';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function AssetDetailModal({ asset, onClose, currentWeights, contactsDatabase = [] }) {
  const [activeTab, setActiveTab] = useState('overview');
  const scoreBand = getScoreBand(asset.compositeScore);

  // Prepare data for radar chart
  const radarData = [
    {
      dimension: 'Investment Appetite',
      score: asset.dimensions.marketDemand.score,
      fullMark: 100
    },
    {
      dimension: 'Competitive Position',
      score: asset.dimensions.competitivePosition.score,
      fullMark: 100
    },
    {
      dimension: 'Funding Alignment',
      score: asset.dimensions.fundingAlignment.score,
      fullMark: 100
    },
    {
      dimension: 'Time to Opp.',
      score: asset.dimensions.timeToOpportunity.score,
      fullMark: 100
    },
    {
      dimension: 'Comm. Readiness',
      score: asset.dimensions.commercializationReadiness.score,
      fullMark: 100
    },
    {
      dimension: 'Strategic Fit',
      score: asset.dimensions.strategicFit.score,
      fullMark: 100
    }
  ];

  // Prepare data for dimension breakdown bar chart
  const dimensionBreakdown = [
    {
      name: 'Investment\nAppetite',
      score: asset.dimensions.marketDemand.score,
      weight: currentWeights.marketDemand,
      contribution: Math.round(asset.dimensions.marketDemand.score * currentWeights.marketDemand / 100)
    },
    {
      name: 'Competitive\nPosition',
      score: asset.dimensions.competitivePosition.score,
      weight: currentWeights.competitivePosition,
      contribution: Math.round(asset.dimensions.competitivePosition.score * currentWeights.competitivePosition / 100)
    },
    {
      name: 'Funding\nAlignment',
      score: asset.dimensions.fundingAlignment.score,
      weight: currentWeights.fundingAlignment,
      contribution: Math.round(asset.dimensions.fundingAlignment.score * currentWeights.fundingAlignment / 100)
    },
    {
      name: 'Time to\nOpportunity',
      score: asset.dimensions.timeToOpportunity.score,
      weight: currentWeights.timeToOpportunity,
      contribution: Math.round(asset.dimensions.timeToOpportunity.score * currentWeights.timeToOpportunity / 100)
    },
    {
      name: 'Comm.\nReadiness',
      score: asset.dimensions.commercializationReadiness.score,
      weight: currentWeights.commercializationReadiness,
      contribution: Math.round(asset.dimensions.commercializationReadiness.score * currentWeights.commercializationReadiness / 100)
    },
    {
      name: 'Strategic\nFit',
      score: asset.dimensions.strategicFit.score,
      weight: currentWeights.strategicFit,
      contribution: Math.round(asset.dimensions.strategicFit.score * currentWeights.strategicFit / 100)
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex-1 pr-4">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">{asset.title}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600">{asset.id}</span>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">{asset.type}</span>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">{asset.discipline}</span>
              <span className={`score-badge ${scoreBand.bgColor} ${scoreBand.color} ${scoreBand.borderColor}`}>
                {scoreBand.name}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-600">Composite Score</p>
              <div className={`score-badge ${scoreBand.bgColor} ${scoreBand.color} ${scoreBand.borderColor} text-4xl font-bold px-6 py-3`}>
                {asset.compositeScore}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'dimensions', label: 'Score Dimensions', icon: BarChart3 },
              { id: 'commercial-contacts', label: 'Commercial Contacts', icon: Users },
              { id: 'funding', label: 'Grant Matches', icon: DollarSign },
              { id: 'data-sources', label: 'Data Sources', icon: Database },
              { id: 'scoring-logic', label: 'Scoring Logic', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab asset={asset} radarData={radarData} />
          )}
          {activeTab === 'dimensions' && (
            <DimensionsTab asset={asset} dimensionBreakdown={dimensionBreakdown} currentWeights={currentWeights} />
          )}
          {activeTab === 'commercial-contacts' && (
            <CommercialContactsTab asset={asset} contactsDatabase={contactsDatabase} />
          )}
          {activeTab === 'funding' && (
            <FundingTab asset={asset} />
          )}
          {activeTab === 'funding-trends' && (
            <FundingTrendsTab asset={asset} />
          )}
          {activeTab === 'data-sources' && (
            <DataSourcesTab asset={asset} />
          )}
          {activeTab === 'scoring-logic' && (
            <ScoringLogicTab asset={asset} currentWeights={currentWeights} dimensionBreakdown={dimensionBreakdown} />
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ asset, radarData }) {
  return (
    <div className="space-y-6">
      {/* Quick Facts */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card bg-gray-50">
          <p className="mb-1 text-sm text-gray-600">Time to Opportunity</p>
          <p className="text-lg font-bold">{formatTimeToOpportunity(asset.dimensions.timeToOpportunity.months)}</p>
        </div>
        <div className="card bg-gray-50">
          <p className="mb-1 text-sm text-gray-600">TRL Level</p>
          <p className="text-lg font-bold">TRL {asset.dimensions.commercializationReadiness.trl}</p>
        </div>
        <div className="card bg-gray-50">
          <p className="mb-1 text-sm text-gray-600">Funding Matches</p>
          <p className="text-lg font-bold text-indigo-600">{asset.fundingMatches?.length || 0}</p>
        </div>
        <div className="card bg-gray-50">
          <p className="mb-1 text-sm text-gray-600">Faculty</p>
          <p className="text-lg font-bold">{asset.faculty.length}</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold">Score Dimensions Overview</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="dimension" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Faculty Information */}
      <div className="card">
        <h3 className="mb-3 text-lg font-semibold">Principal Investigators</h3>
        <div className="flex flex-wrap gap-2">
          {asset.faculty.map(faculty => (
            <span key={faculty} className="px-4 py-2 font-medium text-indigo-700 rounded-lg bg-indigo-50">
              {faculty}
            </span>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="card bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-sm text-gray-600">Date Added</p>
            <p className="font-medium">{new Date(asset.dateAdded).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-600">Last Updated</p>
            <p className="font-medium">{new Date(asset.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DimensionsTab({ asset, dimensionBreakdown, currentWeights }) {
  const dimensions = [
    { key: 'marketDemand', label: 'Investment Appetite', data: asset.dimensions.marketDemand },
    { key: 'competitivePosition', label: 'Competitive Positioning', data: asset.dimensions.competitivePosition },
    { key: 'fundingAlignment', label: 'Funding Alignment', data: asset.dimensions.fundingAlignment },
    { key: 'timeToOpportunity', label: 'Time to Opportunity', data: asset.dimensions.timeToOpportunity },
    { key: 'commercializationReadiness', label: 'Commercialization Readiness', data: asset.dimensions.commercializationReadiness },
    { key: 'strategicFit', label: 'Strategic Fit', data: asset.dimensions.strategicFit }
  ];

  return (
    <div className="space-y-6">
      {/* Contribution Breakdown Chart */}
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold">Dimension Contributions to Composite Score</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dimensionBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <p className="mb-1 font-semibold">{data.name.replace('\n', ' ')}</p>
                      <p className="text-sm">Score: {data.score}</p>
                      <p className="text-sm">Weight: {data.weight}%</p>
                      <p className="text-sm font-bold text-indigo-600">Contribution: {data.contribution}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="contribution" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Dimensions */}
      {dimensions.map(({ key, label, data }) => (
        <div key={key} className="border-l-4 border-indigo-500 card">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">{label}</h3>
            <div className="text-right">
              <div className="mb-1 text-3xl font-bold text-indigo-600">{data.score}</div>
              <div className="text-sm text-gray-600">Weight: {currentWeights[key]}%</div>
            </div>
          </div>

          {/* Contributing Factors */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Contributing Factors:</h4>
            <ul className="space-y-2">
              {data.factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 text-indigo-600">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Special Info */}
          {key === 'timeToOpportunity' && data.months !== undefined && (
            <div className="p-3 rounded-lg bg-blue-50">
              <p className="text-sm font-medium text-blue-900">
                Expected timeline: {formatTimeToOpportunity(data.months)} ({data.months} months)
              </p>
            </div>
          )}
          {key === 'commercializationReadiness' && data.trl !== undefined && (
            <div className="p-3 rounded-lg bg-purple-50">
              <p className="text-sm font-medium text-purple-900">
                Technology Readiness Level: TRL {data.trl}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FundingTab({ asset }) {
  if (!asset.fundingMatches || asset.fundingMatches.length === 0) {
    return (
      <div className="py-12 text-center">
        <DollarSign size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No funding matches identified for this asset yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {asset.fundingMatches.map((funding, idx) => {
        const competitivenessColor = getCompetitivenessColor(funding.competitiveness);
        return (
          <div key={idx} className="transition-shadow border-l-4 border-green-500 card hover:shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-900">{funding.source}</h3>
                <p className="text-sm text-gray-600">{funding.type}</p>
              </div>
              <div className="text-right">
                <div className="mb-1 text-3xl font-bold text-green-600">{funding.matchScore}</div>
                <div className="text-xs text-gray-600">Match Score</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 md:grid-cols-4">
              <div>
                <p className="mb-1 text-xs text-gray-600">Award Range</p>
                <p className="text-sm font-semibold">{funding.awardRange}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-600">Next Deadline</p>
                <p className="flex items-center gap-1 text-sm font-semibold">
                  <Calendar size={14} />
                  {new Date(funding.nextDeadline).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-600">Competitiveness</p>
                <p className={`font-semibold text-sm ${competitivenessColor}`}>
                  {funding.competitiveness}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-600">Acceptance Rate</p>
                <p className="text-sm font-semibold">{funding.historicalAcceptance}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button className="flex items-center gap-1 text-sm btn-primary">
                <ExternalLink size={14} />
                View Opportunity
              </button>
              <button className="text-sm btn-secondary">
                Save to Calendar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DataSourcesTab({ asset }) {
  const allSources = [];

  Object.entries(asset.dimensions).forEach(([key, dimension]) => {
    if (dimension.sources) {
      dimension.sources.forEach(source => {
        allSources.push({
          dimension: key,
          source: source
        });
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-blue-500 card bg-blue-50">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="mb-1 font-semibold text-blue-900">Data Provenance & Transparency</h4>
            <p className="text-sm text-blue-800">
              All scoring data is derived from the sources listed below. Each source includes a confidence level assessment
              based on data quality, recency, and reliability.
            </p>
          </div>
        </div>
      </div>

      {Object.entries(asset.dimensions).map(([key, dimension]) => {
        if (!dimension.sources || dimension.sources.length === 0) return null;

        const dimensionLabels = {
          marketDemand: 'Investment Appetite',
          competitivePosition: 'Competitive Positioning',
          fundingAlignment: 'Funding Alignment',
          timeToOpportunity: 'Time to Opportunity',
          commercializationReadiness: 'Commercialization Readiness',
          strategicFit: 'Strategic Fit'
        };

        return (
          <div key={key} className="card">
            <h3 className="mb-3 text-lg font-semibold">{dimensionLabels[key]}</h3>
            <div className="space-y-2">
              {dimension.sources.map((source, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <Database size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{source.replace(/\s*\([^)]*\)\s*$/, '')}</p>
                  </div>
                  <span className={`text-xs font-medium ${getConfidenceColor(source)}`}>
                    {source.match(/\(([^)]+)\)/)?.[1] || 'Unknown confidence'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoringLogicTab({ asset, currentWeights, dimensionBreakdown }) {
  const compositeScore = calculateCompositeScore(asset.dimensions, currentWeights);

  return (
    <div className="space-y-6">
      {/* Formula Explanation */}
      <div className="border-l-4 border-indigo-500 card bg-indigo-50">
        <h3 className="mb-3 text-lg font-semibold">Composite Score Calculation</h3>
        <p className="mb-4 text-sm">
          The composite score is calculated as a weighted sum of individual dimension scores:
        </p>
        <div className="p-4 font-mono text-sm bg-white rounded-lg">
          <p className="mb-2">Composite Score = Σ(Dimension<sub>i</sub> × Weight<sub>i</sub>)</p>
          <div className="mt-4 space-y-1 text-xs">
            {dimensionBreakdown.map((dim, idx) => (
              <p key={idx} className="text-gray-700">
                + ({dim.score} × {dim.weight}%) = {dim.contribution}
              </p>
            ))}
            <p className="pt-2 text-base font-bold text-indigo-600 border-t border-gray-300">
              = {compositeScore}
            </p>
          </div>
        </div>
      </div>

      {/* Current Weights */}
      <div className="card">
        <h3 className="mb-3 text-lg font-semibold">Current Dimension Weights</h3>
        <div className="space-y-3">
          {Object.entries(currentWeights).map(([key, weight]) => {
            const labels = {
              marketDemand: 'Investment Appetite',
              competitivePosition: 'Competitive Position',
              fundingAlignment: 'Funding Alignment',
              timeToOpportunity: 'Time to Opportunity',
              commercializationReadiness: 'Commercialization Readiness',
              strategicFit: 'Strategic Fit'
            };
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{labels[key]}</span>
                  <span className="text-sm font-bold text-indigo-600">{weight}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 transition-all bg-indigo-600 rounded-full"
                    style={{ width: `${weight}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assumptions & Caveats */}
      <div className="border-l-4 border-yellow-500 card bg-yellow-50">
        <h3 className="mb-3 text-lg font-semibold">Assumptions & Caveats</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-yellow-600">⚠</span>
            <span>
              Scores are relative assessments based on available data and expert judgment, not absolute predictions.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-yellow-600">⚠</span>
            <span>
              Market and competitive landscapes can change rapidly, affecting the accuracy of scores over time.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-yellow-600">⚠</span>
            <span>
              Funding availability and regulatory timelines are subject to external factors beyond the technology itself.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-yellow-600">⚠</span>
            <span>
              Weights can be adjusted to reflect organizational priorities and strategic goals.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AssetDetailModal;
