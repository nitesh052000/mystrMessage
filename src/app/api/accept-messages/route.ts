import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
      return Response.json({
            success:false,
            message:"User is not authenticated"
        },{
            status:401
        })
    }
    const user = session?.user as User;
     const userId = user?._id;
     const {acceptMessages} = await request.json();


    try{
       const updatedUser = await UserModel.findByIdAndUpdate(userId,{
        isAcceptingMessage:acceptMessages
       },{new:true})

       if(!updatedUser){
         return Response.json({
                success:true,
                message:"Error in accepting messages"
            },{
                status:401
            })
       }

       return Response.json({
              success:true,
              message:"Successfully changed the toggle of accepting messages",updatedUser
         },{
              status:200
         })

    } catch(error){
        console.log("Error in changing toggle of accepting  messages",error);
            return Response.json({
             success:false,
             message:"Error in accepting messages"
        },{
            status:500
        })
    }
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
    }
     const userId = new mongoose.Types.ObjectId(session.user._id);
    try{
       const foundUser = await UserModel.findById(userId);

       if(!foundUser){
         return Response.json({
                success:false,
                message:"User not found"
            },{
                status:401
            })
       }

       return Response.json({
              success:true,
              isAcceptingMessage:foundUser.isAcceptingMessage
         },{
              status:200
         })

    } catch(error){
        console.log("Error in fetching toggle of accepting  messages",error);
            return Response.json({
             success:false,
             message:"Error in accepting messages"
        },{
            status:500
        })
    }
}