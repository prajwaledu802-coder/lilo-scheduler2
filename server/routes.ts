// Reference: blueprint:javascript_log_in_with_replit
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { chatWithLilo, parseTaskFromNaturalLanguage } from "./gemini";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { college, timezone } = req.body;
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        college,
        timezone,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get all tasks for user
  app.get("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Create new task (with support for recurring tasks)
  app.post("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { generateRecurring, ...taskData } = req.body;
      
      // If generating recurring tasks
      if (generateRecurring && taskData.repeat !== "one-time") {
        const createdTasks = [];
        const baseDate = new Date(taskData.date);
        
        // Validate date
        if (isNaN(baseDate.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
        
        const maxTasks = 30; // Generate up to 30 recurring tasks
        
        for (let i = 0; i < maxTasks; i++) {
          const newDate = new Date(baseDate);
          
          // Calculate next date based on repeat pattern
          if (taskData.repeat === "daily") {
            newDate.setDate(baseDate.getDate() + i);
          } else if (taskData.repeat === "weekly") {
            newDate.setDate(baseDate.getDate() + (i * 7));
          } else if (taskData.repeat === "monthly") {
            newDate.setMonth(baseDate.getMonth() + i);
          } else if (taskData.repeat === "yearly") {
            newDate.setFullYear(baseDate.getFullYear() + i);
          }
          
          const formattedDate = newDate.toISOString().split("T")[0];
          const task = await storage.createTask(
            insertTaskSchema.parse({
              ...taskData,
              userId,
              date: formattedDate,
            })
          );
          createdTasks.push(task);
        }
        
        return res.json({ tasks: createdTasks, count: createdTasks.length });
      }
      
      // Single task creation
      const task = await storage.createTask(
        insertTaskSchema.parse({
          ...taskData,
          userId,
        })
      );
      res.json(task);
    } catch (error: any) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: error.message || "Failed to create task" });
    }
  });

  // Update task
  app.patch("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskId = req.params.id;
      const taskData = updateTaskSchema.parse(req.body);
      
      const task = await storage.updateTask(taskId, userId, taskData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: error.message || "Failed to update task" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskId = req.params.id;
      
      await storage.deleteTask(taskId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Chat with Lilo
  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get user's tasks for context
      const tasks = await storage.getTasks(userId);
      
      // Check if user wants to create a task
      const parseResult = await parseTaskFromNaturalLanguage(message);
      
      if (parseResult.shouldCreateTask && parseResult.task) {
        // Create the task
        const taskData = insertTaskSchema.parse({
          ...parseResult.task,
          userId,
        });
        await storage.createTask(taskData);
        
        return res.json({
          response: `Great! I've created a task: "${parseResult.task.title}" for ${parseResult.task.date} at ${parseResult.task.time}.`,
          taskCreated: true,
        });
      }
      
      // Regular chat
      const response = await chatWithLilo(message, tasks);
      res.json({ response, taskCreated: false });
    } catch (error: any) {
      console.error("Error in chat:", error);
      if (error.message?.includes("GEMINI_API_KEY")) {
        return res.status(503).json({ message: "AI service is not configured. Please contact support." });
      }
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
