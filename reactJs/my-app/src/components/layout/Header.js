import React from "react";
import "./style.css";
import { Text, InlineStack, BlockStack, Box, Image } from "@shopify/polaris";

const Header = () => {
  return (
    <>
      <BlockStack gap="100" as="div">
        <Box
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "56px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <InlineStack align="center" blockAlign="center">
            <Image
              source={`${process.env.PUBLIC_URL}/logo_mageplaza.svg`}
              alt="Logo Mageplaza"
              style={{ width: "100%" }}
            />
          </InlineStack>
          <InlineStack align="space-between" gap="500" blockAlign="center">
            <div className="custom-avatar">BM</div>
            <Text as="p" variant="bodyMd" alignment="center">
              Bùi Minh Hải
            </Text>
          </InlineStack>
        </Box>
      </BlockStack>
    </>
  );
};

export default Header;
