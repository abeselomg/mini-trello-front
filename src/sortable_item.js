import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Avatar from "./Components/Avatar"
export function Item(props) {
  const { id } = props;

  return (
    <div className="bg-slate-50 rounded-lg cursor-pointer p-2  break-words">
      <div className="font-Montserrat text-sm font-semibold my-1">
        Improve cards readability
      </div>

      <div className="font-Montserrat text-xs font-normal line-clamp-2 text-wrap mb-4">Improve cards readabilityImprove cards readabilityImprove cards readabilityImprove cards readability</div>
      <div className="font-Montserrat font-normal mx-1 text-xs flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 fill-red-500 stroke-red-500">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
</svg> <span className="mx-1"> 21-03-2024</span>

      </div>
      <div className="flex justify-end">
         <Avatar />
      </div>
     
    </div>
  );
}

export default function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-green-50 border-2 rounded-lg cursor-pointer p-2 mb-3 break-words"
      {...style}
      {...attributes}
      {...listeners}
    >
      <Item id={props.id} />
    </div>
  );
}
