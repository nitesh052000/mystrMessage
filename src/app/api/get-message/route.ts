import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import {User} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    console.log("session",session);
    const user:User = session?.user as User

    if(!session || !user){
        return Response.json({
            success:false,
            message:"User is not authenticated"
        },{
            status:401
        })
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);
    console.log("uerId",userId);
    try{
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}},
        ]).exec();

         console.log("aggregation result",user);

        if(!user || user?.length === 0){
            return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
        }

        return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
        
    }catch(error){
        console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
    }

}