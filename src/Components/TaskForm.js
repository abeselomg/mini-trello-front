import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Input from "./FormComponent/Input";
import MultiSelectDropdown from "./FormComponent/MultiSelectBox";
import LoadingIcon from "../icons/LoadingIcon";
import SucessAlert from "./SucessAlert";
import { GET_USERS } from "../Schemas/queries";
import { useQuery } from "@apollo/client";
function TaskForm({
  loading,
  onFinish,
  setSuccess,
  showSucessAlert,
  editingValues,
  
}) {
  const [formVals, setFormVals] = useState({});
  const [users, setUsers] = useState([]);

  const {
    loading: usersLoading,
    error: usersError,
    data: allUsers,
  } = useQuery(GET_USERS);

  useEffect(() => {
    if (editingValues) {
      setFormVals(editingValues);
    }
  }, []);

  useEffect(() => {
    if (allUsers) {
      setUsers(allUsers.users);
    }
  }, [allUsers]);


  // let users = [
  //   {
  //     __typename: "UserObject",
  //     userId: "3acf8c1d-cc7d-4f79-a36a-07bbe7a3986a",
  //     name: "Jane Doe",
  //   },

  //   {
  //     __typename: "UserObject",
  //     userId: "d09cdc3e-fc45-415e-b543-ec99499dcc50",
  //     name: "Jhon Doe",
  //   },
  // ];

  const handleChange = (val) => {
    setFormVals((prev) => {
      return { ...prev, ...val };
    });
  };

  return (
    <div>
      <Input
        label="Title"
        onValueRequest={(e) => {
          handleChange({ title: e });
        }}
        value={formVals["title"]}
      />
      <Input
        label="Description"
        onValueRequest={(e) => {
          handleChange({ description: e });
        }}
        value={formVals["content"]}
      />
      <Input
        label="Due Date"
        type="date"
        onValueRequest={(e) => {
          handleChange({ dueDate: format(new Date(e), "yyyy-MM-dd") });
        }}
        value={formVals["dueDate"] }
      />

      <MultiSelectDropdown
        options={users.map((e) => {
          return { label: e.name, value: e.userId };
        })}
        onValueRequest={(e) => {
          handleChange({ assignedUsers: e });
        }}
        initialValue={formVals["assignedUsers"]}
      />
      <button
        type="button"
        onClick={() => {
          onFinish(formVals);
        }}
        class=" my-2 float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
      >
        {loading ? <LoadingIcon /> : <></>}
        Submit
      </button>
      {!showSucessAlert ? (
        <></>
      ) : (
        <SucessAlert
          text="Task operation completed Successfully"
          onClose={() => {
            setSuccess(false);
          }}
        />
      )}
    </div>
  );
}

export default TaskForm;
