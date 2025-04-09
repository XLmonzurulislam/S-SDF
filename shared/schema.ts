import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  bio: text("bio"),
  profilePicture: text("profile_picture"),
  coverPicture: text("cover_picture"),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const friendRequests = pgTable("friend_requests", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  status: text("status").notNull(), // "pending", "accepted", "rejected"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sourceId: integer("source_id"), // could be a post id, comment id, etc.
  sourceType: text("source_type"), // "post", "comment", "friend_request", etc.
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  bio: true,
  profilePicture: true,
  coverPicture: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  imageUrl: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  postId: true,
  userId: true,
  content: true,
});

export const insertLikeSchema = createInsertSchema(likes).pick({
  postId: true,
  userId: true,
});

export const insertFriendRequestSchema = createInsertSchema(friendRequests).pick({
  senderId: true,
  receiverId: true,
  status: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  sourceId: true,
  sourceType: true,
  content: true,
  isRead: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;

export type FriendRequest = typeof friendRequests.$inferSelect;
export type InsertFriendRequest = z.infer<typeof insertFriendRequestSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Extended types for front-end use
export type PostWithUser = Post & {
  user: User;
  comments: CommentWithUser[];
  likes: Like[];
  _count: {
    comments: number;
    likes: number;
  }
};

export type CommentWithUser = Comment & {
  user: User;
};

export type FriendRequestWithUsers = FriendRequest & {
  sender: User;
  receiver: User;
};

export type UserWithFriendship = User & {
  friendStatus?: string; // "friends", "pending", "none", etc.
};
