import { Type } from "@google/genai";

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DEALS = 'DEALS',
  TASKS = 'TASKS',
  CALENDAR = 'CALENDAR',
  DOCUMENTS = 'DOCUMENTS',
  AUTOMATIONS = 'AUTOMATIONS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  CONTACTS = 'CONTACTS',
  ASSISTANT = 'ASSISTANT',
  CHAT = 'CHAT',
  LIVE = 'LIVE'
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  status: 'Lead' | 'Active' | 'Customer' | 'Churned';
  lastContact: string;
  notes: string;
  avatarColor: string;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  status: 'NEW' | 'WORKING' | 'QUALIFIED' | 'DISQUALIFIED';
  source: string;
  ownerId: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  expectedClose: string;
  accountId: string;
  ownerId: string;
}

export interface Activity {
  id: string;
  title: string;
  type: 'TASK' | 'CALL' | 'MEETING';
  dueAt: string;
  status: 'OPEN' | 'COMPLETED';
  relatedType: 'DEAL' | 'CONTACT' | 'ACCOUNT' | 'LEAD';
  relatedId: string;
  ownerId: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId: string;
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'MEETING' | 'CALL' | 'DEADLINE';
  participants: string[];
  description?: string;
}

export interface DocFile {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'IMG' | 'SPREADSHEET';
  size: string;
  uploadedAt: Date;
  linkedTo?: string; // Deal ID or Contact ID
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS';
  timestamp: Date;
  read: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  revenue: number;
  dealsClosed: number;
  trend: number;
  status: 'online' | 'offline' | 'busy';
}

export interface LeadAnalysis {
  score: number;
  reasoning: string;
  suggestedAction: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export const CRM_MODEL = 'gemini-2.5-flash';
export const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';