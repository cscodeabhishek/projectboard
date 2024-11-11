export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';
export type TicketStatus = 'pending-tech' | 'pending-client' | 'done' | 'in-review';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'link' | 'media';
  url: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  ticketStatus?: TicketStatus;
  priority: Priority;
  assignee?: string;
  createdAt: Date;
  dueDate?: Date;
  clientName?: string;
  labels: Label[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface Column {
  id: Status;
  title: string;
  tasks: Task[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'facebook' | 'github';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface TaskFilter {
  dateFrom?: Date;
  dateTo?: Date;
  assignee?: string;
  labels?: string[];
  clientName?: string;
  ticketStatus?: TicketStatus;
}