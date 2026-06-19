export type EnergyLevel = 'low' | 'medium' | 'high';

export type TaskSlot = 'now' | 'next' | 'later';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'dropped';

export interface Task {
  id: string;
  title: string;
  slot: TaskSlot;
  status: TaskStatus;
  estimatedMinutes?: number;
  completedAt?: string;
  createdAt: string;
}

export interface DayPlan {
  date: string;
  energyLevel: EnergyLevel;
  tasks: Task[];
  streak: number;
}

export interface UserProfile {
  id: string;
  name: string;
  energyLevel: EnergyLevel | null;
  isPremium: boolean;
}
