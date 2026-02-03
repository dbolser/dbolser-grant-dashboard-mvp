import { useMemo } from 'react';
import TimelineAssetCard from './TimelineAssetCard';

function TimelineView({ assets, onSelectAsset }) {
  const disciplines = ['Life Sciences', 'Engineering', 'Computer Science'];
  const horizons = [
    { id: 1, label: 'Horizon 1', subtitle: '0-12 months' },
    { id: 2, label: 'Horizon 2', subtitle: '12-24 months' },
    { id: 3, label: 'Horizon 3', subtitle: '24-36+ months' }
  ];

  // Group assets by horizon and discipline
  const groupedAssets = useMemo(() => {
    const grouped = {};
    horizons.forEach(horizon => {
      grouped[horizon.id] = {};
      disciplines.forEach(discipline => {
        grouped[horizon.id][discipline] = assets.filter(
          asset => asset.currentHorizon === horizon.id && asset.currentDiscipline === discipline
        );
      });
    });
    return grouped;
  }, [assets]);

  return (
    <div className="card p-0 overflow-hidden">
      {/* Timeline Header */}
      <div className="grid grid-cols-3 border-b border-gray-200">
        {horizons.map(horizon => (
          <div
            key={horizon.id}
            className="p-4 text-center border-r border-gray-200 last:border-r-0 bg-gray-50"
          >
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              {horizon.label}
            </h3>
            <p className="text-xs text-gray-600 mt-1">{horizon.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Timeline Body */}
      <div className="relative">
        {/* Discipline Swimlanes */}
        {disciplines.map((discipline, disciplineIndex) => (
          <div
            key={discipline}
            className={`border-b border-gray-200 last:border-b-0 ${
              disciplineIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            }`}
          >
            <div className="grid grid-cols-[180px_1fr] min-h-[200px]">
              {/* Discipline Label */}
              <div className="flex items-center px-4 py-6 border-r border-gray-200 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700">{discipline}</h4>
              </div>

              {/* Horizon Cells */}
              <div className="grid grid-cols-3">
                {horizons.map(horizon => {
                  const assetsInCell = groupedAssets[horizon.id][discipline] || [];

                  return (
                    <div
                      key={`${horizon.id}-${discipline}`}
                      className="p-4 border-r border-gray-200 last:border-r-0 min-h-[200px]"
                    >
                      <div className="space-y-3">
                        {assetsInCell.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400 italic">
                            No assets
                          </div>
                        ) : (
                          assetsInCell.map((asset, index) => (
                            <TimelineAssetCard
                              key={asset.id}
                              asset={asset}
                              onSelectAsset={onSelectAsset}
                              stackOffset={index}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimelineView;
