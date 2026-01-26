import { useState } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-khaki-beige">
      {/* Search Header */}
      <div className="p-4 bg-iron-grey border-b-2 border-dim-grey">
        <form onSubmit={handleSearch} className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title (e.g., Companies Act 2006)..."
              className="w-full px-4 py-2.5 pl-10 bg-sand-dune text-iron-grey placeholder-dim-grey/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-steel border border-dim-grey/30 shadow-sm"
            />
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-dim-grey" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-dim-grey hover:text-iron-grey"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LegislationType | '*')}
              className="w-full px-3 py-2.5 bg-sand-dune text-iron-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-steel border border-dim-grey/30 shadow-sm font-medium"
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
            className="flex items-center gap-2 text-sm text-sand-dune hover:text-cool-steel font-medium"
          >
            <Filter size={16} />
            {showFilters ? 'Hide' : 'Show'} Year Filters
          </button>

          {/* Year Range Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="From year"
                min="1800"
                max={currentYear}
                className="px-3 py-2 bg-sand-dune text-iron-grey placeholder-dim-grey/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-steel border border-dim-grey/30"
              />
              <input
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                placeholder="To year"
                min="1800"
                max={currentYear}
                className="px-3 py-2 bg-sand-dune text-iron-grey placeholder-dim-grey/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-steel border border-dim-grey/30"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cool-steel text-iron-grey font-semibold py-2.5 rounded-lg hover:bg-sand-dune transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={handleBrowseRecent}
              disabled={loading}
              className="px-4 py-2.5 bg-dim-grey text-sand-dune font-medium rounded-lg hover:bg-iron-grey transition-all disabled:opacity-50 shadow-sm"
            >
              Recent
            </button>
            {(query || selectedType !== '*' || startYear || endYear) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2.5 text-sand-dune hover:text-cool-steel transition-colors"
                title="Clear filters"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {results.length === 0 && !loading && (
          <div className="text-center text-dim-grey py-8 px-4">
            <SearchIcon className="mx-auto h-12 w-12 text-dim-grey/30 mb-3" />
            <p className="text-lg font-medium mb-2">Search UK Legislation</p>
            <p className="text-sm text-dim-grey/70">
              Try: "Companies Act 2006", "Employment Rights", or browse recent legislation
            </p>
          </div>
        )}

        {results.map((result, idx) => (
          <button
            key={idx}
            onClick={() => onSelectResult(result)}
            className="w-full text-left p-4 bg-sand-dune hover:bg-cool-steel/30 rounded-lg transition-all group border border-dim-grey/20 hover:border-cool-steel shadow-sm hover:shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-iron-grey font-semibold group-hover:text-dim-grey transition-colors leading-tight">
                  {result.title}
                </h3>
                <p className="text-sm text-dim-grey/80 mt-1.5 line-clamp-2 leading-relaxed">
                  {result.snippet}
                </p>
              </div>
            </div>
          </button>
        ))}

        {loading && (
          <div className="text-center text-cool-steel py-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-cool-steel border-t-transparent"></div>
            <p className="text-sm text-dim-grey mt-3">Searching legislation...</p>
          </div>
        )}
      </div>
    </div>
  );
}
