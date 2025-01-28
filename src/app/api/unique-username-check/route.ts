import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import {z} from "zod";
import {usernameValidation} from "@/schemas/sighUpSchema"

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
     await dbConnect()

     try{
         const {searchParams} = new URL(request.url)
         
         const queryParam = {
             username: searchParams.get('username')
         }

         //  validate with Zod
       const result =  UsernameQuerySchema.safeParse(queryParam);

       console.log("result",result);
       if(!result.success){
         return Response.json({
            success: false,
            message: 'Invalid query Parameters',
         },{
            status:400
         })
       }

       const {username} = result?.data;
       const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});

       console.log("existing model",existingVerifiedUser);

       if(existingVerifiedUser){
        return Response.json(
            {
                success: false,
                message: 'Username is already taken',
            },
            {status:400}
        );
       }
       return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            {status:200}
        );


     } catch(error){
        console.log("Error in checking username",error);
        return Response.json({
            success:false,
            message: "Error checking username"
        })
     }
}
