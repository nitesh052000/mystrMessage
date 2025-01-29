'use client';
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'; 
import { useDebounceValue } from 'usehooks-ts'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sighUpSchema } from '@/schemas/sighUpSchema';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';

export default function SignUpForm() {

  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [checkingUsername,setIsCheckingUsername] = useState(false);
  const debouncedUsername = useDebounceValue(username,300);
  const [isSubmitting ,setIsSubmitting] = useState(false);

  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof sighUpSchema>>({
    resolver : zodResolver(sighUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:'',
    },
  });

  useEffect(() => {
      const checkUsernameUnique = async () => {
         if(debouncedUsername){
           setIsCheckingUsername(true);
           try{
            const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
           setUsernameMessage(response?.data?.message);
           } catch(error){
                 const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
           } finally{
            setIsCheckingUsername(false);
           }
         }
      }
      checkUsernameUnique();
  },[debouncedUsername]);
 
  const onSubmit = async(data:z.infer<typeof sighUpSchema>) =>{
     setIsSubmitting(true);
     try{
       const response = await axios.post("/api/sign-up",data);
       toast({
        title:'Success',
        description: response.data.message,
       });
       
      //  router.replace() TODO 

      setIsSubmitting(false);
     }catch(error){
         console.log('error duting sigh up',error);
         const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      const errorMessage = axiosError.response?.data.message;
      // ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
     }
  }
  
  return (
    <div className='flex justify-center items-center bg-gray-800 min-h-screen'>
      <div className=' w-full max-w-md p-8 space-y-8 bg-slate-50 rounded-lg shadow-md'>
       <div className=' text-center'>
         <h1 className=' text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join True Feedback</h1>
         <p className='mb-6'>Sign up to start your anonymous adventure</p>
       </div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' font-bold'>Username</FormLabel>
                <Input {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setUsername(e.target.value);
                }}
                />
                {checkingUsername && <Loader2 className='animate-spin' />}

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' font-bold'>Email</FormLabel>
                <Input  {...field} name='email' />
                <p className=' text-gray-400 text-sm'>We will send you a verification code</p>
              <FormMessage />
            </FormItem>
          )}
        />
         
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' font-bold'>Password</FormLabel>
                <Input type='password'  {...field} name="password"/>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className=' w-full' type="submit" disabled={isSubmitting}>{
          isSubmitting ?(
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                </>
          ) :('Sign Up')
          }</Button>
      </form>
    </Form>
    <div className=' text-center'>
     <p className='font-bold'>
      Already a member?
      <Link href="/sign-in" className='text-blue-600 hover:text-blue-800'>Sigh in</Link>
     </p>
    </div>
      </div>
    </div>
  )
}

