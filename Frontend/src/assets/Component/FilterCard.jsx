import { Radio, RadioIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery, setSearchJobByText } from "../../redux/jobSlice";

const FilterData = [
  {
    FilterType: "Loacation",
    Array: ["Abuja", "Lagos", "Kano", "Porthacourt", "Calabar"],
  },
  {
    FilterType: "industry",
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
  const navigate = useNavigate()

  const ChangeHandler = (value) => {
    setSelectedvalue(value);
  };
  useEffect(() => {
    navigate(setSearchedQuery(selectedValue))
  }, [selectedValue]);
  return (
    <div className="w-full bg-w p-3 rounded-md">
      <h1>Filter Jobs</h1>
      <hr className="mt-3" />
      <div>
        {FilterData.map((data, index) => (
          <div key={index}>
            <h1 className="font-bold text-xl">{data.FilterType}</h1>
            {data.Array.map((item, itemIndex) => {
              const itemid = `r${index}`
              return(
              <div className="flex items-center space-x-2 my-2" key={itemIndex}>
                <input
                  type="radio"
                  id={`${itemid}`}
                  name={data.FilterType}
                  value={selectedValue}
                  onVolumeChange={ChangeHandler}
                />
                
                <label htmlFor={`${item}`}>
                  {item}
                </label>
              </div>
)})}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FilterCard;
