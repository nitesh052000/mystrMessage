'use client';

import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { messageSchema } from '@/schemas/messageSchema';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import {  Loader2 } from 'lucide-react';


const predefinedMessages = [
  "What's your favorite movie?",
  'Do you have any pets?',
  "What's your dream job?",
];

const SendMessage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  console.log('username', username);

  const [isLoading, setIsLoading] = useState(false);
  const [loading,setLoading] = useState(false);
  const [suggestedMessage, setSuggestedMessage] = useState([]);
  console.log("suggested message",suggestedMessage);
  const { toast } = useToast();

  // AI Completion Hook
  // const { complete, completion } = useCompletion({
  //   api: '/api/suggest-messages',
  // });

  // Form Setup
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  // Watch Message Content
  const messageContent = form.watch('content');
  console.log('message content', messageContent);

  // Submit Form
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response?.data?.message,
        variant: 'default',
      });

      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch AI-Suggested Message
  const fetchSuggestedMessage = async () => {
    setLoading(true);
    try {
       const response = await axios.post("/api/suggest-messages");
      if (response) {
       console.log("response",response);
       console.log("suggest",response?.data?.message?.split("||"));
       setSuggestedMessage(response?.data?.message.split("||"));
    }
   } catch (error) {
      console.log('Error in fetching message from AI', error);
      toast({
        title: 'Error',
        description: 'Error in fetching message from AI',
        variant: 'destructive',
      });
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto my-8 bg-white rounded p-6 max-w-4xl'>
      <h1 className='text-4xl font-bold text-center mb-6'>Public Profile Link</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold'>
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder='Write your anonymous message here' className='resize-none' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button disabled={isLoading || !messageContent}>Send It</Button>
            )}
          </div>
        </form>
      </Form>

      {/* Suggested Messages */}
      <div className='my-4 space-y-4'>
        <div className='space-y-2'>
          {loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button onClick={fetchSuggestedMessage}>Suggest Messages</Button>
            )}
          <p>Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col space-y-4'>
            {/* Predefined Messages
            {predefinedMessages.map((message, index) => (
              <Button key={index} onClick={() => form.setValue('content', message)} variant='outline'>
                {message}
              </Button>
            ))}
            {/* AI-Generated Message (if available) */}
            {/* {suggestedMessage && (
              <Button onClick={() => form.setValue('content', suggestedMessage)} variant='outline'>
                {suggestedMessage}
              </Button>
            )} */} 

            {suggestedMessage.length === 0 ? (
  predefinedMessages?.map((message, index) => (
    <Button key={index} onClick={() => form.setValue('content', message)} variant="outline">
      {message}
    </Button>
  ))
) : (
  suggestedMessage && (
    suggestedMessage?.map((message,index) => (
        <Button key={index} onClick={() => form.setValue('content',message)} variant="outline">
          {message}
        </Button>
    ))
  )
)}

          </CardContent>
        </Card>
      </div>

      <Separator className='my-6' />

      {/* Sign Up Section */}
      <div className='text-center'>
        <div className='mb-4'>Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default SendMessage;
