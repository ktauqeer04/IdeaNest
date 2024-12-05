import  z  from "zod";

export const signupInputs = z.object({
    email: z.string().email(),
    password: z.string().min(4),
    name: z.string().optional()
})

export const signinInputs = z.object({
    email: z.string().email(),
    password: z.string().min(4),
})

export const createBlogInputs = z.object({
    title: z.string(),
    content: z.string().min(10),
})

export const updateBlogInputs = z.object({
    title: z.string(),
    content: z.string().min(10),
    id: z.string()
})

export type SignupInputs = z.infer<typeof signupInputs>
export type SigninInputs = z.infer<typeof signinInputs>
export type CreateBlogInputs = z.infer<typeof createBlogInputs>
export type UpdateBlogInputs = z.infer<typeof updateBlogInputs>