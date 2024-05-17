import TodeForm from "../TodoForm/TodeForm";
import Todo from "../Todo/Todo";
import { useTodoList } from "../../context/TodoListContext";
import TodoSelect from "./TodoSelect";
import { BlockStack, Box } from "@shopify/polaris";

function TodoList() {
  const { todolist, setTodoList } = useTodoList();

  return (
    <div>
      <BlockStack gap="500">
        <TodeForm></TodeForm>
        <TodoSelect></TodoSelect>
        <Box borderColor="border" borderWidth="025" borderEndEndRadius="200">
          <Todo todos={todolist} setTodos={setTodoList}></Todo>
        </Box>
      </BlockStack>
    </div>
  );
}

export default TodoList;
