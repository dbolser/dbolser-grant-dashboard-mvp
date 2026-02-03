import { useState } from 'react';
import { GripVertical, Settings, BarChart3, X } from 'lucide-react';

function TimelineAssetCard({ asset, onSelectAsset, stackOffset = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `£${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `£${(value / 1000).toFixed(0)}K`;
    }
    return `£${value}`;
  };

  const getScoreBorderColor = (scoreLevel) => {
    switch (scoreLevel) {
      case 'critical':
        return 'border-orange-400';
      case 'high':
        return 'border-green-400';
      case 'moderate':
        return 'border-yellow-400';
      case 'low':
        return 'border-gray-400';
      default:
        return 'border-gray-300';
    }
  };

  const getScoreBgColor = (scoreLevel) => {
    switch (scoreLevel) {
      case 'critical':
        return 'bg-orange-50';
      case 'high':
        return 'bg-green-50';
      case 'moderate':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-gray-50';
      default:
        return 'bg-white';
    }
  };

  // Calculate relative size based on expected value (normalize to reasonable range)
  const getCardSize = (value) => {
    if (value >= 700000) return 'scale-105';
    if (value >= 400000) return 'scale-100';
    return 'scale-95';
  };

  const handleCardClick = (e) => {
    // Don't trigger if clicking on action buttons
    if (e.target.closest('.action-button')) return;
    onSelectAsset(asset);
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 ${
        isHovered ? 'z-10' : 'z-0'
      } ${getCardSize(asset.expectedValue)}`}
      style={{
        marginTop: stackOffset > 0 ? `${stackOffset * 4}px` : '0'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div
        className={`border-2 ${getScoreBorderColor(asset.scoreLevel)} ${getScoreBgColor(
          asset.scoreLevel
        )} rounded-lg p-3 ${
          isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
        } transition-all`}
      >
        {/* Drag Handle & Title */}
        <div className="flex items-start gap-2 mb-2">
          <GripVertical
            size={16}
            className={`text-gray-400 flex-shrink-0 mt-0.5 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } transition-opacity cursor-grab`}
          />
          <h4 className="text-xs font-semibold text-gray-900 leading-tight flex-1 line-clamp-2">
            {asset.title}
          </h4>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div>
            <span className="text-gray-600">Score:</span>
            <span className="font-bold text-gray-900 ml-1">{asset.score}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-600">Value:</span>
            <span className="font-bold text-gray-900 ml-1">
              {formatCurrency(asset.expectedValue)}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-600 mb-2">
          <p>{asset.currentStage}</p>
          <p className="font-medium text-gray-700">
            {Math.round(asset.successProbability * 100)}% probability
          </p>
        </div>

        {/* Action Icons (shown on hover) */}
        {isHovered && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
            <button
              className="action-button flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert('Reposition feature (Demo: would open reposition dialog)');
              }}
            >
              <Settings size={14} />
              <span>Reposition</span>
            </button>
            <button
              className="action-button flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAsset(asset);
              }}
            >
              <BarChart3 size={14} />
              <span>Details</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineAssetCard;
