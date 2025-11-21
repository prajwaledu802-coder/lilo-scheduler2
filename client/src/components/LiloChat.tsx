import { useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function LiloChat() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Lilo, your AI scheduling assistant. Ask me to create schedules, plan tasks, or help you organize your time!",
    },
  ]);

  const chatMutation = useMutation({
    mutationFn: async (msg: string) => {
      return await apiRequest<{ response: string; taskCreated: boolean }>(
        "POST",
        "/api/chat",
        { message: msg }
      );
    },
    onSuccess: (data) => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, aiResponse]);
      
      if (data.taskCreated) {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      }
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble processing that. Please try again.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(message);
    setMessage("");
  };

  return (
    <>
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] flex flex-col shadow-2xl backdrop-blur-xl bg-card/95 border-2 z-50">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-chart-3/10">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Lilo</h3>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={msg.role === "assistant" ? "bg-gradient-to-br from-primary to-chart-3 text-primary-foreground" : ""}>
                      {msg.role === "assistant" ? "L" : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-primary to-chart-3 text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-chart-3 text-primary-foreground">
                      L
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask Lilo anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={chatMutation.isPending}
                data-testid="input-chat-message"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={chatMutation.isPending}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-chart-3 hover:shadow-xl transition-shadow z-50"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-open-chat"
      >
        <Bot className="h-6 w-6" />
      </Button>
    </>
  );
}
