import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import CheckIcon from "../icons/CheckIcon";
import CancelIcon from "../icons/CancelIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Avatar from "./Avatar";
import FlagIcon from "../icons/FlagIcon";
import ModalComponent from "./Modal";
import EditIcon from "../icons/EditIcon";
import Input from "./FormComponent/Input";
import TaskForm from "./TaskForm";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../Schemas/mutuations";
import SucessAlert from "./SucessAlert";
function TaskCard({ task, updateTask, users }) {
  const [addTask, { data, loading, error }] = useMutation(ADD_TASK);

  const [editMode, setEditMode] = useState(false);
  const [showSucessAlert, setShowSucessAlert] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
       
      bg-columnBackgroundColor p-2.5 h-[150px] min-h-[150px] items-center flex text-left  text-slate-800 rounded-xl border-2 border-gray-700 cursor-grab relative 
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor p-2.5 h-[150px] min-h-[150px] overflow-y-auto items-center  text-left  text-slate-800 rounded-xl hover:ring-2 hover:ring-inset hover:ring-gray-700 cursor-grab relative"
    >
      {/* <div className="float-right cursor-pointer" onClick={toggleEditMode}>
        <EditIcon />
      </div> */}
      <div
        className="
      font-bold my-1 line-clamp-1 text-wrap  w-full resize-none border-none rounded-md  bg-transparent  focus:outline-none 
    "
        placeholder="Task content here"
        onChange={(e) => updateTask(task.id, e.target.value)}
      >
        {task.title}
      </div>
      <div className="my-1 text-sm mb-3 font-normal line-clamp-2 text-wrap">
        {task.content}
      </div>
      {task.dueDate ? (
        <div className="flex gap-1 items-end">
          <FlagIcon />
          <>{new Date(task.dueDate).toLocaleDateString()}</>
        </div>
      ) : (
        ""
      )}
      <div className="float-right">
        <Avatar users={task.assignedUsers} />
      </div>
      <ModalComponent
        visible={editMode}
        onCancel={toggleEditMode}
        maskClosable={true}
      >
        <TaskForm
          loading={loading}
          setSuccess={setShowSucessAlert}
          showSucessAlert={showSucessAlert}
          editingValues={task}
          users={users}
          onFinish={(v) => {
            addTask({
              variables: { ...v, listId: task.columnId },
            })
              .then((e) => {
                setShowSucessAlert(true);
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        />
      </ModalComponent>
    </div>
  );
}

export default TaskCard;
