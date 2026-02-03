import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { X, Filter, TrendingUp, TrendingDown, Minus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const DOMAIN_COLORS = {
  'Healthcare': '#3B82F6',
  'Computing': '#8B5CF6',
  'Environment': '#10B981',
  'Industrial': '#F59E0B',
  'Agriculture': '#84CC16',
  'Defense': '#EF4444'
};

const DISCIPLINE_COLORS = {
  'Life Sciences': '#60A5FA',
  'Medical Devices': '#34D399',
  'Computer Science': '#A78BFA',
  'Materials Science': '#FBBF24',
  'Energy/CleanTech': '#10B981',
  'Engineering': '#6B7280',
  'Electrical Engineering': '#F59E0B',
  'Physical Sciences': '#8B5CF6',
  'Chemistry': '#EC4899',
  'Agricultural Science': '#84CC16'
};

function ApplicationClusterView({ assets, applicationClusters, onSelectAsset }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [filters, setFilters] = useState({
    discipline: 'all',
    domain: 'all',
    minScore: 0,
    minRelevance: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const graphRef = useRef();
  const containerRef = useRef();

  // Get unique disciplines and domains for filters
  const filterOptions = useMemo(() => {
    const disciplines = [...new Set(assets.map(a => a.discipline))].sort();
    const domains = [...new Set(Object.values(applicationClusters).map(c => c.domain))].sort();
    return { disciplines, domains };
  }, [assets, applicationClusters]);

  // Filter assets based on current filters
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (filters.discipline !== 'all' && asset.discipline !== filters.discipline) return false;
      if (asset.compositeScore < filters.minScore) return false;
      return true;
    });
  }, [assets, filters]);

  // Filter application clusters based on domain filter
  const filteredClusters = useMemo(() => {
    if (filters.domain === 'all') return applicationClusters;
    return Object.fromEntries(
      Object.entries(applicationClusters).filter(([_, data]) => data.domain === filters.domain)
    );
  }, [applicationClusters, filters.domain]);

  // Transform data into graph structure
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];
    const clusterNames = Object.keys(filteredClusters);

    // Add asset nodes
    filteredAssets.forEach((asset, index) => {
      // Check if asset has any relevant applications in filtered clusters
      const hasRelevantApps = asset.applications?.some(app =>
        clusterNames.includes(app.application) && app.relevance >= filters.minRelevance
      );

      if (!hasRelevantApps && filters.domain !== 'all') return;

      nodes.push({
        id: asset.id,
        name: asset.title,
        type: 'asset',
        group: asset.discipline,
        score: asset.compositeScore,
        patentStatus: asset.patentStatus || 'pending',
        asset: asset,
        val: Math.max(4, asset.compositeScore / 12),
        fx: -350,
        fy: (index - filteredAssets.length / 2) * 25
      });

      // Add links to applications
      if (asset.applications) {
        asset.applications.forEach(app => {
          if (clusterNames.includes(app.application) && app.relevance >= filters.minRelevance) {
            links.push({
              source: asset.id,
              target: app.application,
              value: app.relevance,
              relevance: app.relevance
            });
          }
        });
      }
    });

    // Add application cluster nodes
    Object.entries(filteredClusters).forEach(([appName, appData], index) => {
      // Check if any filtered asset links to this cluster
      const hasLinks = links.some(link => link.target === appName);
      if (!hasLinks && filters.discipline !== 'all') return;

      nodes.push({
        id: appName,
        name: appName,
        type: 'application',
        domain: appData.domain,
        marketSize: appData.marketSize,
        marketDemand: appData.marketDemand,
        growthRate: appData.growthRate,
        clusterData: appData,
        val: Math.max(6, appData.marketDemand / 8),
        fx: 350,
        fy: (index - Object.keys(filteredClusters).length / 2) * 45
      });
    });

    return { nodes, links };
  }, [filteredAssets, filteredClusters, filters.minRelevance]);

  // Calculate cluster statistics
  const clusterStats = useMemo(() => {
    const stats = {};

    Object.keys(applicationClusters).forEach(appName => {
      const assetsInCluster = assets.filter(a =>
        a.applications?.some(app => app.application === appName)
      );

      const avgScore = assetsInCluster.length > 0
        ? assetsInCluster.reduce((sum, a) => sum + a.compositeScore, 0) / assetsInCluster.length
        : 0;

      const totalRelevance = assetsInCluster.reduce((sum, a) => {
        const app = a.applications?.find(app => app.application === appName);
        return sum + (app?.relevance || 0);
      }, 0);

      stats[appName] = {
        count: assetsInCluster.length,
        avgScore: Math.round(avgScore),
        totalRelevance: totalRelevance.toFixed(1)
      };
    });

    return stats;
  }, [assets, applicationClusters]);

  // Get node color based on type
  const getNodeColor = useCallback((node) => {
    if (node.type === 'asset') {
      return DISCIPLINE_COLORS[node.group] || '#9CA3AF';
    } else {
      return DOMAIN_COLORS[node.domain] || '#6B7280';
    }
  }, []);

  // Custom node rendering
  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const isHovered = hoveredNode?.id === node.id;
    const isSelected = selectedNode?.id === node.id;
    const size = node.val || 5;

    // Draw node
    ctx.beginPath();

    if (node.type === 'asset') {
      // Asset nodes: circles with score-based intensity
      const alpha = Math.max(0.4, node.score / 100);
      const color = getNodeColor(node);

      // Draw outer ring for selected/hovered
      if (isSelected || isHovered) {
        ctx.arc(node.x, node.y, size + 3, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        ctx.fill();
        ctx.beginPath();
      }

      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Add score indicator
      ctx.fillStyle = '#FFF';
      ctx.font = `${Math.max(6, size * 0.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (size > 5) {
        ctx.fillText(node.score, node.x, node.y);
      }
    } else {
      // Application cluster nodes: rounded rectangles
      const width = Math.max(80, node.name.length * 5);
      const height = 28;
      const radius = 6;
      const x = node.x - width / 2;
      const y = node.y - height / 2;

      // Shadow for selected/hovered
      if (isSelected || isHovered) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      ctx.fillStyle = getNodeColor(node);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Truncate label if too long
      let label = node.name;
      if (label.length > 20) {
        label = label.substring(0, 18) + '...';
      }
      ctx.fillText(label, node.x, node.y);
    }

    // Draw label for hovered/selected assets
    if (node.type === 'asset' && (isHovered || isSelected)) {
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Background for label
      const label = node.name.substring(0, 35) + (node.name.length > 35 ? '...' : '');
      const labelWidth = ctx.measureText(label).width + 8;
      const labelHeight = 16;
      const labelX = node.x + size + 6;
      const labelY = node.y;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(labelX - 4, labelY - labelHeight / 2, labelWidth, labelHeight);

      ctx.fillStyle = '#1F2937';
      ctx.fillText(label, labelX, labelY);
    }
  }, [hoveredNode, selectedNode, getNodeColor]);

  // Handle node click
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    if (node.type === 'asset' && node.asset && onSelectAsset) {
      // Allow opening the asset detail modal
    }
  }, [onSelectAsset]);

  // Handle zoom controls
  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5, 400);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.5, 400);
    }
  };

  const handleZoomFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 50);
    }
  };

  // Fit to view on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400, 80);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [graphData]);

  return (
    <div className="relative w-full h-[calc(100vh-280px)] min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden" ref={containerRef}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Application Cluster Network</h2>
            <p className="text-sm text-gray-600 mt-1">
              Innovation assets (left) mapped to commercial applications (right). Line thickness indicates relevance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Filter size={16} />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Discipline</label>
              <select
                value={filters.discipline}
                onChange={e => setFilters({ ...filters, discipline: e.target.value })}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Disciplines</option>
                {filterOptions.disciplines.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Domain</label>
              <select
                value={filters.domain}
                onChange={e => setFilters({ ...filters, domain: e.target.value })}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Domains</option>
                {filterOptions.domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Score: {filters.minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={e => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                className="w-32"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Relevance: {(filters.minRelevance * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minRelevance * 100}
                onChange={e => setFilters({ ...filters, minRelevance: parseInt(e.target.value) / 100 })}
                className="w-32"
              />
            </div>
          </div>
        )}
      </div>

      {/* Graph */}
      <div className="absolute inset-0 pt-24">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={(node, color, ctx) => {
            const size = node.type === 'application' ? 50 : node.val || 5;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 5, 0, 2 * Math.PI);
            ctx.fill();
          }}
          linkWidth={link => Math.max(1, link.relevance * 4)}
          linkColor={() => 'rgba(156, 163, 175, 0.5)'}
          linkCurvature={0.1}
          onNodeClick={handleNodeClick}
          onNodeHover={node => setHoveredNode(node)}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.4}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          minZoom={0.3}
          maxZoom={4}
        />
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} className="text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} className="text-gray-700" />
        </button>
        <button
          onClick={handleZoomFit}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Fit to View"
        >
          <Maximize2 size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md max-w-xs z-10">
        <h3 className="font-semibold text-sm mb-3 text-gray-900">Legend</h3>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1.5">Disciplines (Assets)</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(DISCIPLINE_COLORS).slice(0, 6).map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="text-xs text-gray-700 truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Domains (Clusters)</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(DOMAIN_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                  <span className="text-xs text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Node size = Score/Demand. Line thickness = Relevance.
            </p>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      {selectedNode && (
        <div className="absolute top-28 left-4 bg-white p-5 rounded-lg shadow-xl max-w-sm z-20 border border-gray-200">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>

          <h3 className="font-bold text-lg mb-1 pr-6 text-gray-900">{selectedNode.name}</h3>

          {selectedNode.type === 'asset' ? (
            <>
              <p className="text-sm text-gray-500 mb-3">{selectedNode.id}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Discipline:</span>
                  <span className="font-medium" style={{ color: DISCIPLINE_COLORS[selectedNode.group] }}>
                    {selectedNode.group}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Composite Score:</span>
                  <span className="font-bold text-gray-900">{selectedNode.score}</span>
                </div>
              </div>

              {/* Score Variance */}
              {selectedNode.asset?.scoreVariance && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="font-semibold text-sm mb-2 text-gray-700">Score vs Cluster Average</h4>
                  <div className="space-y-1.5">
                    {Object.entries(selectedNode.asset.scoreVariance).map(([dim, variance]) => (
                      <div key={dim} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 capitalize">{dim.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className={`font-semibold flex items-center gap-1 ${variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-500' : 'text-gray-500'
                          }`}>
                          {variance > 0 ? <TrendingUp size={14} /> : variance < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                          {variance > 0 ? '+' : ''}{variance}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Positive = Better than cluster average
                  </p>
                </div>
              )}

              {/* Applications */}
              {selectedNode.asset?.applications && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="font-semibold text-sm mb-2 text-gray-700">Applications</h4>
                  <div className="space-y-1">
                    {selectedNode.asset.applications.map(app => (
                      <div key={app.application} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 truncate mr-2">{app.application}</span>
                        <span className="font-medium text-indigo-600">{(app.relevance * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onSelectAsset && (
                <button
                  onClick={() => onSelectAsset(selectedNode.asset)}
                  className="mt-4 w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Full Details
                </button>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">Application Cluster</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium" style={{ color: DOMAIN_COLORS[selectedNode.domain] }}>
                    {selectedNode.domain}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Size:</span>
                  <span className="font-bold text-gray-900">{selectedNode.marketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate:</span>
                  <span className="font-medium text-green-600">{selectedNode.growthRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Demand Score:</span>
                  <span className="font-bold text-gray-900">{selectedNode.marketDemand}</span>
                </div>
              </div>

              {/* Cluster Stats */}
              {clusterStats[selectedNode.name] && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="font-semibold text-sm mb-2 text-gray-700">Portfolio Stats</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assets in Cluster:</span>
                      <span className="font-bold text-gray-900">{clusterStats[selectedNode.name].count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Asset Score:</span>
                      <span className="font-medium text-gray-900">{clusterStats[selectedNode.name].avgScore}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cluster Details */}
              {selectedNode.clusterData && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="font-semibold text-sm mb-2 text-gray-700">Additional Info</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Competitors:</span>
                      <span className="text-gray-900">~{selectedNode.clusterData.avgCompetitors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regulatory:</span>
                      <span className="text-gray-900">{selectedNode.clusterData.regulatoryPath}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Deal Size:</span>
                      <span className="text-gray-900">{selectedNode.clusterData.avgDealSize}</span>
                    </div>
                  </div>

                  {selectedNode.clusterData.keyFunders && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600">Key Funders: </span>
                      <span className="text-xs text-gray-900">
                        {selectedNode.clusterData.keyFunders.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Top Clusters Summary (collapsible) */}
      <div className="absolute top-28 right-4 bg-white p-4 rounded-lg shadow-md w-56 z-10">
        <h3 className="font-semibold text-sm mb-3 text-gray-900">Top Application Clusters</h3>
        <div className="space-y-2">
          {Object.entries(clusterStats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([name, stats]) => (
              <div
                key={name}
                className="text-sm py-1.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 px-1 -mx-1 rounded"
                onClick={() => {
                  const node = graphData.nodes.find(n => n.id === name);
                  if (node) setSelectedNode(node);
                }}
              >
                <div className="font-medium text-gray-900 truncate text-xs">{name}</div>
                <div className="text-gray-500 text-xs">
                  {stats.count} assets | Avg: {stats.avgScore}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-md flex items-center gap-6 text-sm z-10">
        <div>
          <span className="text-gray-500">Assets:</span>
          <span className="font-bold text-gray-900 ml-1">{graphData.nodes.filter(n => n.type === 'asset').length}</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div>
          <span className="text-gray-500">Clusters:</span>
          <span className="font-bold text-gray-900 ml-1">{graphData.nodes.filter(n => n.type === 'application').length}</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div>
          <span className="text-gray-500">Connections:</span>
          <span className="font-bold text-gray-900 ml-1">{graphData.links.length}</span>
        </div>
      </div>
    </div>
  );
}

export default ApplicationClusterView;
