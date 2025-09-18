"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Sparkles, Bot, User } from "lucide-react";
import { answerDoubt } from "@/ai/flows/student-doubt-flow";
import { Skeleton } from "@/components/ui/skeleton";

export default function AskAiPage() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    setLoading(true);
    setLastQuestion(currentQuestion);
    setLastAnswer(null); // Clear previous answer

    try {
      const response = await answerDoubt({ 
        question: currentQuestion,
      });
      setLastAnswer(response.answer);
    } catch (error) {
      console.error("Error fetching AI answer:", error);
      const errorMessage = "Sorry, I encountered an error trying to answer your question. Please try again.";
      setLastAnswer(errorMessage);
    } finally {
      setCurrentQuestion("");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <Sparkles className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary mt-4">
              Ask Our AI Tutor
            </h1>
            <p className="text-muted-foreground md:text-xl/relaxed mt-2">
              Have a doubt? Ask our AI assistant for a quick and clear explanation.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                   <User className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                   <Textarea
                    id="question"
                    placeholder="Type your question here... for example, 'Explain Newton's first law of motion.'"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className="pl-10"
                    rows={4}
                    disabled={loading}
                    />
                </div>
                <Button type="submit" className="w-full font-bold" disabled={loading}>
                  {loading ? "Thinking..." : "Ask Question"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {(loading || lastAnswer) && (
             <div className="space-y-6">
              {lastQuestion && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <User className="h-6 w-6 text-foreground" />
                    <CardTitle>Your Question</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <article className="prose prose-sm max-w-none text-foreground">
                        <ReactMarkdown>{lastQuestion}</ReactMarkdown>
                     </article>
                  </CardContent>
                </Card>
              )}

              {loading && (
                 <Card>
                   <CardHeader className="flex flex-row items-center gap-3">
                     <Bot className="h-6 w-6 text-primary" />
                     <CardTitle>AI Response</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                   </CardContent>
                 </Card>
              )}

              {lastAnswer && !loading && (
                 <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle>AI Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <article className="prose prose-sm max-w-none text-foreground">
                        <ReactMarkdown>{lastAnswer}</ReactMarkdown>
                     </article>
                  </CardContent>
                </Card>
              )}
             </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
