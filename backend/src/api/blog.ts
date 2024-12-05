import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt';
import { createBlogInputs, updateBlogInputs } from "tauqeer_zod_validation";

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }, 
    Variables:{
        userId: any
    }
}>();

// pass middleware
blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header('Authorization') || "";
    try{
      const user = await verify(authHeader, c.env.JWT_SECRET);
      if(user){
        c.set("userId", user.id);
        await next()
      }else{
        c.status(403);
        return c.json({
          message: "User has not not logged in"
        })
      }
    }catch(err){
      c.status(403);
      return c.json({
        message: "User has not not logged in"
      })
    }
})


// post blog
blogRouter.post('/', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  try{

      const body = await c.req.json();
      const authorId = c.get("userId");

      const { success } = createBlogInputs.safeParse(body);

      if(!success){
        c.status(411);
        return c.json({
          length: body.content.length,
          message: "Incorrect Blog inputs"
        })
      }

      const blog = await prisma.post.create({
        data:{
          title: body.title,
          content: body.content,
          authorId: String(authorId)
        }
      })

      return c.json({
        length: body.content.length,
        id: blog.id
      })

  }catch(err){
    c.status(411);
    return c.json({
      message: "error while updating the blog"
    })
  }
});


// update blog
// title
// content
// authorId (extract authorId from middleware)
blogRouter.put('/', async (c) => {

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{

        const body = await c.req.json();

        const { success } = updateBlogInputs.safeParse(body);

        if(!success){
          c.status(411);
          return c.json({
            message: "Incorrect Blog inputs"
          })
        }
        // console.log(body.id);
        // const authorId = c.get("userId");
        // console.log(authorId);
        const blog = await prisma.post.update({

          where: {
            id: body.id,
          },

          data:{
            title: body.title,
            content: body.content
          }

        })


        return c.json({
          id: blog.id,
          title: body.title,
          content: body.content
        })
        
    }catch(err){
      c.status(411);
      return c.json({
        message: "error while updating the blog"
      })
    }
});


// get all blogs
blogRouter.get('/bulk', async (c) => {

  
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  try{
  // get all blogs    
    const blogs = await prisma.post.findMany();

    return c.json({
      blogs
    })

  }catch(err){

    c.status(411);

    return c.json({
      message: "cant fetch all blogs"
    })

  }


})


// get blogs from blog id
blogRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())
  
  try{
    const findBlog = await prisma.post.findFirst({
      where:{
        id: id,
      }
    })
    
    if(!findBlog){
      c.status(404);
      return c.json({
        message: "Blog doesn't exists"
      })
    }

    return c.json({
      blog: findBlog
    })

  }catch(err){

  }

})

