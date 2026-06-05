import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../../redux/jobSlice";

const FilterData = [
  {
    FilterType: "Location",
    Array: ["Abuja", "Lagos", "Kano", "Port Harcourt", "Calabar", "Remote"],
  },
  {
    FilterType: "Job type",
    Array: ["Full-time", "Part-time", "Remote", "Contract"],
  },
  {
    FilterType: "Salary",
    Array: ["500k-1m", "2M-5M", "6M-40M", "50M-120M"],
  },
];

export const FilterCard = ({ onFilterChange }) => {
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    Location: [],
    "Job type": [],
    Salary: [],
  });
  const dispatch = useDispatch();

  const toggleFilter = (type, value) => {
    setActiveFilters((prev) => {
      const nextOptions = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: nextOptions };
    });
  };

  const clearFilters = () => {
    setSearchText("");
    setActiveFilters({
      Location: [],
      "Job type": [],
      Salary: [],
    });
  };

  useEffect(() => {
    dispatch(setSearchedQuery(searchText));
    onFilterChange?.(activeFilters);
  }, [dispatch, searchText, activeFilters, onFilterChange]);

  return (
    <aside className="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-950">Filter jobs</h2>
        {(searchText || Object.values(activeFilters).some((items) => items.length > 0)) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="job-search" className="block text-sm font-medium text-slate-700">
          Search roles
        </label>
        <input
          id="job-search"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search jobs, skills, companies"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="mt-6 space-y-5">
        {FilterData.map((data, index) => (
          <div key={index}>
            <h3 className="text-sm font-bold text-slate-800">{data.FilterType}</h3>
            <div className="mt-3 grid gap-2">
              {data.Array.map((item) => {
                const itemId = `${data.FilterType}-${item}`;
                const checked = activeFilters[data.FilterType]?.includes(item);
                return (
                  <label key={itemId} htmlFor={itemId} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      id={itemId}
                      checked={checked}
                      onChange={() => toggleFilter(data.FilterType, item)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {item}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
export default FilterCard;
