import { Box, Container, Flex, VStack } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import React from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
const AuthPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
      <Container maxW={"container.md"} padding={0}>
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
          {/*Left-hand-side8*/}
          <Box display={{ base: "none", md: "block" }}>
            <Image src="/auth.png" h={480} alt="Welcome to Instagram." />
          </Box>

          {/*right-hand-side*/}
          <VStack spacing={4} align={"stretch"}>
            <AuthForm />
            <Box textAlign={"center"}>Get The App.</Box>
            <Flex gap={5} justifyContent={"center"}>
              <Image src="/play.png" h={"10"} alt="Playstore logo." />
              <Image src="/ms.png" h={"10"} alt="Microsoft logo." />
            </Flex>
          </VStack>
        </Flex>
      </Container>
    </Flex>
  );
};

export default AuthPage;
