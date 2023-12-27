import React, { useState, useRef, useEffect } from "react";
function MultiSelectDropdown({ options, onValueRequest, initialValue }) {
  const [values, setValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (initialValue) {
      setValues(
        initialValue.map((e) => {
          return { label: e.name, value: e.userId };
        })
      );
    }
  }, []);

  const inputRef = useRef(null);
  function handleGetValue() {
    onValueRequest(values.map((e) => e.value));
  }

  useEffect(() => {
    if (values.length) {
      handleGetValue();
    }
  }, [values]);

  const onCheckedValue = (val) => {
    setValues((prev) => {
      return [...prev, val];
    });
  };
  const onUncheckedValue = (val) => {
    setValues((prev) => {
      const updatedArray = prev.filter((item) => item.value !== val);
      return updatedArray;
    });
  };
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Select Users
      </label>
      <div
        className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex justify-between ">
          <div className="text-black">
            {values.map((e) => e.label).join(", ")}{" "}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {isOpen ? (
        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
          <ul ref={inputRef}>
            {options.map((option, i) => {
              return (
                <li key={option.value}>
                  <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                    <input
                      type="checkbox"
                      name={option.value}
                      //   value={option}
                      checked={values.some((e) => option.value === e.value)}
                      className="cursor-pointer"
                      onChange={(e) => {
                        e.target.checked
                          ? onCheckedValue(option)
                          : onUncheckedValue(option.value);
                      }}
                    />
                    <span className="ml-1">{option.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
export default MultiSelectDropdown;
