import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { X } from 'lucide-react';


const MessageCard = () => {
  return (
   <Card>
  <CardHeader>
    <div>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
  <AlertDialogTrigger>
    <Button variant='destructive'>
        <X className='w-5 h-5' />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this message
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
    </div>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
  )
}

export default MessageCard
