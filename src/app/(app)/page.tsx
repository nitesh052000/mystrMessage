'use client';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import messages from "@/messages.json"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail } from "lucide-react";
import Autoplay from 'embla-carousel-autoplay';

export default function Home() {
   return(
    <>
     <main className=" flex-grow flex flex-col items-center justify-center bg-gray-800 px-4 md:px-24 py-12 text-white min-h-[calc(100vh-10rem)]">
      <section className=" text-center mb:8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">Dive into the World of Anonymous Feedback</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          True Feedback - Where your identity remians a secret.
        </p>
      </section>
        {/* carousel for message */}
         <Carousel plugins={[Autoplay({delay:2000})]} className=" w-full max-w-lg md:max-w-xl">
          <CarouselContent>
           {messages.map((message,index)=>(
            <CarouselItem key={index} className="p-4">
              <Card>
                <CardHeader>
                <CardTitle>{message?.title}</CardTitle>
                
              </CardHeader>
              <CardContent>
                <Mail className=" flex-shrink-0"></Mail>
                <div>
                  <p>{message?.content}</p>
                  <p className=" text-xs text-muted-foreground">{message?.received}</p>
                </div>
              </CardContent>
              </Card>
            </CarouselItem>
           ))}
          </CarouselContent>
         </Carousel>
     </main>
      {/* Footer */}
         <footer className=" text-center p-4 md:p-6 bg-gray-900 text-white">
           © 2023 True Feedback. All rights reserved.
         </footer>
     </>
   );
}


