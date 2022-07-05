import { createRouter } from "./context";
import { z } from "zod";

export const userRouter = createRouter()
  .query("create", {
    input: z.object({
      email: z.string().email().min(1),
      username: z.string().min(3),
      password: z.string().min(8)
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.user.create({
        data: input
      });
    },
  }).mutation("login", {
    input: z.object({
      username: z.string().min(3),
      password: z.string().min(8)
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.user.findFirst({
        where: input
      });
    }
  })
