'use client';
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'; 
import { useDebounceValue } from 'usehooks-ts';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sighInSchema } from '@/schemas/sighInSchema';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SignInForm() {

  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [loader, setLoader] = useState('');
  const debouncedUsername = useDebounceValue(username,300);

  const form = useForm<z.infer<typeof sighInSchema>>({
    resolver : zodResolver(sighInSchema),
    defaultValues:{
      identifier:'',
      password:'',
    }
  })

  const {toast} = useToast();

  const onSubmit = async(data:z.infer<typeof sighInSchema>) =>{
    
  }
  
  return (
    <div className='flex justify-center items-center bg-gray-800 min-h-screen'>
      <div className=' w-full max-w-md p-8 space-y-8 bg-slate-50 rounded-lg shadow-md'>
       <div className=' text-center'>
         <h1 className=' text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Welcome Back to True Feedback</h1>
         <p className='mb-6'>Sign in to continue your secret conversation</p>
       </div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' font-bold'>Email/Username</FormLabel>
                <Input  {...field} />
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
                <Input type='password'  {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className=' w-full' type="submit">Sign In</Button>
      </form>
    </Form>
    <div className=' text-center'>
     <p className='font-bold'>
      Not a member yet?
      <Link href="/sign-up" className='text-blue-600 hover:text-blue-800'>Sigh up</Link>
     </p>
    </div>
      </div>
    </div>
  )
}
