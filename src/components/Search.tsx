import { useState } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import type { SearchResult } from '../types';
import { legislationAPI, type LegislationType } from '../services/legislationAPI';

interface SearchProps {
  onSelectResult: (result: SearchResult) => void;
}

export function Search({ onSelectResult }: SearchProps) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<LegislationType | '*'>('*');
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && selectedType === '*' && !startYear && !endYear) return;

    setLoading(true);
    try {
      const searchResults = await legislationAPI.search({
        title: query.trim() || undefined,
        type: selectedType,
        startYear: startYear ? parseInt(startYear) : undefined,
        endYear: endYear ? parseInt(endYear) : undefined,
        resultsCount: 50,
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseRecent = async () => {
    setLoading(true);
    try {
      const recent = await legislationAPI.getRecent(selectedType === '*' ? undefined : selectedType);
      setResults(recent);
    } catch (error) {
      console.error('Browse error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedType('*');
    setStartYear('');
    setEndYear('');
    setResults([]);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="h-full flex flex-col bg-shadow-grey">
      {/* Search Header */}
      <div className="p-4 border-b border-indigo-velvet">
        <form onSubmit={handleSearch} className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title (e.g., Companies Act 2006)..."
              className="w-full px-4 py-2 pl-10 bg-indigo-velvet text-cotton-rose placeholder-petal-pink/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-x11"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-petal-pink" />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LegislationType | '*')}
              className="w-full px-3 py-2 bg-indigo-velvet text-cotton-rose rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-x11"
            >
              <option value="*">All Legislation Types</option>
              <optgroup label="Acts">
                <option value="ukpga">UK Public General Acts</option>
                <option value="ukla">UK Local Acts</option>
                <option value="asp">Acts of Scottish Parliament</option>
                <option value="asc">Acts of Senedd Cymru</option>
              </optgroup>
              <optgroup label="Statutory Instruments">
                <option value="uksi">UK Statutory Instruments</option>
                <option value="ssi">Scottish Statutory Instruments</option>
                <option value="wsi">Wales Statutory Instruments</option>
                <option value="nisr">NI Statutory Rules</option>
              </optgroup>
              <optgroup label="Church">
                <option value="ukcm">UK Church Measures</option>
                <option value="ukci">UK Church Instruments</option>
              </optgroup>
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-petal-pink hover:text-purple-x11"
          >
            <Filter size={16} />
            {showFilters ? 'Hide' : 'Show'} Year Filters
          </button>

          {/* Year Range Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="From year"
                min="1800"
                max={currentYear}
                className="px-3 py-2 bg-indigo-velvet text-cotton-rose placeholder-petal-pink/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-x11"
              />
              <input
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                placeholder="To year"
                min="1800"
                max={currentYear}
                className="px-3 py-2 bg-indigo-velvet text-cotton-rose placeholder-petal-pink/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-x11"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-x11 text-white py-2 rounded-lg hover:bg-petal-pink transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={handleBrowseRecent}
              disabled={loading}
              className="px-4 py-2 bg-indigo-velvet text-cotton-rose rounded-lg hover:bg-petal-pink/20 transition-colors disabled:opacity-50"
            >
              Recent
            </button>
            {(query || selectedType !== '*' || startYear || endYear) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-petal-pink hover:text-purple-x11 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {results.length === 0 && !loading && (
          <div className="text-center text-petal-pink/70 py-8">
            <p className="mb-2">Search UK legislation</p>
            <p className="text-xs text-petal-pink/50">
              Try: "Companies Act 2006", "Employment Rights", or browse recent legislation
            </p>
          </div>
        )}

        {results.map((result, idx) => (
          <button
            key={idx}
            onClick={() => onSelectResult(result)}
            className="w-full text-left p-3 bg-indigo-velvet hover:bg-petal-pink/20 rounded-lg transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-cotton-rose font-medium group-hover:text-purple-x11 transition-colors">
                  {result.title}
                </h3>
                <p className="text-sm text-petal-pink/70 mt-1 line-clamp-2">
                  {result.snippet}
                </p>
              </div>
            </div>
          </button>
        ))}

        {loading && (
          <div className="text-center text-petal-pink py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-petal-pink border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
