
import React, { useState } from 'react';
import { Task, useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import TaskDialog from './TaskDialog';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTask();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={handleToggleStatus}
                className="mt-1"
              />
              <div className="flex-1">
                <CardTitle className={`text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                    {task.status === 'completed' ? 'Completed' : 'Incomplete'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {task.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {task.description && (
          <CardContent className="pt-0">
            <CardDescription className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>
              {task.description}
            </CardDescription>
          </CardContent>
        )}
      </Card>

      <TaskDialog
        task={task}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        mode="edit"
      />
    </>
  );
};

export default TaskCard;
