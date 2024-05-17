import Header from "./layout/Header";
import { Box, Frame, InlineStack } from "@shopify/polaris";
import TodoList from "./TodoList/TodoList";
import { TodoListProvider } from "../context/TodoListContext";

function InlineWithAlignExample() {
  return (
    <TodoListProvider>
      <Frame>
        <Header></Header>
        <InlineStack align="center" blockAlign="center">
          <Box paddingBlockStart="2800" width="800px">
            <TodoList></TodoList>
          </Box>
        </InlineStack>
      </Frame>
    </TodoListProvider>
  );
}

export default InlineWithAlignExample;
