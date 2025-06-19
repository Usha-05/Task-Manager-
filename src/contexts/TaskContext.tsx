
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'incomplete';
  createdAt: Date;
  updatedAt: Date;
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in a real app, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load tasks from localStorage for demo
      const savedTasks = localStorage.getItem(`tasks_${user?.id}`);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        setTasks(parsedTasks);
      } else {
        // Demo tasks
        const demoTasks: Task[] = [
          {
            id: '1',
            title: 'Complete project setup',
            description: 'Set up the development environment and install dependencies',
            status: 'completed',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            title: 'Design user interface',
            description: 'Create wireframes and design the task manager interface',
            status: 'incomplete',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        setTasks(demoTasks);
        localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(demoTasks));
      }
    } catch (error) {
      toast({
        title: "Error loading tasks",
        description: "Failed to load tasks from server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  const addTask = async (title: string, description: string) => {
    try {
      setIsLoading(true);
      
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        status: 'incomplete',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      
      toast({
        title: "Task added",
        description: "New task has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error adding task",
        description: "Failed to create new task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedTasks = tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      );
      
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === 'completed' ? 'incomplete' : 'completed';
      await updateTask(id, { status: newStatus });
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
