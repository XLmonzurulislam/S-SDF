import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPostSchema, 
  insertCommentSchema, 
  insertLikeSchema, 
  insertFriendRequestSchema 
} from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      username: string;
      name: string;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize session middleware
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: "socialconnect-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 86400000 }, // 1 day
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );
  
  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        // In a real app, we'd hash passwords. For simplicity, we're just comparing directly
        // In memory storage we're storing cleartext passwords
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json({
          id: user.id,
          username: user.username,
          name: user.name,
          profilePicture: user.profilePicture
        });
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture
    });
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/current-user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture
    });
  });
  
  // User routes
  app.get("/api/users", isAuthenticated, async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture
    })));
  });
  
  app.get("/api/users/:id", isAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const authenticatedUser = req.user as any;
    const friendStatus = await storage.getFriendshipStatus(authenticatedUser.id, userId);
    
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      friendStatus
    });
  });
  
  // Post routes
  app.post("/api/posts", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const post = await storage.createPost(postData);
      const postWithDetails = await storage.getPost(post.id);
      
      res.status(201).json(postWithDetails);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });
  
  app.get("/api/posts/feed", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const posts = await storage.getPostsForFeed(user.id);
    res.json(posts);
  });
  
  app.get("/api/users/:id/posts", isAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.id);
    const posts = await storage.getUserPosts(userId);
    res.json(posts);
  });
  
  // Comment routes
  app.post("/api/posts/:postId/comments", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const postId = parseInt(req.params.postId);
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        userId: user.id,
        postId
      });
      
      const comment = await storage.createComment(commentData);
      const post = await storage.getPost(postId);
      
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });
  
  // Like routes
  app.post("/api/posts/:postId/like", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const postId = parseInt(req.params.postId);
      
      const likeData = insertLikeSchema.parse({
        userId: user.id,
        postId
      });
      
      await storage.createLike(likeData);
      const post = await storage.getPost(postId);
      
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid like data" });
    }
  });
  
  app.delete("/api/posts/:postId/like", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const postId = parseInt(req.params.postId);
      
      await storage.removeLike(postId, user.id);
      const post = await storage.getPost(postId);
      
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid like data" });
    }
  });
  
  // Friend routes
  app.post("/api/friend-requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const requestData = insertFriendRequestSchema.parse({
        ...req.body,
        senderId: user.id,
        status: "pending"
      });
      
      const request = await storage.createFriendRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid friend request data" });
    }
  });
  
  app.put("/api/friend-requests/:id", isAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status } = req.body;
      
      const request = await storage.updateFriendRequest(requestId, status);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid friend request data" });
    }
  });
  
  app.get("/api/friend-requests", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const requests = await storage.getFriendRequests(user.id);
    res.json(requests);
  });
  
  app.get("/api/friends", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const friends = await storage.getFriends(user.id);
    res.json(friends);
  });
  
  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const notifications = await storage.getUserNotifications(user.id);
    res.json(notifications);
  });
  
  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: "Invalid notification data" });
    }
  });
  
  return httpServer;
}
