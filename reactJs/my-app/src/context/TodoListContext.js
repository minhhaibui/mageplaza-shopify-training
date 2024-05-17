import React, { createContext, useContext, useState } from "react";

const TodoListContext = createContext();

export const TodoListProvider = ({ children }) => {
  const [todolist, setTodoList] = useState([
    {
      id: "100",
      todo: "Mae Jemison",
      tagname: "Pending",
      checked: false,
    },
  ]);

  return (
    <TodoListContext.Provider value={{ todolist, setTodoList }}>
      {children}
    </TodoListContext.Provider>
  );
};

export const useTodoList = () => {
  return useContext(TodoListContext);
};
