import React from "react";
import { colorsList } from "../Utils/ColorList";

function Avatar({users = []}) {
  return (
    <div className="flex -space-x-3 rtl:space-x-reverse">
      {users.map((e,i) => (
        <img
          className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
          src={`https://ui-avatars.com/api/?name=${e.name.replace(" ","+")}&background=${colorsList[i]}&color=fff`}
          alt=""
        />
      ))}
    </div>
  );
}
export default Avatar;
