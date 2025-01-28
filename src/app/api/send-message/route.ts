import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { Message } from "@/model/Users";

export async function POST(request:Request) {
      await dbConnect();
      
      const {username,content} = await request.json();

      try{
       const user = await UserModel.findOne({username});
        if(!user){
            return Response.json(
              {message:'user not found',success:false},
              {status:404}
            );
        }
        if(!user.isAcceptingMessage){
            return Response.json(
              {message:'User is not accepting messages',success:false},
              {status:403}
            );
        }
         
       const newMessage = {content,createdAt:new Date()}
       user?.messages.push(newMessage as Message)
       await user?.save();

       return Response.json(
        {message:'Message sent successfully',success:true},
        {status:201}
       );
      } catch(error){
          console.log("Error in sending messages API",error);
          return Response.json(
        {
            success:false,
            messages: "Internal server error"
        },
        {status:500}
       )
      }
}

