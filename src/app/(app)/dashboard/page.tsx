'use client'
import { Button } from '@/components/ui/button'
import React, { useCallback, useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Message } from '@/model/Users'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'

const UserDashBoard = () => {
  const {toast} = useToast();
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  const [isswitchLoading,setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId:string) =>{
     setMessages(messages.filter((message) => message._id !==messageId));
  }
 
  const {data:session} = useSession();

  const form = useForm({
    resolver :zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async()=>{
     
    setIsSwitchLoading(true);
    try{
       const response = await axios.get('/api/accept-message');
       setValue('acceptMessages',response?.data?.isAcceptingMessage)
    } catch(error){
           const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally{
      setIsSwitchLoading(false);
    }

  },[setValue,toast])


  const fetchMessage = useCallback(async()=>{
    setIsLoading(true);
    setIsSwitchLoading(false);
  try{
    const response = await axios.get<ApiResponse>("/api/get-message");
    setMessages(response.data.messages || []);
  } catch(error){
    console.log("error",error);
    const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
  } finally{
    setIsLoading(false);
    setIsSwitchLoading(false);
  }
 },[toast,setMessages,setIsLoading]);

 useEffect(()=>{
    if(!session || !session.user){
      return;
    }
    fetchMessage();
    fetchAcceptMessage();
 },[session,setValue,fetchMessage,fetchAcceptMessage]);

  // handle switch change 
  const handleswichChange = async() =>{
       
    try{
      const response = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages : !acceptMessages,
      });
      setValue("acceptMessages",!acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch(error){
      console.log("error in switching changes",error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  }


  return (
    <div className=' bg-white w-full max-w-6xl my-8 mx-4 md:mx-8 lg:mx-auto p-6'>
      <h1 className=' font-bold text-2xl mb-2'>User Dashboard</h1>
      <div className=' mb-4'>
        <h2 className='mb-2 text-lg font-semibold'>Copy Your Unique Link</h2>
        <div className=' flex items-center'>
          <input className=' input input-bordered w-full p-2 mr-2' type='text' disabled/>
          <Button>Copy</Button>
        </div>
      </div>
      <div className=' mb-4'>
      <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleswichChange}/>
       <span className=' ml-2'>
         Accept Messages:
       </span>
      </div>
      <Separator />
      <Button variant='outline' className='mt-4'>
       <RefreshCcw />
      </Button>
    </div>
  )
}

export default UserDashBoard;
