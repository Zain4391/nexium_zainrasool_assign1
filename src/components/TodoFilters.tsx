"use client";

interface Filters {
  search: string;
  priority: string;
  completed: string;
  sort: string;
  order: string;
}

interface TodoFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function TodoFilters({
  filters,
  onFilterChange,
}: TodoFiltersProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      priority: "all",
      completed: "all",
      sort: "createdAt",
      order: "desc",
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search todos..."
            className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) => updateFilter("priority", e.target.value)}
            className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Completion Status */}
        <div>
          <label
            htmlFor="completed"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="completed"
            value={filters.completed}
            onChange={(e) => updateFilter("completed", e.target.value)}
            className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="all">All Todos</option>
            <option value="false">Active</option>
            <option value="true">Completed</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="text-gray-600 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
            <select
              value={filters.order}
              onChange={(e) => updateFilter("order", e.target.value)}
              className="text-gray-600 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear Filters
        </button>
      </div>

      {/* Active Filters Display */}
      {(filters.search ||
        filters.priority !== "all" ||
        filters.completed !== "all") && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.search && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
              Search: "{filters.search}"
            </span>
          )}
          {filters.priority !== "all" && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
              Priority: {filters.priority}
            </span>
          )}
          {filters.completed !== "all" && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
              Status: {filters.completed === "true" ? "Completed" : "Active"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
