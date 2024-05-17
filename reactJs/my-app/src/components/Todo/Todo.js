import {
  ResourceList,
  ResourceItem,
  Text,
  Checkbox,
  InlineStack,
  Tag,
  Button,
} from "@shopify/polaris";
function Todo({ todos, setTodos }) {
  const handleCheckChange = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              checked: !todo.checked,
              tagname: todo.checked ? "Pending" : "Done",
            }
          : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  return (
    <div>
      <ResourceList
        resourceName={{ singular: "Todo", plural: "Todos" }}
        items={todos}
        renderItem={(item) => {
          const { id, url, todo, tagname, checked } = item;
          return (
            <ResourceItem
              id={id}
              url={url}
              accessibilityLabel={`View details for ${todo}`}
            >
              <InlineStack align="space-between">
                <InlineStack
                  align="space-between"
                  gap={500}
                  blockAlign="center"
                >
                  <Checkbox
                    id={`checkbox-${id}`}
                    checked={checked}
                    onChange={() => handleCheckChange(id)}
                  />
                  <Text as="p">{todo}</Text>
                </InlineStack>
                <InlineStack gap={400} blockAlign="center">
                  <Tag>{tagname}</Tag>
                  <Button onClick={() => handleCheckChange(id)}>
                    completed
                  </Button>
                  <Button onClick={() => handleDelete(id)}>delete</Button>
                </InlineStack>
              </InlineStack>
            </ResourceItem>
          );
        }}
      />
    </div>
  );
}

export default Todo;
