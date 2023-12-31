import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState, useEffect } from "react";
import ColumnContainer from "../Components/ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "../Components/TaskCard";
import { useQuery, gql, useMutation } from "@apollo/client";
import ModalComponent from "../Components/Modal";
import ListForm from "../Components/ListForm";
import { ADD_LIST, MOVE_TASK } from "../Schemas/mutuations";
import { GET_BOARDS, GET_LISTS } from "../Schemas/queries";

function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState([]);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  const [listModal, setListModal] = useState(false);
  const [showSucessAlert, setShowSucessAlert] = useState(false);

  const [colIds, setColIds] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const {
    loading: boardLoading,
    error: boardError,
    data: boardData,
  } = useQuery(GET_BOARDS);

  const { loading, error, data } = useQuery(GET_LISTS);

  const [addList] = useMutation(ADD_LIST);
  const [moveTask] = useMutation(MOVE_TASK);

  useEffect(() => {
    if (data) {
      let lists = Object.values(data).flat();
      let columnData = lists.map((e) => {
        return { id: e.listId, title: e.name };
      });
      let tasks = [];
      lists.forEach((i) => {
        let correctedTask = i.tasks.map((e) => {
          return {
            id: e.taskId,
            columnId: i.listId,
            title: e.title,
            content: e.description,
            dueDate: e.dueDate,
            assignedUsers: e.assignedUsers,
          };
        });
        tasks = [...tasks, ...correctedTask];
      });

      setColumns(columnData);
      setTasks(tasks);
    }
  }, [data]);

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        bg-slate-50
        text-black
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              // createNewColumn();
              setListModal(true);
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        <ModalComponent
          title="Create List"
          visible={listModal}
          onCancel={() => {
            setListModal(false);
            setShowSucessAlert(false);
          }}
          maskClosable={true}
        >
          <ListForm
            loading={loading}
            setSuccess={setShowSucessAlert}
            showSucessAlert={showSucessAlert}
            onFinish={(v) => {
              addList({
                variables: {
                  ...v,
                  boardId: boardData.boards[0].boardId,
                },
              })
                .then((e) => {
                  setShowSucessAlert(true);

                  createNewColumn(e.data.createList.list);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          />
        </ModalComponent>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId, taskData) {
    const newTask = {
      id: taskData.taskId,
      content: taskData.description,
      columnId,
      ...taskData,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn(list) {
    const columnToAdd = {
      id: list.listId,
      title: list.name,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event) {
    console.log(event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    let task = activeTask;

    console.log(colIds);

    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;

    moveTask({
      variables: {
        taskId: task.id,
        listId: colIds.colId,
        newListId: colIds.newColId,
      },
    }).catch((e) => {});

    if (!over) return;
    console.log("here 1", event);

    if (activeId === overId) return;
    console.log("here 2");

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          setColIds({
            colId: tasks[activeIndex].columnId,
            newColId: tasks[overIndex].columnId,
          });
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        setColIds({ colId: tasks[activeIndex].columnId, newColId: overId });

        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
