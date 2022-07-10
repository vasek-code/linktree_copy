import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/config";
import { CookiesProvider } from "react-cookie";
import { ReactQueryDevtools } from "react-query/devtools";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <CookiesProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
      <ReactQueryDevtools />
    </CookiesProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      return {
        transformer: superjson,
        url: "/api/trpc",
      };
    }

    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
          "x-ssr": "1",
        };
      },
    };
  },
  ssr: true,
})(MyApp);
