// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Cache Keys
export const CACHE_KEYS = {
  PROFILE: "profile",
  SITES: "sites",
  JOINED_SITES: "joinedSites",
  COURSES: "courses",
  COURSE: "course",
  COURSE_PROGRESS: "courseProgress",
  SITE_DATA: "siteData",
  SUBMISSION: "submission",
  QUIZ_SUBMISSION: "quizSubmission",
  FORUM_TOPICS: "forumTopics",
  FORUM_REPLIES: "forumReplies",
  BLOGS: "blogs",
  BLOG: "blog",
  GRADES: "grades",
  ANNOUNCEMENTS: "announcements",
};

// File Upload Limits
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "text/plain",
  ],
};

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  PAGINATION_LIMIT: 10,
  SEARCH_MIN_LENGTH: 2,
  ANIMATION_DURATION: 200,
  SKELETON_LINES: 3,
};

// User Roles
export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
};

// Content Types
export const CONTENT_TYPES = {
  VIDEO: "video",
  ARTICLE: "article",
  ASSIGNMENT: "assignment",
  QUIZ: "quiz",
  RESOURCE: "resource",
};

// Quiz Settings
export const QUIZ_SETTINGS = {
  PASSING_SCORE: 70,
  MAX_ATTEMPTS: 3,
  TIME_LIMIT: 60, // minutes
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 50,
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 6,
};

// Course Categories
export const COURSE_CATEGORIES = [
  "Programming",
  "Data Science",
  "Business",
  "Design",
  "Marketing",
  "Language",
  "Science",
  "Mathematics",
  "Arts",
  "Health & Fitness",
  "Music",
  "Photography",
  "Other",
];

// Blog Categories
export const BLOG_CATEGORIES = [
  "Education",
  "Technology",
  "Programming",
  "Career",
  "Learning",
  "Research",
  "Industry News",
  "Tutorials",
  "Best Practices",
  "Other",
];

// Forum Categories
export const FORUM_CATEGORIES = [
  "General Discussion",
  "Course Discussion",
  "Technical Support",
  "Feature Requests",
  "Bug Reports",
  "Study Groups",
  "Career Advice",
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNAUTHORIZED: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: "File size exceeds the maximum allowed limit.",
  INVALID_FILE_TYPE: "Invalid file type. Please select a supported file format.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: "Changes saved successfully!",
  DELETE_SUCCESS: "Item deleted successfully!",
  UPLOAD_SUCCESS: "File uploaded successfully!",
  SUBMIT_SUCCESS: "Submitted successfully!",
  UPDATE_SUCCESS: "Updated successfully!",
  CREATE_SUCCESS: "Created successfully!",
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  
  // Users
  USERS: "/users",
  PROFILE: "/users/profile",
  
  // Sites
  SITES: "/sites",
  SITE_BY_NAME: "/sites/by-name",
  JOIN_SITE: "/sites/join",
  
  // Courses
  COURSES: "/courses",
  COURSE_DETAILS: "/course",
  COURSE_PROGRESS: "/course-progress",
  
  // Content
  LESSONS: "/lessons",
  ASSIGNMENTS: "/assignments",
  QUIZZES: "/quizzes",
  
  // Forums
  FORUM_TOPICS: "/forum-topics",
  FORUM_REPLIES: "/forum-replies",
  
  // Blogs
  BLOGS: "/blogs",
  
  // Grades
  GRADES: "/grades",
};