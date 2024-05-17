import { BlockStack, Box, Button, InlineStack, Text } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import ModalAddTodo from "./ModalAddTodo";

const TodeForm = () => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  return (
    <div>
      <BlockStack gap="100" as="div">
        <Box width="100%">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h2">Todos</Text>
            <Button
              tone="success"
              variant="primary"
              size="medium"
              onClick={handleChange}
            >
              Create Todo
            </Button>
          </InlineStack>
        </Box>
      </BlockStack>
      <Box width="100%">
        <ModalAddTodo
          handleChange={handleChange}
          active={active}
        ></ModalAddTodo>
      </Box>
    </div>
  );
};

export default TodeForm;
