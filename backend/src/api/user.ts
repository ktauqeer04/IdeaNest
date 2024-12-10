import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt';
import { signinInputs, signupInputs } from "tauqeer_zod_validation";
import bcrypt, { genSalt } from "bcryptjs";

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
      
      const body = await c.req.json();
      const { success }  = signupInputs.safeParse(body);

      if(!success){
          c.status(411);
        return c.json({
            email: body.email,
            message: "Incorrect Inputs"
        })
      }

      const findExistingUser = await prisma.user.findFirst({
        where:{
          email: body.email 
        }
      })
  
      if(findExistingUser){
        c.status(409);
        return c.json({
          message: "User Already Exists, Please signIn"
        })
      }

      const salt = await bcrypt.genSalt();
      
      const hashedPassword = await bcrypt.hash(body.password, salt);
  
      const user = await prisma.user.create({
        data:{
          email: body.email,
          name: body.name,
          password: hashedPassword
        },
      })
  
      const token = await sign({id: user.id}, c.env.JWT_SECRET)
  
      return c.json({
        jwt: token
      })

    }catch(err){
        c.status(411);
        return c.json({
          message: "Error while Signing Up"
        })
    }


});

userRouter.post('/signin', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
      }).$extends(withAccelerate())


    const body = await c.req.json();

    try{

        const success = signinInputs.safeParse(body);

        if(!success){
          c.status(411);
          return c.json({
            message: "incorrect Inputs"
          })
        }

        const findUser = await prisma.user.findUnique({
          where:{
            email: body.email
          },
        })

        if(!findUser){
            c.status(401);
            return c.json({
              message: "Unauthorized, please sign up"
            })
        }

        const validatePassword = await bcrypt.compare(body.password, findUser.password);

        if(validatePassword){
            const token = await sign({id: findUser.id}, c.env.JWT_SECRET)
          
            c.status(200);
            return c.json({
              message: "Signin successful",
              jwt: token
            })
        }

        c.status(401);

        return c.json({
          message:"Incorrect Password"
        })

    }catch(err){
      c.status(411);
      return c.json({
        message: "errror while signing in"
      })
    }

});

