import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";

export async function POST(request:Request) {
      await dbConnect();

      try{
          const {username,code} = await request.json()
          const decodedUsername = decodeURIComponent(username);
          const user = await UserModel.findOne({username:decodedUsername})

          if(!user){
            return Response.json({
            success: false,
            message: 'User not found',
         },{
            status:400
         })
        }
        const isCodeVerified = code === user?.verifyCode
        const isCodeExpired = new Date(user.verifyCodeExpiry)> new Date();

        if(isCodeExpired && isCodeVerified){
          user.isVerified = true;
          await user.save();
          return Response.json({
            success: true,
            message: 'Account Verified Successfully!',
         },{
            status:200
         })
          
        }else if(!isCodeExpired){
          return Response.json({
            success: false,
            message: 'Verification code has expired. Please signup again.',
         },{
            status:400
         })
        }else{
          return Response.json({
            success: false,
            message: 'Incorrect Verification Code',
         },{
            status:400
         })
        }

      } catch(error){
        console.log("Error in verification",error);
        return Response.json({
            
        })
      }
}