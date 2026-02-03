import { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, Loader, Search, Database, Filter, ArrowUp, ArrowDown } from 'lucide-react';

function UploadModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'search'

  // Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [hasSearched, setHasSearched] = useState(false);

  // Mock Data for Enginuity
  const mockEnginuityData = [
    { id: '1', title: 'Autonomous Navigation System', type: 'Patent', date: '2023-11-15', status: 'ready' },
    { id: '2', title: 'Quantum Encryption Standard', type: 'Research Paper', date: '2023-10-22', status: 'ready' },
    { id: '3', title: 'Solid State Battery Tech', type: 'Patent', date: '2023-09-10', status: 'ready' },
    { id: '4', title: 'Neural Interface Protocol', type: 'Technical Spec', date: '2023-12-01', status: 'ready' },
    { id: '5', title: 'Green Hydrogen Catalyst', type: 'Research Paper', date: '2023-08-05', status: 'ready' },
    { id: '6', title: 'Zero Latency 6G Network', type: 'Patent', date: '2024-01-12', status: 'ready' },
    { id: '7', title: 'Advanced Robotics Framework', type: 'Codebase', date: '2023-07-20', status: 'ready' },
  ];

  /* --- Upload Logic --- */
  const simulateUpload = (files) => {
    const updateFile = (index, updates) => {
      setSelectedFiles(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f));
    };

    files.forEach((_, index) => {
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(uploadInterval);
          updateFile(index, { progress: 100, status: 'processing' });
          setTimeout(() => {
            updateFile(index, { status: 'analyzing' });
            setTimeout(() => {
              updateFile(index, { status: 'complete' });
            }, 800 + index * 300);
          }, 600 + index * 200);
        } else {
          updateFile(index, { progress: Math.min(progress, 99) });
        }
      }, 150);
    });
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    const filesWithProgress = files.map(file => ({
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    }));
    setSelectedFiles(filesWithProgress);
    simulateUpload(filesWithProgress);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const filesWithProgress = files.map(file => ({
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    }));
    setSelectedFiles(filesWithProgress);
    simulateUpload(filesWithProgress);
  };

  /* --- Search Logic --- */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API delay
    setTimeout(() => {
      const results = mockEnginuityData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      // Initially select all rows
      setSelectedAssetIds(new Set(results.map(r => r.id)));
      setIsSearching(false);
    }, 600);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedAssetIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedAssetIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedAssetIds.size === searchResults.length) {
      setSelectedAssetIds(new Set());
    } else {
      setSelectedAssetIds(new Set(searchResults.map(r => r.id)));
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setActiveTab('upload');
    onClose();
  };

  const handleImport = () => {
    if (activeTab === 'upload') {
      alert(`${selectedFiles.length} innovation asset(s) uploaded successfully. Processing funding matches...`);
    } else {
      alert(`${selectedAssetIds.size} asset(s) imported from Enginuity successfully.`);
    }
    handleClose();
  };

  const allUploadsComplete = selectedFiles.length > 0 && selectedFiles.every(f => f.status === 'complete');
  const canProceed = activeTab === 'upload' ? allUploadsComplete : selectedAssetIds.size > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-lg">
                <Upload size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upload Innovation Assets</h2>
                <p className="text-sm text-gray-500">Add assets to your portfolio</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'upload'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <FileText size={16} />
              Upload Documents
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'search'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Database size={16} />
              Import from Enginuity
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'upload' ? (
            /* --- Upload View --- */
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center mb-6 transition-colors ${isDragging
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.doc"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    Drag files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOCX, TXT &middot; Max 50MB
                  </p>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-500" />
                          <span className="font-medium text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${file.status === 'complete' ? 'bg-green-500' : 'bg-black'
                            }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {file.status === 'complete' ? (
                          <>
                            <CheckCircle size={12} className="text-green-600" />
                            <span className="text-green-600 font-medium">Ready for analysis</span>
                          </>
                        ) : file.status === 'analyzing' ? (
                          <>
                            <Loader size={12} className="text-indigo-600 animate-spin" />
                            <span className="text-indigo-600">Analyzing matches...</span>
                          </>
                        ) : file.status === 'processing' ? (
                          <>
                            <Loader size={12} className="text-gray-600 animate-spin" />
                            <span className="text-gray-600">Processing...</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Uploading... {Math.round(file.progress)}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* --- Search View --- */
            <div className="space-y-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Enginuity database..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isSearching}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSearching ? <Loader size={20} className="animate-spin" /> : 'Search'}
                </button>
              </form>

              {hasSearched && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-gray-700">
                      Search Results ({searchResults.length})
                    </h3>
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => setSelectedAssetIds(new Set(searchResults.map(r => r.id)))}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Check All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => setSelectedAssetIds(new Set())}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Uncheck All
                      </button>
                    </div>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 w-10">
                              <input
                                type="checkbox"
                                checked={selectedAssetIds.size === searchResults.length && searchResults.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-gray-300 text-black focus:ring-black"
                              />
                            </th>
                            <th
                              className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group"
                              onClick={() => handleSort('title')}
                            >
                              <div className="flex items-center gap-1">
                                Asset Title
                                {sortConfig.key === 'title' && (
                                  sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                                )}
                              </div>
                            </th>
                            <th
                              className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group"
                              onClick={() => handleSort('type')}
                            >
                              <div className="flex items-center gap-1">
                                Type
                                {sortConfig.key === 'type' && (
                                  sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                                )}
                              </div>
                            </th>
                            <th
                              className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group"
                              onClick={() => handleSort('date')}
                            >
                              <div className="flex items-center gap-1">
                                Date
                                {sortConfig.key === 'date' && (
                                  sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                                )}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {sortedResults.map((item) => (
                            <tr
                              key={item.id}
                              className={`hover:bg-gray-50 transition-colors ${selectedAssetIds.has(item.id) ? 'bg-blue-50/50' : ''
                                }`}
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedAssetIds.has(item.id)}
                                  onChange={() => toggleSelection(item.id)}
                                  className="rounded border-gray-300 text-black focus:ring-black"
                                />
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                              <td className="px-4 py-3 text-gray-500">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">{item.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Filter size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No assets found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!canProceed}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${canProceed
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {activeTab === 'upload'
              ? `Upload${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ''}`
              : `Import Assets${selectedAssetIds.size > 0 ? ` (${selectedAssetIds.size})` : ''}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
