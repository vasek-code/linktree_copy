import { Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import { TextInput } from "../components/TextInput";
import { trpc } from "../utils/trpc";
import { LoginImage } from "../components/LoginImage";
import Link from "next/link";
import Router from "next/router";
import { Loader } from "../components/Loader";
import { useCookies } from "react-cookie";

const SignUpPage: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);

  const [validationError, setValidationError] = useState(
    new Map<String, String>()
      .set("email", "")
      .set("username", "")
      .set("password", "")
  );

  const [errorMessage, setErrorMessage] = useState("");

  const userByUsernameMutation = trpc.useMutation(["user.by-username"]);

  const userCreateMutation = trpc.useMutation(["user.create"], {
    onSuccess: async () => {
      setValidationError(
        new Map<String, String>()
          .set("username", "")
          .set("password", "")
          .set("email", "")
      );
    },
    onError: async (error) => {
      setValidationError(
        new Map<String, String>()
          .set("email", "")
          .set("username", "")
          .set("password", "")
      );

      let parsedError = null;

      try {
        parsedError = JSON.parse(error.message) as Array<{
          code: String;
          message: String;
          path: Array<String>;
          validation: String;
        }>;
      } catch (e) {}

      parsedError?.forEach((e) => {
        setValidationError(
          (prev) => new Map([...prev, [e.path[0] as String, e.message]])
        );
      });

      try {
        const exists = await userByUsernameMutation.mutateAsync({
          username,
        });

        if (exists) {
          setValidationError(
            (prev) =>
              new Map([
                ...prev,
                ["username", `The username "${username}" is already taken.`],
              ])
          );
        }
      } catch (e) {}
    },
  });

  async function handleSubmit() {
    const user = await userCreateMutation.mutateAsync({
      password,
      username,
      email,
    });

    if (user.token) {
      setCookie("token", user.token, { path: "*" });
      Router.push(`/${username}`);
    }
  }

  return (
    <>
      <Flex p="45px" position="absolute">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          role="icon"
          fill="none"
          aria-labelledby="title desc"
          style={{
            cursor: "pointer",
          }}
        >
          <title>Linktree Logo</title>

          <desc>Linktree Logo Symbol and Word Mark</desc>
          <g transform="scale(1.6)">
            <title>Layer 1</title>
            <path
              d="m0,1.72687l2.25964,0l0,11.90443l6.24618,0l0,2.0931l-8.50582,0l0,-13.99753zm10.7287,0c0.1834,-0.00243 0.3654,0.03129 0.5357,0.09922c0.1704,0.06793 0.3256,0.16875 0.457,0.29669c0.1314,0.12795 0.2362,0.28052 0.3086,0.449c0.0724,0.16848 0.1109,0.34957 0.1133,0.53292c0,0.37517 -0.149,0.73497 -0.4143,1.00026c-0.2653,0.26528 -0.6251,0.41432 -1.0003,0.41432c-0.3751,0 -0.73495,-0.14904 -1.00023,-0.41432c-0.26529,-0.26529 -0.41432,-0.62509 -0.41432,-1.00026c0.00076,-0.18383 0.03815,-0.36567 0.10997,-0.53489c0.07182,-0.16923 0.17664,-0.32245 0.30833,-0.45072c0.13169,-0.12827 0.28765,-0.22901 0.45865,-0.29636c0.1711,-0.06734 0.3538,-0.09993 0.5376,-0.09586zm-1.10225,3.91304l2.16775,0l0,10.08449l-2.16775,0l0,-10.08449zm3.43535,0l2.1678,0l0,1.39621c0.6418,-1.06553 1.7441,-1.67177 3.1954,-1.67177c2.3515,0 3.8212,1.83711 3.8212,4.75815l0,5.6019l-2.1678,0l0,-5.4182c0,-1.89225 -0.8267,-2.95777 -2.3197,-2.95777c-1.6338,0 -2.534,1.12063 -2.534,3.14147l0,5.2345l-2.1677,0l0.0048,-10.08449zm10.3234,-3.91304l2.1678,0l0,8.85483l4.0416,-4.94179l2.7189,0l-4.3172,5.05209l4.3172,5.0324l-2.7189,0l-4.0416,-4.9222l0,4.9222l-2.1678,0l0,-13.99753zm9.7734,1.34721l2.2045,0l0,2.57196l2.572,0l0,1.80037l-2.572,0l0,5.19779c0,0.6626 0.4042,1.0667 1.0288,1.0667l1.4526,0l0,2.0196l-1.7465,0c-1.8922,0 -2.9394,-1.1206 -2.9394,-3.1034l0,-9.55302zm5.7318,2.57196l2.1678,0l0,1.24923c0.5327,-0.95529 1.4329,-1.5248 2.5352,-1.5248c0.2544,-0.01159 0.509,0.01946 0.7532,0.09186l0,2.02082c-0.2653,-0.05829 -0.5369,-0.08298 -0.8083,-0.07349c-1.5983,0 -2.4801,1.34722 -2.4801,3.65584l0,4.665l-2.1678,0l0,-10.08446zm10.5254,-0.27557c2.3882,0 4.9786,1.45132 4.9786,5.54803l0,0.294l-7.771,0c0.1666,1.7991 1.2125,2.7912 2.9577,2.7912c1.2493,0 2.3148,-0.6798 2.5536,-1.6155l2.2046,0c-0.2205,2.0196 -2.3148,3.6179 -4.7582,3.6179c-3.123,0 -5.0875,-2.0392 -5.0875,-5.3264c0,-2.92711 1.8922,-5.31535 4.9222,-5.31535l0,0.00612zm2.6638,4.04164c-0.3123,-1.24923 -1.286,-2.03919 -2.6638,-2.03919c-1.3227,0 -2.2584,0.80833 -2.6258,2.03919l5.2896,0zm8.1935,-4.04164c2.3883,0 4.9786,1.45132 4.9786,5.54803l0,0.294l-7.771,0c0.1653,1.7991 1.2125,2.7912 2.9578,2.7912c1.2492,0 2.3147,-0.6798 2.5535,-1.6155l2.2046,0c-0.2205,2.0196 -2.3148,3.6179 -4.7581,3.6179c-3.1231,0 -5.0888,-2.0392 -5.0888,-5.3264c0,-2.92711 1.8922,-5.31535 4.9234,-5.31535l0,0.00612zm2.6638,4.04164c-0.3123,-1.24923 -1.2859,-2.03919 -2.6638,-2.03919c-1.3227,0 -2.2596,0.80833 -2.6271,2.03919l5.2909,0z"
              fill="#ffffff"
              id="svg_1"
            />
            <path
              d="m65.7852,5.33374l3.8763,0l-2.7557,-2.62706l1.5248,-1.56767l2.6271,2.70055l0,-3.83956l2.278,0l0,3.83956l2.627,-2.69443l1.5236,1.56155l-2.7544,2.62094l3.8751,0l0,2.16779l-3.8972,0l2.7729,2.69439l-1.52,1.531l-3.766,-3.78449l-3.7661,3.78449l-1.5248,-1.5248l2.774,-2.69447l-3.8946,0l0,-2.16779zm5.2663,5.27246l2.2781,0l0,5.144l-2.2781,0l0,-5.144z"
              fill="#43E660"
              id="svg_2"
            />
          </g>
        </svg>
      </Flex>
      <Flex w="100%" h="100vh" align="center">
        <Flex w="100%" flexDir="column" align="center">
          <Flex maxW="600px" w="100%" flexDir="column" pb="200px">
            <Flex w="100%" pb="50px">
              <Text fontSize="48px" fontWeight="800" letterSpacing="-2px">
                Create an account for free
              </Text>
            </Flex>

            <Flex w="100%" pb="0.7rem" flexDir="column" gap="9px">
              <Input
                background="#252525"
                w="100%"
                h="45px"
                placeholder="Username"
                border={validationError.get("username") && "2px solid #cd3740"}
                borderColor={validationError.get("username") && "#cd3740"}
                _hover={{
                  border: "1px solid gray",
                }}
                _focusVisible={{
                  border: "2px solid gray",
                }}
                fontWeight="semibold"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
              />
              {validationError.get("username") && (
                <Text pl="5px" fontWeight="semibold" color="#cd3740">
                  {validationError.get("username")}
                </Text>
              )}
            </Flex>
            <Flex w="100%" pb="0.7rem" flexDir="column" gap="9px">
              <Input
                background="#252525"
                w="100%"
                h="45px"
                placeholder="Email"
                border={validationError.get("email") && "2px solid #cd3740"}
                borderColor={validationError.get("email") && "#cd3740"}
                _hover={{
                  border: "1px solid gray",
                }}
                _focusVisible={{
                  border: "2px solid gray",
                }}
                fontWeight="semibold"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
              />
              {validationError.get("email") && (
                <Text pl="5px" fontWeight="semibold" color="#cd3740">
                  {validationError.get("email")}
                </Text>
              )}
            </Flex>
            <Flex w="100%" flexDir="column" gap="9px" pb="50px">
              <Input
                background="#252525"
                w="100%"
                h="45px"
                placeholder="Password"
                border={validationError.get("password") && "2px solid #cd3740"}
                borderColor={validationError.get("password") && "#cd3740"}
                _hover={{
                  border: "1px solid gray",
                }}
                _focusVisible={{
                  border: "2px solid gray",
                }}
                fontWeight="semibold"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
              />
              {validationError.get("password") && (
                <Text pl="5px" fontWeight="semibold" color="#cd3740">
                  {validationError.get("password")}
                </Text>
              )}
            </Flex>

            <Flex w="100%" pb="35px">
              {userCreateMutation.isLoading ? (
                <IconButton
                  aria-label="loading"
                  icon={
                    <Flex justify="center" align="center">
                      <Loader size="70px" />
                    </Flex>
                  }
                  disabled
                  w="100%"
                  h="45px"
                  borderRadius="64px"
                />
              ) : (
                <Button
                  w="100%"
                  h="45px"
                  fontSize="16px"
                  borderRadius="64px"
                  onClick={handleSubmit}
                >
                  Sign up with email
                </Button>
              )}
            </Flex>
            <Flex w="100%" justify="center" pb="35px">
              <Link href="/login">
                <Button variant="link" fontWeight="semibold" color="white">
                  Already have an account?
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Flex>
        <LoginImage />
      </Flex>
    </>
  );
};

export default SignUpPage;
