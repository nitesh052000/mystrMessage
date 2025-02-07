import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to 'edge' for Next.js
export const runtime = 'edge';

export async function POST() {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    // Call the OpenAI API for streaming completion
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true, // Enable streaming
      messages: [
        {
          role: 'system',
          content:
            'You are a creative assistant that generates engaging and open-ended questions for social messaging platforms.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Convert OpenAI stream to a web-readable stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(encoder.encode(chunk.choices[0]?.delta?.content || ''));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.error();
  }
}
