import React, { memo } from "react";
import { colorsList } from "../Utils/ColorList";


const Avatar = memo(function Avatar(length = 2) {
  return (
    <div class="flex -space-x-3 rtl:space-x-reverse">
      <img
        class="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
        src={`https://ui-avatars.com/api/?name=John+Doe&background=${
          colorsList[0]
        }&color=fff`}
        alt=""
      />
      <img
        class="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
        src={`https://ui-avatars.com/api/?name=John+Doe&background=${
          colorsList[1]
        }&color=fff`}
        alt=""
      />
      <img
        class="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
        src={`https://ui-avatars.com/api/?name=John+Doe&background=${
          colorsList[2]
        }&color=fff`}
        alt=""
      />
   
    </div>
  );
});
export default Avatar;
