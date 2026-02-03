/**
 * Calculate composite score based on dimension scores and weights
 * @param {Object} dimensions - Object containing dimension scores
 * @param {Object} weights - Object containing dimension weights (must sum to 100)
 * @returns {number} - Composite score (0-100)
 */
export function calculateCompositeScore(dimensions, weights) {
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  if (Math.abs(totalWeight - 100) > 0.01) {
    console.warn('Weights do not sum to 100:', totalWeight);
  }

  let score = 0;
  score += (dimensions.marketDemand?.score || 0) * (weights.marketDemand / 100);
  score += (dimensions.competitivePosition?.score || 0) * (weights.competitivePosition / 100);
  score += (dimensions.fundingAlignment?.score || 0) * (weights.fundingAlignment / 100);
  score += (dimensions.timeToOpportunity?.score || 0) * (weights.timeToOpportunity / 100);
  score += (dimensions.commercializationReadiness?.score || 0) * (weights.commercializationReadiness / 100);
  score += (dimensions.strategicFit?.score || 0) * (weights.strategicFit / 100);

  return Math.round(score);
}

/**
 * Get score band based on composite score
 * @param {number} score - Composite score (0-100)
 * @returns {Object} - Score band info {name, color, bgColor, borderColor}
 */
export function getScoreBand(score) {
  if (score >= 80) {
    return {
      name: 'Critical Opportunity',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300'
    };
  } else if (score >= 60) {
    return {
      name: 'High Potential',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300'
    };
  } else if (score >= 40) {
    return {
      name: 'Moderate Opportunity',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300'
    };
  } else {
    return {
      name: 'Low Priority',
      color: 'text-red-800',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300'
    };
  }
}

/**
 * Get competitiveness color
 * @param {string} competitiveness - Low, Medium, or High
 * @returns {string} - Tailwind color class
 */
export function getCompetitivenessColor(competitiveness) {
  switch (competitiveness?.toLowerCase()) {
    case 'low':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'high':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Format time to opportunity
 * @param {number} months - Number of months
 * @returns {string} - Formatted time string
 */
export function formatTimeToOpportunity(months) {
  if (months === 0) {
    return 'Immediate';
  } else if (months <= 6) {
    return `${months} months`;
  } else if (months <= 18) {
    return `${Math.round(months / 3)} quarters`;
  } else {
    const years = Math.round(months / 12);
    return `${years} year${years > 1 ? 's' : ''}`;
  }
}

/**
 * Get confidence level color
 * @param {string} confidence - Confidence level from source
 * @returns {string} - Tailwind color class
 */
export function getConfidenceColor(source) {
  if (source.toLowerCase().includes('high confidence')) {
    return 'text-green-700';
  } else if (source.toLowerCase().includes('medium confidence')) {
    return 'text-yellow-700';
  } else if (source.toLowerCase().includes('low confidence')) {
    return 'text-red-700';
  }
  return 'text-gray-700';
}

/**
 * Sort assets by specified field and order
 * @param {Array} assets - Array of assets
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {Array} - Sorted assets
 */
export function sortAssets(assets, sortBy, sortOrder) {
  return [...assets].sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'score':
        aVal = a.compositeScore;
        bVal = b.compositeScore;
        break;
      case 'title':
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case 'type':
        aVal = a.type.toLowerCase();
        bVal = b.type.toLowerCase();
        break;
      case 'discipline':
        aVal = a.discipline.toLowerCase();
        bVal = b.discipline.toLowerCase();
        break;
      case 'timeToOpportunity':
        aVal = a.dimensions.timeToOpportunity.months;
        bVal = b.dimensions.timeToOpportunity.months;
        break;
      case 'dateAdded':
        aVal = new Date(a.dateAdded);
        bVal = new Date(b.dateAdded);
        break;
      default:
        aVal = a.compositeScore;
        bVal = b.compositeScore;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
}

/**
 * Filter assets based on criteria
 * @param {Array} assets - Array of assets
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered assets
 */
export function filterAssets(assets, filters) {
  return assets.filter(asset => {
    // Filter by asset type
    if (filters.type && filters.type !== 'all' && asset.type !== filters.type) {
      return false;
    }

    // Filter by discipline
    if (filters.discipline && filters.discipline !== 'all' && asset.discipline !== filters.discipline) {
      return false;
    }

    // Filter by score range
    if (filters.scoreRange && filters.scoreRange !== 'all') {
      const score = asset.compositeScore;
      switch (filters.scoreRange) {
        case 'critical':
          if (score < 80) return false;
          break;
        case 'high':
          if (score < 60 || score >= 80) return false;
          break;
        case 'moderate':
          if (score < 40 || score >= 60) return false;
          break;
        case 'low':
          if (score >= 40) return false;
          break;
      }
    }

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = asset.title.toLowerCase().includes(searchTerm);
      const matchesFaculty = asset.faculty?.some(f => f.toLowerCase().includes(searchTerm));
      const matchesId = asset.id.toLowerCase().includes(searchTerm);

      if (!matchesTitle && !matchesFaculty && !matchesId) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculate sensitivity: how much an asset's rank changes with different weights
 * @param {Array} assets - Array of assets with original scores
 * @param {Array} rerankedAssets - Array of assets with new scores
 * @returns {Object} - Map of asset ID to rank change
 */
export function calculateSensitivity(assets, rerankedAssets) {
  const sensitivity = {};

  assets.forEach((asset, index) => {
    const newIndex = rerankedAssets.findIndex(a => a.id === asset.id);
    const rankChange = index - newIndex; // Positive = moved up, Negative = moved down
    sensitivity[asset.id] = rankChange;
  });

  return sensitivity;
}

/**
 * Get preset scenario configuration
 * @param {string} scenarioKey - Key from presetScenarios
 * @param {Object} presetScenarios - Preset scenarios from mockData
 * @returns {Object} - Scenario configuration
 */
export function getScenarioConfig(scenarioKey, presetScenarios) {
  return presetScenarios[scenarioKey] || null;
}
