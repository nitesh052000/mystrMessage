'use client'
import React from "react"
import Link from "next/link"
import { useSession,signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { User } from "next-auth";

export default function Navbar(){

    const {data:session,status} = useSession();
    console.log("session",status);
    const user = session?.user as User | undefined;

    return (
        <nav className="p-4 md:p-6 bg-gray-900 text-white shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a href="#" className=" text-xl font-bold mb-4 md:mb-0">True Feedback</a>
            {session ? (<>
               <span className="mr-4">
                Welcome,{user?.username || user?.email}
               </span>
               <Button className="w-full md:w-auto bg-slate-100 text-black" variant="outline" onClick={()=> signOut()}>Logout</Button>
            </>) :(
                <Link href="/sign-in">
                    <Button variant='outline' className="w-full md:w-auto bg-slate-100 text-black font-bold">Login</Button>
                </Link>
            )}
        </div>
        </nav>
    )
}