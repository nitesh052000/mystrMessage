import { resend } from "@/lib/resend"
import { ApiResponse } from "@/types/ApiResponse"
import VerificationEmail from "../../emails/VerificationEmail"

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode: string
): Promise<ApiResponse> {
     try{
      await resend.emails.send({
      from: 'you@example.com',
      to: email,
      subject: 'Mystry message Verification Code',
      react: VerificationEmail({username,otp:verifyCode}),
}); 
    return {success: true,message:"Verification email sent successfully."}      
     } catch(err){
        console.log("error in sending verification email",err);
        return {success:false,message:"Failed to send verification"}
     }
}
 