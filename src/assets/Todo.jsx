import React, { useState, useEffect } from "react";
import axios from "axios";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
    setLoading(false);
  };

  const fetchTodoDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      setSelectedTodo(response.data);
    } catch (error) {
      console.error("Error fetching todo details:", error);
    }
    setLoading(false);
  };

  const handleTodoClick = (todo) => {
    fetchTodoDetails(todo.id);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/todos/${selectedTodo.id}`
      );
      setSelectedTodo(null);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const updatedTodo = { ...selectedTodo, completed: true };
      await axios.patch(
        `https://jsonplaceholder.typicode.com/todos/${selectedTodo.id}`,
        updatedTodo
      );
      fetchTodoDetails(selectedTodo.id);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full bg-white p-6 flex justify-center items-center">
        <h1 className="text-2xl font-bold">Todos</h1>
      </div>
      <div className="flex h-full">
        <div className="w-1/2 bg-white overflow-y-auto">
          {/* <h2 className="text-xl font-bold mb-4">Todos</h2> */}
          <ul className="border rounded-lg p-2">
            {loading ? (
              <li>Loading...</li>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`cursor-pointer py-2 px-4 ${
                    selectedTodo?.id === todo.id
                      ? "bg-gray-200"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleTodoClick(todo)}
                >
                  {todo.title}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-1/2 bg-gray-100 p-6">
          {selectedTodo ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Todo Details</h2>
              <p className="mb-2">
                <strong>Title:</strong> {selectedTodo.title}
              </p>
              <p className="mb-2">
                <strong>Completed:</strong>{" "}
                {selectedTodo.completed ? "Yes" : "No"}
              </p>
              <p className="mb-2">
                <strong>User ID:</strong> {selectedTodo.userId}
              </p>
              <div className="flex justify mt-5">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </button>
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded-lg ${
                    selectedTodo.completed
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
                  onClick={handleComplete}
                  disabled={loading || selectedTodo.completed}
                >
                  {selectedTodo.completed ? "Completed" : "Mark as Completed"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">Select a todo to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todos;
