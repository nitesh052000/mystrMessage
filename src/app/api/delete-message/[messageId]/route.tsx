import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(request:Request,{ params }: { params: { messageid: string } }) {
        
    await dbConnect();
    const messageid = params.messageid;
    const session = await getServerSession(authOptions);
    const _user = session?.user as User | undefined;
    if(!session || !_user){
         return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
    }
   try{
    const updatedResult = await UserModel.updateOne(
        {_id:_user._id},
        {$pull:{messages:{_id:messageid}}}
    )
   
     if (updatedResult.modifiedCount === 0) {
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