import React from 'react';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: ColumnType['id']) => void;
}

const statusColors = {
  todo: 'bg-gray-100',
  'in-progress': 'bg-blue-100',
  review: 'bg-yellow-100',
  done: 'bg-green-100',
};

export default function Column({ column, onDragStart, onDragOver, onDrop }: ColumnProps) {
  return (
    <div
      className="flex flex-col w-80 bg-gray-50 rounded-lg"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className={`p-3 ${statusColors[column.id]} rounded-t-lg`}>
        <h2 className="font-semibold text-gray-700 flex items-center justify-between">
          {column.title}
          <span className="bg-white px-2 py-1 rounded-full text-sm">
            {column.tasks.length}
          </span>
        </h2>
      </div>
      
      <div className="p-2 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {column.tasks.map((task: Task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}