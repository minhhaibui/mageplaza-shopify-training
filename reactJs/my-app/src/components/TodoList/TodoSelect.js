import React, { useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  Checkbox,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { useTodoList } from "../../context/TodoListContext";

const TodoSelect = () => {
  const { todolist, setTodoList } = useTodoList();
  const [select, setSelect] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleSelect = () => {
    setTodoList(
      todolist.map((todo) => ({
        ...todo,
        checked: true,
        tagname: "Done",
      }))
    );
    setSelect(true);
  };
  const handleUnselected = () => {
    setTodoList(
      todolist.map((todo) => ({
        ...todo,
        checked: false,
        tagname: "Pending",
      }))
    );
    setSelect(false);
  };

  const handleCompletedAll = (id) => {
    // setTodos((prevTodos) =>
    //   prevTodos.map((todo) =>
    //     todo.id === id
    //       ? {
    //           ...todo,
    //           checked: !todo.checked,
    //           tagname: todo.checked ? "Pending" : "Done",
    //         }
    //       : todo
    //   )
    // );
  };

  return (
    <div>
      <BlockStack gap="100" as="div">
        <Box width="100%">
          <InlineStack align="space-between" blockAlign="center">
            {select ? (
              <InlineStack gap={400} blockAlign="center">
                <Checkbox
                  checked={!checked}
                  onChange={() => handleUnselected()}
                />
                <Text as="h2">{`sel...${todolist.length}`}</Text>
                <Button>completed</Button>
                <Button>delete</Button>
              </InlineStack>
            ) : (
              <Text as="h2">{`Showing ${todolist.length} todo `}</Text>
            )}

            {!select && (
              <Button
                onClick={() => handleSelect()}
                size="medium"
                className="custom-button"
              >
                Select
              </Button>
            )}
          </InlineStack>
        </Box>
      </BlockStack>
    </div>
  );
};

export default TodoSelect;
