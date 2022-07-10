import { createRouter } from "./context";
import { z } from "zod";
import * as trpc from "@trpc/server";
import jwt from "jsonwebtoken"
import { User } from "@prisma/client";


export const userRouter = createRouter()
  .mutation("create", {
    input: z.object({
      email: z.string().email().min(1),
      username: z.string().min(1),
      password: z.string().min(8)
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.create({
        data: input
      })

      const token = jwt.sign(user, process.env.JWT_SECRET as string)

      return {
        token
      }
    },
  }).mutation("login", {
    input: z.object({
      username: z.string().min(1),
      password: z.string().min(8)
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: input
      });

      if (user?.password !== input.password) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Bad password"
        })
      }

      const token = jwt.sign(user as User, process.env.JWT_SECRET as string)

      return {
        token
      }
    }
  }).mutation("by-username", {
    input: z.object({
      username: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.user.findFirst({
        where: input
      })
    }
  }).query("by-username", {
    input: z.object({
      username: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.user.findFirst({
        where: input,
        select: {
          links: true,
          username: true,
          bio: true,
          iconUrl: true,
        }
      })
    }
  })
