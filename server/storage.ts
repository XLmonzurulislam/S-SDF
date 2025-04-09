import {
  users, posts, comments, likes, friendRequests, notifications,
  type User, type InsertUser, 
  type Post, type InsertPost,
  type Comment, type InsertComment, 
  type Like, type InsertLike,
  type FriendRequest, type InsertFriendRequest,
  type Notification, type InsertNotification,
  type PostWithUser, type CommentWithUser, type UserWithFriendship, type FriendRequestWithUsers
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<PostWithUser | undefined>;
  getPostsForFeed(userId: number): Promise<PostWithUser[]>;
  getUserPosts(userId: number): Promise<PostWithUser[]>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number): Promise<CommentWithUser[]>;
  
  // Like operations
  createLike(like: InsertLike): Promise<Like>;
  removeLike(postId: number, userId: number): Promise<void>;
  getPostLikes(postId: number): Promise<Like[]>;
  
  // Friend operations
  createFriendRequest(request: InsertFriendRequest): Promise<FriendRequest>;
  updateFriendRequest(id: number, status: string): Promise<FriendRequest>;
  getFriendRequests(userId: number): Promise<FriendRequestWithUsers[]>;
  getFriends(userId: number): Promise<User[]>;
  getFriendshipStatus(userId1: number, userId2: number): Promise<string>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private likes: Map<number, Like>;
  private friendRequests: Map<number, FriendRequest>;
  private notifications: Map<number, Notification>;
  
  private userIdCounter: number = 1;
  private postIdCounter: number = 1;
  private commentIdCounter: number = 1;
  private likeIdCounter: number = 1;
  private friendRequestIdCounter: number = 1;
  private notificationIdCounter: number = 1;
  
  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.friendRequests = new Map();
    this.notifications = new Map();
    
    // Add some seed data
    this.addSeedData();
  }
  
  private addSeedData() {
    // Add some seed users
    const john = this.createUser({
      username: "johndoe",
      password: "password123",
      name: "John Doe",
      bio: "Software developer and tech enthusiast",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      coverPicture: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    });
    
    const sarah = this.createUser({
      username: "sarahjohnson",
      password: "password123",
      name: "Sarah Johnson",
      bio: "Photographer and art lover",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      coverPicture: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    });
    
    const michael = this.createUser({
      username: "michaelchen",
      password: "password123",
      name: "Michael Chen",
      bio: "Tech professional and foodie",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      coverPicture: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    });
    
    const sophia = this.createUser({
      username: "sophialee",
      password: "password123",
      name: "Sophia Lee",
      bio: "Travel enthusiast and blogger",
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      coverPicture: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    });
    
    const james = this.createUser({
      username: "jameswilson",
      password: "password123",
      name: "James Wilson",
      bio: "Sports fan and fitness enthusiast",
      profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      coverPicture: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    });
    
    const alex = this.createUser({
      username: "alexrodriguez",
      password: "password123",
      name: "Alex Rodriguez",
      bio: "Foodie and restaurant critic",
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      coverPicture: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    });
    
    // Add friend connections
    this.createFriendRequest({
      senderId: john.id,
      receiverId: sarah.id,
      status: "accepted"
    });
    
    this.createFriendRequest({
      senderId: john.id,
      receiverId: michael.id,
      status: "accepted"
    });
    
    this.createFriendRequest({
      senderId: john.id,
      receiverId: sophia.id,
      status: "accepted"
    });
    
    this.createFriendRequest({
      senderId: john.id,
      receiverId: james.id,
      status: "accepted"
    });
    
    // Add pending friend requests to John
    this.createFriendRequest({
      senderId: alex.id,
      receiverId: john.id,
      status: "pending"
    });
    
    // Add some posts
    const sarahPost = this.createPost({
      userId: sarah.id,
      content: "Just visited the most amazing art exhibition! The creativity on display was absolutely mind-blowing! 🎨 #ArtLovers #WeekendVibes",
      imageUrl: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80"
    });
    
    const michaelPost = this.createPost({
      userId: michael.id,
      content: "Big news! Just accepted a position as Senior Developer at TechCorp. So excited to start this new journey! 🚀 #NewJob #TechCareers",
      imageUrl: null
    });
    
    const alexPost = this.createPost({
      userId: alex.id,
      content: "Has anyone tried the new restaurant downtown? Thinking of checking it out this weekend. Looking for recommendations!",
      imageUrl: null
    });
    
    // Add comments
    this.createComment({
      postId: sarahPost.id,
      userId: james.id,
      content: "Looks amazing! Which exhibition was this? I love modern art."
    });
    
    this.createComment({
      postId: michaelPost.id,
      userId: sarah.id,
      content: "Congratulations! So happy for you! They're lucky to have you on the team."
    });
    
    this.createComment({
      postId: alexPost.id,
      userId: sophia.id,
      content: "I went there last week! The pasta is amazing, but it gets pretty crowded on weekends. Try to make a reservation!"
    });
    
    // Add likes
    this.createLike({
      postId: sarahPost.id,
      userId: john.id
    });
    
    this.createLike({
      postId: sarahPost.id,
      userId: michael.id
    });
    
    this.createLike({
      postId: michaelPost.id,
      userId: sarah.id
    });
    
    this.createLike({
      postId: michaelPost.id,
      userId: john.id
    });
    
    this.createLike({
      postId: alexPost.id,
      userId: james.id
    });
    
    // Add notifications
    this.createNotification({
      userId: sarah.id,
      sourceId: 1,
      sourceType: "like",
      content: "John Doe liked your post",
      isRead: false
    });
    
    this.createNotification({
      userId: michael.id,
      sourceId: 2,
      sourceType: "comment",
      content: "Sarah Johnson commented on your post",
      isRead: false
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find((user) => user.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Post operations
  async createPost(postData: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const now = new Date();
    const post: Post = { ...postData, id, createdAt: now };
    this.posts.set(id, post);
    return post;
  }
  
  async getPost(id: number): Promise<PostWithUser | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const user = await this.getUser(post.userId);
    if (!user) return undefined;
    
    const comments = await this.getPostComments(id);
    const likes = await this.getPostLikes(id);
    
    return {
      ...post,
      user,
      comments,
      likes,
      _count: {
        comments: comments.length,
        likes: likes.length
      }
    };
  }
  
  async getPostsForFeed(userId: number): Promise<PostWithUser[]> {
    const friends = await this.getFriends(userId);
    const friendIds = friends.map((friend) => friend.id);
    friendIds.push(userId); // Include user's own posts
    
    const posts = Array.from(this.posts.values())
      .filter((post) => friendIds.includes(post.userId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await this.getUser(post.userId);
        const comments = await this.getPostComments(post.id);
        const likes = await this.getPostLikes(post.id);
        
        return {
          ...post,
          user: user!,
          comments,
          likes,
          _count: {
            comments: comments.length,
            likes: likes.length
          }
        };
      })
    );
    
    return postsWithDetails;
  }
  
  async getUserPosts(userId: number): Promise<PostWithUser[]> {
    const posts = Array.from(this.posts.values())
      .filter((post) => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const user = await this.getUser(userId);
    if (!user) return [];
    
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const comments = await this.getPostComments(post.id);
        const likes = await this.getPostLikes(post.id);
        
        return {
          ...post,
          user,
          comments,
          likes,
          _count: {
            comments: comments.length,
            likes: likes.length
          }
        };
      })
    );
    
    return postsWithDetails;
  }
  
  // Comment operations
  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = { ...commentData, id, createdAt: now };
    this.comments.set(id, comment);
    
    // Create notification for post owner
    const post = await this.getPost(commentData.postId);
    if (post && post.userId !== commentData.userId) {
      const commenter = await this.getUser(commentData.userId);
      if (commenter) {
        await this.createNotification({
          userId: post.userId,
          sourceId: id,
          sourceType: "comment",
          content: `${commenter.name} commented on your post`,
          isRead: false
        });
      }
    }
    
    return comment;
  }
  
  async getPostComments(postId: number): Promise<CommentWithUser[]> {
    const comments = Array.from(this.comments.values())
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await this.getUser(comment.userId);
        return {
          ...comment,
          user: user!
        };
      })
    );
    
    return commentsWithUser;
  }
  
  // Like operations
  async createLike(likeData: InsertLike): Promise<Like> {
    // Check if like already exists
    const existingLike = Array.from(this.likes.values()).find(
      (like) => like.postId === likeData.postId && like.userId === likeData.userId
    );
    
    if (existingLike) {
      return existingLike;
    }
    
    const id = this.likeIdCounter++;
    const now = new Date();
    const like: Like = { ...likeData, id, createdAt: now };
    this.likes.set(id, like);
    
    // Create notification for post owner
    const post = await this.getPost(likeData.postId);
    if (post && post.userId !== likeData.userId) {
      const liker = await this.getUser(likeData.userId);
      if (liker) {
        await this.createNotification({
          userId: post.userId,
          sourceId: id,
          sourceType: "like",
          content: `${liker.name} liked your post`,
          isRead: false
        });
      }
    }
    
    return like;
  }
  
  async removeLike(postId: number, userId: number): Promise<void> {
    const likes = Array.from(this.likes.values());
    const likeToRemove = likes.find(
      (like) => like.postId === postId && like.userId === userId
    );
    
    if (likeToRemove) {
      this.likes.delete(likeToRemove.id);
    }
  }
  
  async getPostLikes(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values())
      .filter((like) => like.postId === postId);
  }
  
  // Friend operations
  async createFriendRequest(requestData: InsertFriendRequest): Promise<FriendRequest> {
    // Check if a request already exists between these users
    const existingRequests = Array.from(this.friendRequests.values()).filter(
      (request) => 
        (request.senderId === requestData.senderId && request.receiverId === requestData.receiverId) ||
        (request.senderId === requestData.receiverId && request.receiverId === requestData.senderId)
    );
    
    if (existingRequests.length > 0) {
      // If there's a request in the other direction that is pending, accept it
      if (existingRequests[0].senderId === requestData.receiverId && 
          existingRequests[0].receiverId === requestData.senderId &&
          existingRequests[0].status === "pending") {
        return this.updateFriendRequest(existingRequests[0].id, "accepted");
      }
      return existingRequests[0];
    }
    
    const id = this.friendRequestIdCounter++;
    const now = new Date();
    const request: FriendRequest = { ...requestData, id, createdAt: now };
    this.friendRequests.set(id, request);
    
    // Create notification for receiver if request is pending
    if (requestData.status === "pending") {
      const sender = await this.getUser(requestData.senderId);
      if (sender) {
        await this.createNotification({
          userId: requestData.receiverId,
          sourceId: id,
          sourceType: "friend_request",
          content: `${sender.name} sent you a friend request`,
          isRead: false
        });
      }
    }
    
    return request;
  }
  
  async updateFriendRequest(id: number, status: string): Promise<FriendRequest> {
    const request = this.friendRequests.get(id);
    if (!request) {
      throw new Error("Friend request not found");
    }
    
    const updatedRequest: FriendRequest = { ...request, status };
    this.friendRequests.set(id, updatedRequest);
    
    // Create notification for sender if request is accepted
    if (status === "accepted") {
      const receiver = await this.getUser(request.receiverId);
      if (receiver) {
        await this.createNotification({
          userId: request.senderId,
          sourceId: id,
          sourceType: "friend_request_accepted",
          content: `${receiver.name} accepted your friend request`,
          isRead: false
        });
      }
    }
    
    return updatedRequest;
  }
  
  async getFriendRequests(userId: number): Promise<FriendRequestWithUsers[]> {
    const requests = Array.from(this.friendRequests.values())
      .filter((request) => request.receiverId === userId && request.status === "pending");
    
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const sender = await this.getUser(request.senderId);
        const receiver = await this.getUser(request.receiverId);
        return {
          ...request,
          sender: sender!,
          receiver: receiver!
        };
      })
    );
    
    return requestsWithUsers;
  }
  
  async getFriends(userId: number): Promise<User[]> {
    const acceptedRequests = Array.from(this.friendRequests.values())
      .filter((request) => 
        (request.senderId === userId || request.receiverId === userId) && 
        request.status === "accepted"
      );
    
    const friendIds = acceptedRequests.map((request) => 
      request.senderId === userId ? request.receiverId : request.senderId
    );
    
    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const user = await this.getUser(friendId);
        return user!;
      })
    );
    
    return friends;
  }
  
  async getFriendshipStatus(userId1: number, userId2: number): Promise<string> {
    const requests = Array.from(this.friendRequests.values())
      .filter((request) => 
        (request.senderId === userId1 && request.receiverId === userId2) ||
        (request.senderId === userId2 && request.receiverId === userId1)
      );
    
    if (requests.length === 0) {
      return "none";
    }
    
    if (requests[0].status === "accepted") {
      return "friends";
    }
    
    if (requests[0].status === "pending") {
      if (requests[0].senderId === userId1) {
        return "pending_sent";
      } else {
        return "pending_received";
      }
    }
    
    return "none";
  }
  
  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const notification: Notification = { ...notificationData, id, createdAt: now };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    const updatedNotification: Notification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
}

export const storage = new MemStorage();
