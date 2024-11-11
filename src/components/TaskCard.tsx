import React from 'react';
import { Task } from '../types';
import { AlertCircle, Clock, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500">#{task.id.slice(0, 8)}</span>
      </div>
      
      <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{task.assignee || 'Unassigned'}</span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}