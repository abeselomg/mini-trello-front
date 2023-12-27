import React,{useState,useEffect} from 'react'
import Input from './FormComponent/Input'
import LoadingIcon from '../icons/LoadingIcon';
import SucessAlert from './SucessAlert';
function ListForm({
    loading,
    onFinish,
    setSuccess,
    showSucessAlert,
    editingValues,
  }) {
    const [formVals, setFormVals] = useState({});
    useEffect(() => {
      if (editingValues) {
        setFormVals(editingValues);
      }
    }, []);
  

  
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
            handleChange({ name: e });
          }}
          value={formVals["name"]}
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
  
  export default ListForm;
  