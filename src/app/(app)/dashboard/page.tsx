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
import { User } from 'next-auth'
import MessageCard from '@/components/MessageCard'

const UserDashBoard = () => {
  const {toast} = useToast();
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  const [isswitchLoading,setIsSwitchLoading] = useState(false);

  console.log("messages",messages);

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
       const response = await axios.get('/api/accept-messages');
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


  const fetchMessage = useCallback(async(refresh: boolean = false)=>{
    setIsLoading(true);
    setIsSwitchLoading(false);
  try{
    const response = await axios.get<ApiResponse>("/api/get-message");
    console.log("response",response);
    setMessages(response.data.messages || []);
    if(refresh){
      toast({
        title:'Refreshed Messages',
        description:"Showing latest messages",
      });
    }
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

  if(!session || !session.user){
    return <div>Please Login</div>
  }
 
  const {username} = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  console.log("baseurl",baseUrl);
  const profileUrl = `${baseUrl}/u/${username}`;

  console.log("user",session?.user);

  const copyToClipboard = () =>{
     navigator.clipboard.writeText(profileUrl);
     toast({
      title:'URL Copied',
      description :"Profile URL has been copied to clipboard."
     });
  };

  console.log("accept",acceptMessages);


  return (
    <div className=' bg-white w-full max-w-6xl my-8 mx-4 md:mx-8 lg:mx-auto p-6'>
      <h1 className=' font-bold text-2xl mb-2'>User Dashboard</h1>
      <div className=' mb-4'>
        <h2 className='mb-2 text-lg font-semibold'>Copy Your Unique Link</h2>
        <div className=' flex items-center'>
          <input defaultValue={profileUrl} className=' input input-bordered w-full p-2 mr-2 bg-slate-100 rounded-md' type='text' disabled/>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className=' mb-4'>
      <Switch disabled={isswitchLoading} {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleswichChange}/>
       <span className=' ml-2'>
         Accept Messages:{acceptMessages?'   On':'Off'}
       </span>
      </div>
      <Separator />
      <Button onClick={(e) => {
        e.preventDefault();
        fetchMessage(true);
      }} variant='outline' className='mt-4'>
       {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
       ):(
          <RefreshCcw className='h-4 w-4' />
       )}
      </Button>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
        {messages?.length>0 ?(
              messages.map((message, index) => (
                <MessageCard
                 key={index}
                 message={message}
                 onMessageDelete={handleDeleteMessage}
                />
              ))
        ):(
          <p>No message to display.</p>
        )}
      </div>
    </div>
  )
}

export default UserDashBoard;
