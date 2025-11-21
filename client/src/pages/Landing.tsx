import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Calendar, Clock, Brain, Zap, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-chart-2 to-chart-3">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl mb-6 shadow-2xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Lilo Scheduler
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your AI-powered personal time manager. Smart scheduling, habit tracking, and automated task planning.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-xl"
            onClick={() => (window.location.href = "/api/login")}
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <Calendar className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Calendars</h3>
            <p className="text-white/80">
              View your schedule in daily, weekly, monthly, or yearly formats with intelligent organization.
            </p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <Brain className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-white/80">
              Chat with Lilo to create tasks using natural language. Just say what you need!
            </p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <Zap className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Auto-Scheduling</h3>
            <p className="text-white/80">
              Create recurring tasks automatically. Set it once, and Lilo handles the rest.
            </p>
          </Card>
        </div>

        <Card className="p-8 bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Daily, weekly, monthly, and yearly schedule views",
              "Smart reminders and notifications",
              "Habit tracking with streak monitoring",
              "AI-powered task suggestions",
              "Natural language task creation",
              "Priority-based task organization",
              "Recurring task automation",
              "Beautiful, modern interface",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
