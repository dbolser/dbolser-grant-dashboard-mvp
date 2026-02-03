import { getScoreBand, formatTimeToOpportunity } from '../utils/scoreCalculator';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

function AssetTable({ assets, onSelectAsset, sortBy, sortOrder, onSort }) {
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronsUpDown size={16} className="text-gray-400" />;
    return sortOrder === 'asc'
      ? <ChevronUp size={16} className="text-indigo-600" />
      : <ChevronDown size={16} className="text-indigo-600" />;
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                onClick={() => onSort('score')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Score
                  <SortIcon field="score" />
                </div>
              </th>
              <th
                onClick={() => onSort('title')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Asset Title
                  <SortIcon field="title" />
                </div>
              </th>
              <th
                onClick={() => onSort('type')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Type
                  <SortIcon field="type" />
                </div>
              </th>
              <th
                onClick={() => onSort('discipline')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Discipline
                  <SortIcon field="discipline" />
                </div>
              </th>
              <th
                onClick={() => onSort('timeToOpportunity')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Time to Opp.
                  <SortIcon field="timeToOpportunity" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                TRL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Funding Matches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Faculty
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset, index) => {
              const scoreBand = getScoreBand(asset.compositeScore);
              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className={`score-badge ${scoreBand.bgColor} ${scoreBand.color} ${scoreBand.borderColor} text-xl font-bold px-3 py-1`}>
                        {asset.compositeScore}
                      </span>
                      <span className={`text-xs ${scoreBand.color} font-medium`}>
                        {scoreBand.name.split(' ')[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="font-medium text-gray-900 mb-1">{asset.title}</p>
                      <p className="text-xs text-gray-500">{asset.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{asset.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{asset.discipline}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatTimeToOpportunity(asset.dimensions.timeToOpportunity.months)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      TRL {asset.dimensions.commercializationReadiness.trl}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-indigo-600">
                      {asset.fundingMatches?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {asset.faculty.join(', ')}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetTable;
