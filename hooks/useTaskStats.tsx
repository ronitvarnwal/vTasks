import { useMemo } from 'react';

type Task = {
  id: string | number;
  title: string;
  complete: boolean;
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent';
  frequency: 'daily' | 'weekly' | 'monthly';
};

type TaskStats = {
  completed: number;
  total: number;
  percentage: number;
  remaining: number;
};

type AllTaskStats = {
  daily: TaskStats;
  weekly: TaskStats;
  monthly: TaskStats;
  overall: TaskStats;
};

export default function useTaskStats(
  dailyTasks: Task[],
  weeklyTasks: Task[],
  monthlyTasks: Task[]
): AllTaskStats {
  return useMemo(() => {
    const calculateStats = (tasks: Task[]): TaskStats => {
      if (!tasks || tasks.length === 0) {
        return { completed: 0, total: 0, percentage: 0, remaining: 0 };
      }

      const completed = tasks.filter(task => task.complete).length;
      const total = tasks.length;
      const percentage = Math.round((completed / total) * 100);
      const remaining = total - completed;

      return { completed, total, percentage, remaining };
    };

    const daily = calculateStats(dailyTasks);
    const weekly = calculateStats(weeklyTasks);
    const monthly = calculateStats(monthlyTasks);

    const allTasks = [...(dailyTasks || []), ...(weeklyTasks || []), ...(monthlyTasks || [])];
    const overall = calculateStats(allTasks);

    return { daily, weekly, monthly, overall };
  }, [dailyTasks, weeklyTasks, monthlyTasks]);
}