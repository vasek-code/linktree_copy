// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../prisma/client";
import jwt from "jsonwebtoken";
import { Prisma, User } from "@prisma/client";

export const createContext = (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts?.req;
  const res = opts?.res;

  const user = jwt.verify(req?.cookies.token as string, process.env.JWT_SECRET as string) as User

  return {
    req,
    res,
    prisma,
    user
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
