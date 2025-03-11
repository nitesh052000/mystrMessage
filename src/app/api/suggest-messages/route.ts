import axios from 'axios';
import { NextResponse } from 'next/server';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export async function POST() {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`;

    // Call Mistral API
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-medium', // Other options: mistral-small, mistral-large
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature:0.8,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("response",response);

    const message = response.data.choices[0]?.message?.content || 'Failed to generate questions';

    console.log("message", message);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
