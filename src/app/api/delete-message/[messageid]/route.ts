import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextRequest,NextResponse } from "next/server";

export async function DELETE(request:NextRequest,{ params }: { params: { messageid: string } }) {

  if (!params?.messageid) {
        return NextResponse.json({ success: false, message: 'Message ID is required' }, { status: 400 });
    }
        
    const messageid = params?.messageid;
    console.log("messageid",messageid);
     await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;
    if(!session || !user){
         return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
     );
    }
 
    const userId = new mongoose.Types.ObjectId(session.user._id);
    console.log("userId",userId);
   
   try{
    const updatedResult = await UserModel.updateOne(
        {_id:userId},
        { $pull: { messages: { _id: messageid} } } // Use $pull to remove from array
    )
    
    console.log("updated result",updatedResult);

     if (updatedResult?.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
    
   } catch(error){
      console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
   }

}