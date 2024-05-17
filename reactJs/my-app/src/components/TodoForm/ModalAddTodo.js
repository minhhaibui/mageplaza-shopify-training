import { Form, FormLayout, Modal, TextField } from "@shopify/polaris";
import { useState } from "react";
import { useTodoList } from "../../context/TodoListContext";
import { v4 as uuidv4 } from "uuid";

function ModalAddTodo({ handleChange, active }) {
  const { todolist, setTodoList } = useTodoList();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const newTodo = {
      id: uuidv4(),
      todo: text,
      tagname: "Pending",
      checked: false,
    };
    setTodoList([...todolist, newTodo]);
    setText("");
    handleChange();
  };
  return (
    <Modal
      open={active}
      onClose={handleChange}
      title="Create a new todo"
      primaryAction={{
        content: "Cancel",
        onAction: handleChange,
      }}
      secondaryActions={[
        {
          content: "Create",
          onAction: handleSubmit,
        },
      ]}
    >
      <Modal.Section>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              type="text"
              value={text}
              placeholder="this is my todo name"
              onChange={(value) => {
                setText(value);
              }}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}

export default ModalAddTodo;
