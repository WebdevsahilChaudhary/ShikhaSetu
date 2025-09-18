'use server';
/**
 * @fileOverview An AI agent that answers student questions.
 *
 * - answerDoubt - A function that handles answering a student's doubt.
 * - AnswerDoubtInput - The input type for the answerDoubt function.
 * - AnswerDoubtOutput - The return type for the answerDoubt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDoubtInputSchema = z.object({
  question: z.string().describe('The student\'s question or doubt.'),
});
export type AnswerDoubtInput = z.infer<typeof AnswerDoubtInputSchema>;

const AnswerDoubtOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the student\'s question.'),
});
export type AnswerDoubtOutput = z.infer<typeof AnswerDoubtOutputSchema>;

export async function answerDoubt(input: AnswerDoubtInput): Promise<AnswerDoubtOutput> {
  return studentDoubtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentDoubtPrompt',
  input: {schema: AnswerDoubtInputSchema},
  output: {schema: AnswerDoubtOutputSchema},
  prompt: `You are an expert academic tutor for students in the Maharashtra State Board of Secondary and Higher Secondary Education. Your role is to help students by answering their questions clearly and concisely.

When a student asks a question, provide a step-by-step explanation if it's a problem-solving question. If it's a conceptual question, explain the concept in simple terms.

Your answer should be encouraging and supportive. Behave like a friendly teacher.

The student's question is:
'{{{question}}}'

Provide your answer.`,
});

const studentDoubtFlow = ai.defineFlow(
  {
    name: 'studentDoubtFlow',
    inputSchema: AnswerDoubtInputSchema,
    outputSchema: AnswerDoubtOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
