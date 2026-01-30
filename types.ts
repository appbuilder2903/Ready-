export enum ViewMode {
  AUTH = 'AUTH',
  BOOT = 'BOOT',
  IDE = 'IDE',
  NEURAL_HUB = 'NEURAL_HUB',
  SECURITY = 'SECURITY',
  VM = 'VM',
  ARCADE = 'ARCADE',
  SUPPORT = 'SUPPORT',
  CLASSROOM = 'CLASSROOM',
  FILES = 'FILES',
  WEB_BUILDER = 'WEB_BUILDER',
  NET_CHAT = 'NET_CHAT',
  CIRCUIT_FORGE = 'CIRCUIT_FORGE'
}

export interface UserProfile {
  id: string;
  role: 'Developer' | 'Student' | 'Teacher' | 'NetRunner' | 'Admin';
  level: number;
  xp: number;
  rank: string;
  permissions: string[];
}

export interface RegisteredUser {
  username: string;
  pass: string;
  role: 'Student' | 'NetRunner' | 'Teacher';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'AI' | 'USER' | 'NETWORK' | 'KERNEL';
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'critical';
}

export interface SecurityTool {
  id: string;
  name: string;
  category: string;
  version: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Extreme';
  cli_usage: string;
  is_procedural?: boolean;
}

export interface GameMetadata {
  id: string;
  title: string;
  genre: string;
  rating: number;
  players: string;
  description: string;
  is_procedural?: boolean;
}

export interface VmState {
  os: string;
  status: 'OFFLINE' | 'BOOTING' | 'ONLINE' | 'KERNEL_PANIC' | 'ISO_MOUNTED';
  cpuLoad: number;
  memUsage: number;
  logs: string[];
  uptime: number;
  mountedIso?: string;
}

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  students: string[];
  posts: ClassPost[];
}

export interface ClassPost {
  id: string;
  type: 'ANNOUNCEMENT' | 'ASSIGNMENT' | 'VIDEO';
  author: string;
  content: string;
  mediaUrl?: string;
  timestamp: string;
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  filesChanged: number;
}

export interface GitState {
  isInitialized: boolean;
  branch: string;
  staged: boolean;
  history: Commit[];
}

export interface StoredFile {
  id: string;
  name: string;
  content: string;
  lastModified: string;
  size: string;
  type: 'text' | 'code' | 'config';
}

export interface ChatMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}