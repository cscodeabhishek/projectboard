import React from 'react';
import { TaskFilter, Label } from '../types';
import { Search, Filter, X } from 'lucide-react';

interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilter) => void;
  availableLabels: Label[];
}

export default function TaskFilters({ onFilterChange, availableLabels }: TaskFiltersProps) {
  const [filters, setFilters] = React.useState<TaskFilter>({});
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleFilterChange = (newFilters: Partial<TaskFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="font-medium text-gray-700">Filters</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by assignee..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={filters.assignee || ''}
              onChange={(e) => handleFilterChange({ assignee: e.target.value })}
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Filter by client name..."
            className="w-full px-4 py-2 border rounded-md"
            value={filters.clientName || ''}
            onChange={(e) => handleFilterChange({ clientName: e.target.value })}
          />
        </div>

        {isExpanded && (
          <>
            <div className="flex-1 min-w-[200px]">
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={filters.ticketStatus || ''}
                onChange={(e) => handleFilterChange({ ticketStatus: e.target.value as any })}
              >
                <option value="">All Statuses</option>
                <option value="pending-tech">Pending Tech</option>
                <option value="pending-client">Pending Client</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-md"
                value={filters.dateFrom?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange({ dateFrom: e.target.value ? new Date(e.target.value) : undefined })}
                placeholder="From Date"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-md"
                value={filters.dateTo?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange({ dateTo: e.target.value ? new Date(e.target.value) : undefined })}
                placeholder="To Date"
              />
            </div>

            <div className="w-full">
              <div className="flex flex-wrap gap-2">
                {availableLabels.map((label) => (
                  <label
                    key={label.id}
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={filters.labels?.includes(label.id) || false}
                      onChange={(e) => {
                        const currentLabels = filters.labels || [];
                        const newLabels = e.target.checked
                          ? [...currentLabels, label.id]
                          : currentLabels.filter(id => id !== label.id);
                        handleFilterChange({ labels: newLabels });
                      }}
                      className="rounded text-blue-600"
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm text-gray-700">{label.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {Object.keys(filters).length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}