import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../../redux/jobSlice";

const FilterData = [
  {
    FilterType: "Location",
    Array: ["Abuja", "Lagos", "Kano", "Port Harcourt", "Calabar", "Remote"],
  },
  {
    FilterType: "Industry",
    Array: [
      "Frontend",
      "Backend Developer",
      "Full Stack",
      "MERN Stack",
      "Data Analysis",
    ],
  },
  {
    FilterType: "Salary",
    Array: ["500k-1m", "2M-5M", "6M-40M", "50M-120M"],
  },
];
export const FilterCard = () => {
  const [selectedValue, setSelectedvalue] = useState("");
  const dispatch = useDispatch();

  const ChangeHandler = (value) => {
    setSelectedvalue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [dispatch, selectedValue]);

  return (
    <aside className="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-950">Filter jobs</h2>
        {selectedValue && (
          <button
            type="button"
            onClick={() => setSelectedvalue("")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear
          </button>
        )}
      </div>
      <div className="mt-4 space-y-5">
        {FilterData.map((data, index) => (
          <div key={index}>
            <h3 className="text-sm font-bold text-slate-800">{data.FilterType}</h3>
            {data.Array.map((item, itemIndex) => {
              const itemid = `${data.FilterType}-${itemIndex}`;
              return(
              <div className="my-2 flex items-center gap-2" key={item}>
                <input
                  type="radio"
                  id={itemid}
                  name="job-filter"
                  value={item}
                  checked={selectedValue === item}
                  onChange={() => ChangeHandler(item)}
                  className="h-4 w-4 accent-blue-600"
                />
                
                <label htmlFor={itemid} className="cursor-pointer text-sm text-slate-600">
                  {item}
                </label>
              </div>
)})}
          </div>
        ))}
      </div>
    </aside>
  );
};
export default FilterCard;
