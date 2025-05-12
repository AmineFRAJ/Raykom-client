import React from "react";

const EmptyCard = ({ imgSrc, message, btnText, onClick }) => {
  return (
    <div className="bg-green-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg">
      <img src={imgSrc} alt="No notes" className="w-36 h-36 md:w-48 md:h-36"  />
      <p className="w-2/3 text-xs md:text-[14px] text-slate-900 text-center">
        {" "}
        {message}
      </p>
      {btnText && (
  <button className="btn-small px-6 py-2 mt-7" onClick={onClick}>
    {btnText}
  </button>
)}

    </div>
  );
};

export default EmptyCard;
