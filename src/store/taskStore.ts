import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskSlot, TaskStatus, EnergyLevel } from '../types';

function toDateString(date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateString(d);
}

interface TaskStore {
  // Hydration flag — true once AsyncStorage has been read
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // Tasks
  tasks: Task[];

  // Daily energy
  energyLevel: EnergyLevel | null;
  todayEnergyDate: string | null; // 'YYYY-MM-DD' of the day energy was set

  // Streak
  streak: number;
  lastActiveDate: string | null; // last date we had ≥1 completion

  // Settings
  notificationEnabled: boolean;
  notificationHour: number;   // 0-23
  notificationMinute: number; // 0-59
  isPremium: boolean;

  // Actions
  setEnergyLevel: (level: EnergyLevel) => void;
  addTask: (title: string, slot: TaskSlot, estimatedMinutes?: number) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  moveTask: (id: string, slot: TaskSlot) => void;
  removeTask: (id: string) => void;

  // Computed helpers
  getActiveTasks: (slot: TaskSlot) => Task[];
  completedTodayCount: () => number;

  // Day management
  checkAndResetDay: () => void;

  // Settings actions
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
              ? {
                  ...t,
                  status,
                  completedAt:
                    status === 'completed'
                      ? new Date().toISOString()
                      : t.completedAt,
                }
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
          (t) =>
            t.slot === slot &&
            t.status !== 'dropped' &&
            t.status !== 'completed'
        ),

      completedTodayCount: () =>
        get().tasks.filter((t) => t.status === 'completed').length,

      checkAndResetDay: () => {
        const state = get();
        const today = toDateString();

        // Already reset today — nothing to do
        if (state.lastActiveDate === today) return;

        const hadCompletionsYesterday =
          state.lastActiveDate === yesterdayString() &&
          state.tasks.some((t) => t.status === 'completed');

        const newStreak = hadCompletionsYesterday ? state.streak + 1 : 0;

        // Archive: keep only active (pending / in_progress) tasks
        const survivingTasks = state.tasks.filter(
          (t) => t.status === 'pending' || t.status === 'in_progress'
        );

        set({
          tasks: survivingTasks,
          streak: newStreak,
          lastActiveDate: today,
          energyLevel: null,
          todayEnergyDate: null,
        });
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
      // Only persist state — not functions
      partialize: (state) => ({
        tasks: state.tasks,
        energyLevel: state.energyLevel,
        todayEnergyDate: state.todayEnergyDate,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
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
