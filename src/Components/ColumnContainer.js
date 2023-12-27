import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import Dropdown from "./Dropdown";
import { ADD_TASK } from "../Schemas/mutuations";
import { useMutation } from "@apollo/client";
import ModalComponent from "./Modal";

function ColumnContainer({
  column,

  updateColumn,
  createTask,
  tasks,

  updateTask,
}) {
  const [editMode, setEditMode] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [addTask, { data, loading, error }] = useMutation(ADD_TASK);
  const [showSucessAlert, setShowSucessAlert] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      opacity-40
      border-2
      border-pink-500
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  bg-columnBackgroundColor
  w-[350px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col
  "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColor
      border-4
      flex
      items-center
      justify-between
      "
      >
        <div className="flex gap-2">
          <div
            className="
        flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full
        "
          >
            {tasks.length}
          </div>
          {!editMode && column.title}
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          setTaskModal(true);
        }}
      >
        <PlusIcon />
        Add task
      </button>
      <ModalComponent
        title="Create Task"
        visible={taskModal}
        onCancel={() => {
          setTaskModal(false);
          setShowSucessAlert(false);
        }}
        maskClosable={true}
      >
        <TaskForm
          loading={loading}
          setSuccess={setShowSucessAlert}
          showSucessAlert={showSucessAlert}
          onFinish={(v) => {
            addTask({
              variables: { ...v, listId: column.id },
            })
              .then((e) => {
                setShowSucessAlert(true);
                createTask(column.id, e.data.createTask.task);
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

export default ColumnContainer;
