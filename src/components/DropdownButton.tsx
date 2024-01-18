import React, { useState } from 'react';

interface Dropdown {
  text: string;
  children: React.ReactNode;
}

export const DropdownButton = ({ text, children }: Dropdown) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dropdown inline-block relative">
      <button
        data-dropdown-toggle="dropdown"
        onClick={toggleDropdown}
        className="text-white transition-all w-[200px] whitespace-pre-wrap duration-100 hover:bg-red-800 bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-between items-center "
        type="button"
      >
        {text}
        <i
          className={`fa-solid fa-chevron-up up-icon-dropdown ${
            isDropdownOpen ? 'hidden' : ''
          }`}
        ></i>
        <i
          className={`fa-solid fa-chevron-down down-icon-dropdown ${
            isDropdownOpen ? '' : 'hidden'
          }`}
        ></i>
      </button>

      <ul
        className={`dropdown-items ${isDropdownOpen ? '' : 'hidden'} text-gray-700`}
      >
        <li className="flex justify-center p-2">{children}</li>
      </ul>
    </div>
  );
};
