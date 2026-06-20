import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskSlot, TaskStatus, EnergyLevel, DailyRecord } from '../types';

function toDateString(date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateString(d);
}

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100];

interface TaskStore {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  tasks: Task[];
  energyLevel: EnergyLevel | null;
  todayEnergyDate: string | null;

  streak: number;
  lastActiveDate: string | null;

  // History — last 30 days, most recent first
  weeklyHistory: DailyRecord[];

  // Milestones already celebrated — never show the same one twice
  celebratedMilestones: number[];

  // Settings
  notificationEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
  isPremium: boolean;

  // Task actions
  setEnergyLevel: (level: EnergyLevel) => void;
  addTask: (title: string, slot: TaskSlot, estimatedMinutes?: number) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  moveTask: (id: string, slot: TaskSlot) => void;
  removeTask: (id: string) => void;

  // Computed
  getActiveTasks: (slot: TaskSlot) => Task[];
  completedTodayCount: () => number;

  // Day management
  checkAndResetDay: () => void;

  // Milestone
  markMilestoneCelebrated: (streak: number) => void;
  getPendingMilestone: () => number | null;

  // Settings
  setNotificationEnabled: (v: boolean) => void;
  setNotificationTime: (hour: number, minute: number) => void;
  setIsPremium: (v: boolean) => void;
  clearPendingTasks: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      tasks: [],
      energyLevel: null,
      todayEnergyDate: null,
      streak: 0,
      lastActiveDate: null,
      weeklyHistory: [],
      celebratedMilestones: [],

      notificationEnabled: true,
      notificationHour: 8,
      notificationMinute: 0,
      isPremium: false,

      setEnergyLevel: (level) =>
        set({ energyLevel: level, todayEnergyDate: toDateString() }),

      addTask: (title, slot, estimatedMinutes) => {
        const task: Task = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title,
          slot,
          status: 'pending',
          estimatedMinutes,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status, completedAt: status === 'completed' ? new Date().toISOString() : t.completedAt }
              : t
          ),
        })),

      moveTask: (id, slot) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, slot } : t)),
        })),

      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      getActiveTasks: (slot) =>
        get().tasks.filter(
          (t) => t.slot === slot && t.status !== 'dropped' && t.status !== 'completed'
        ),

      completedTodayCount: () =>
        get().tasks.filter((t) => t.status === 'completed').length,

      checkAndResetDay: () => {
        const state = get();
        const today = toDateString();

        if (state.lastActiveDate === today) return;

        const hadCompletionsYesterday =
          state.lastActiveDate === yesterdayString() &&
          state.tasks.some((t) => t.status === 'completed');

        const newStreak = hadCompletionsYesterday ? state.streak + 1 : 0;

        // Save yesterday's record before wiping
        let newHistory = state.weeklyHistory;
        if (state.lastActiveDate) {
          const record: DailyRecord = {
            date: state.lastActiveDate,
            completed: state.tasks.filter((t) => t.status === 'completed').length,
            dropped: state.tasks.filter((t) => t.status === 'dropped').length,
            energy: state.energyLevel,
            streak: newStreak,
          };
          // Most recent first, keep 30 days
          newHistory = [record, ...state.weeklyHistory].slice(0, 30);
        }

        const survivingTasks = state.tasks.filter(
          (t) => t.status === 'pending' || t.status === 'in_progress'
        );

        set({
          tasks: survivingTasks,
          streak: newStreak,
          lastActiveDate: today,
          energyLevel: null,
          todayEnergyDate: null,
          weeklyHistory: newHistory,
        });
      },

      markMilestoneCelebrated: (streak) =>
        set((state) => ({
          celebratedMilestones: state.celebratedMilestones.includes(streak)
            ? state.celebratedMilestones
            : [...state.celebratedMilestones, streak],
        })),

      getPendingMilestone: () => {
        const { streak, celebratedMilestones } = get();
        return STREAK_MILESTONES.find(
          (m) => streak >= m && !celebratedMilestones.includes(m)
        ) ?? null;
      },

      setNotificationEnabled: (v) => set({ notificationEnabled: v }),
      setNotificationTime: (hour, minute) =>
        set({ notificationHour: hour, notificationMinute: minute }),
      setIsPremium: (v) => set({ isPremium: v }),
      clearPendingTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter(
            (t) => t.status === 'completed' || t.status === 'dropped'
          ),
        })),
    }),
    {
      name: 'focus-flow-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        energyLevel: state.energyLevel,
        todayEnergyDate: state.todayEnergyDate,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        weeklyHistory: state.weeklyHistory,
        celebratedMilestones: state.celebratedMilestones,
        notificationEnabled: state.notificationEnabled,
        notificationHour: state.notificationHour,
        notificationMinute: state.notificationMinute,
        isPremium: state.isPremium,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
