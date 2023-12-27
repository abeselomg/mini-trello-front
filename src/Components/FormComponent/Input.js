import React, { useRef,useEffect } from "react";

function Input({
  label = "",
  placeholder = "",
  onValueRequest ,
  type="text",
  value
}) {
  const inputRef = useRef(null);
  function handleGetValue() {
    onValueRequest(inputRef.current.value)
  }
  return (
    <div className="my-2">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        type={type}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  
      "
        ref={inputRef}
        placeholder={placeholder}
        onChange={handleGetValue}
        required
        defaultValue={value}
        value={value}
      />
    </div>
  );
}

export default Input;
