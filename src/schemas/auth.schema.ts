import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string("E-mail é obrigatório.")
    .trim()
    .superRefine((value: string, ctx: z.RefinementCtx<string>) => {
      if (value.length === 0) {
        ctx.addIssue({ code: "custom", message: "E-mail é obrigatório." })
        return
      }
      if (!z.email().safeParse(value).success) {
        ctx.addIssue({ code: "custom", message: "Informe um e-mail válido." })
      }
    }),
  password: z.string("Senha é obrigatória.").min(1, "Senha é obrigatória."),
})

export type LoginValues = z.infer<typeof loginSchema>
