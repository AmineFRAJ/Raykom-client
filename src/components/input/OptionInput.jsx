import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";
const OptionInput = ({ optionList, setOptionList }) => {
  const [option, setOption] = useState("");

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim() && optionList.length < 4) {
      setOptionList([...optionList, option.trim()]);
      setOption("");
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedList = optionList.filter((_, i) => i !== index);
    setOptionList(updatedList);
  };

  return (
    <div>
      {optionList.map((item, index) => (
        <div
          key={item}
          className="flex justify-between bg-white px-4 py-2 rounded-md mb-3"
        >
          <p className="text-xs font-medium text-black">{item}</p>
          <button
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}
      {optionList.length < 4 && (
        <div className="flex items-center gap-5 mt-4">
          <input
            type="text"
            placeholder="Enter Option"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none px-3 py-[6px] rounded-md"
          />
          <button
            className="btn-small text-nowrap py-[6px]"
            onClick={handleAddOption}
          >
            <HiMiniPlus className="text-lg" /> Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionInput;
