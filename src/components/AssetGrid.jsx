import { getScoreBand, formatTimeToOpportunity } from '../utils/scoreCalculator';
import { Clock, Users, TrendingUp, TrendingDown } from 'lucide-react';

function AssetCard({ asset, onSelectAsset, rankChange }) {
  const scoreBand = getScoreBand(asset.compositeScore);

  return (
    <div
      onClick={() => onSelectAsset(asset)}
      className="card hover:shadow-lg transition-all cursor-pointer border-l-4 hover:scale-[1.02] duration-200"
      style={{ borderLeftColor: scoreBand.borderColor.replace('border-', '#') }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
            {asset.title}
          </h3>
          <p className="text-sm text-gray-600">{asset.id}</p>
        </div>
        <div className="ml-4">
          <div className={`score-badge ${scoreBand.bgColor} ${scoreBand.color} ${scoreBand.borderColor} text-2xl font-bold px-4 py-2`}>
            {asset.compositeScore}
          </div>
        </div>
      </div>

      {/* Score Band & Rank Change */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`score-badge ${scoreBand.bgColor} ${scoreBand.color} ${scoreBand.borderColor} text-xs`}>
          {scoreBand.name}
        </span>
        {rankChange !== 0 && (
          <span className={`flex items-center gap-1 text-xs ${rankChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {rankChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(rankChange)} {Math.abs(rankChange) === 1 ? 'position' : 'positions'}
          </span>
        )}
      </div>

      {/* Meta Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium text-gray-900">{asset.type}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Discipline:</span>
          <span className="font-medium text-gray-900">{asset.discipline}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} className="text-gray-400" />
          <span className="text-gray-600">Time to Opportunity:</span>
          <span className="font-medium text-gray-900">
            {formatTimeToOpportunity(asset.dimensions.timeToOpportunity.months)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users size={14} className="text-gray-400" />
          <span className="text-gray-600 flex-shrink-0">Faculty:</span>
          <span className="font-medium text-gray-900 truncate">
            {asset.faculty.join(', ')}
          </span>
        </div>
      </div>

      {/* Dimension Mini-Scores */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Market</p>
          <p className="font-bold text-sm">{asset.dimensions.marketDemand.score}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Competitive</p>
          <p className="font-bold text-sm">{asset.dimensions.competitivePosition.score}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Funding</p>
          <p className="font-bold text-sm">{asset.dimensions.fundingAlignment.score}</p>
        </div>
      </div>

      {/* Funding Matches Count */}
      {asset.fundingMatches && asset.fundingMatches.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-indigo-600 font-medium">
            {asset.fundingMatches.length} funding {asset.fundingMatches.length === 1 ? 'match' : 'matches'} available
          </p>
        </div>
      )}
    </div>
  );
}

function AssetGrid({ assets, onSelectAsset, sensitivity }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map(asset => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onSelectAsset={onSelectAsset}
          rankChange={sensitivity[asset.id] || 0}
        />
      ))}
    </div>
  );
}

export default AssetGrid;
