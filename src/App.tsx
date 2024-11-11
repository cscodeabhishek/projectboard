import React, { useState } from 'react';
import { Task, Column as ColumnType, Status, Label, TaskFilter } from './types';
import Column from './components/Column';
import NewTaskModal from './components/NewTaskModal';
import TaskDetails from './components/TaskDetails';
import TaskFilters from './components/TaskFilters';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Plus } from 'lucide-react';

const initialLabels: Label[] = [
  { id: '1', name: 'Bug', color: '#E53E3E' },
  { id: '2', name: 'Feature', color: '#38A169' },
  { id: '3', name: 'Enhancement', color: '#4299E1' },
  { id: '4', name: 'Documentation', color: '#805AD5' },
  { id: '5', name: 'Design', color: '#D53F8C' },
];

const initialColumns: ColumnType[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

function ProjectBoard() {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilter>({});

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    const updatedColumns = columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(task => task.id !== taskId)
    }));

    const task = columns
      .flatMap(col => col.tasks)
      .find(task => task.id === taskId);

    if (task) {
      const targetColumn = updatedColumns.find(col => col.id === targetStatus);
      if (targetColumn) {
        targetColumn.tasks.push({ ...task, status: targetStatus });
      }
    }

    setColumns(updatedColumns);
  };

  const handleNewTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'comments' | 'attachments'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      comments: [],
      attachments: [],
    };

    setColumns(columns.map(col => 
      col.id === 'todo'
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setColumns(columns.map(col => ({
      ...col,
      tasks: col.tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    })));
    setSelectedTask(updatedTask);
  };

  const filterTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(task => {
      if (filters.dateFrom && new Date(task.createdAt) < filters.dateFrom) return false;
      if (filters.dateTo && new Date(task.createdAt) > filters.dateTo) return false;
      if (filters.assignee && !task.assignee?.toLowerCase().includes(filters.assignee.toLowerCase())) return false;
      if (filters.labels?.length && !task.labels.some(label => filters.labels?.includes(label.id))) return false;
      if (filters.clientName && !task.clientName?.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
      if (filters.ticketStatus && task.ticketStatus !== filters.ticketStatus) return false;
      return true;
    });
  };

  const filteredColumns = columns.map(col => ({
    ...col,
    tasks: filterTasks(col.tasks),
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-1" />
            New Issue
          </button>
        </div>

        <TaskFilters
          onFilterChange={setFilters}
          availableLabels={initialLabels}
        />

        <div className="flex gap-4 overflow-x-auto pb-4">
          {filteredColumns.map(column => (
            <Column
              key={column.id}
              column={column}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>
      </main>

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewTask}
        availableLabels={initialLabels}
      />

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
}

function AuthContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <ProjectBoard /> : <LoginPage />;
}

export default App;