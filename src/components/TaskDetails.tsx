import React, { useState } from 'react';
import { Task, Comment, Attachment, Label } from '../types';
import { X, Paperclip, Send, Clock, User, Tag } from 'lucide-react';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

export default function TaskDetails({ task, onClose, onUpdate }: TaskDetailsProps) {
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      content: comment,
      userId: '1', // In a real app, this would come from auth context
      userName: 'Current User',
      createdAt: new Date(),
    };

    onUpdate({
      ...task,
      comments: [...task.comments, newComment],
    });
    setComment('');
  };

  const handleSaveEdit = () => {
    onUpdate(editedTask);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                className="w-full px-2 py-1 border rounded"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              />
            ) : (
              <h2 className="text-xl font-semibold">{task.title}</h2>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="text-sm text-gray-600">
                {task.assignee || 'Unassigned'}
              </span>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm text-gray-600">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <div className="flex gap-1">
                {task.labels.map((label: Label) => (
                  <span
                    key={label.id}
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ backgroundColor: label.color + '20', color: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            {editMode ? (
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            )}
          </div>

          {task.attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Attachments</h3>
              <div className="grid grid-cols-2 gap-2">
                {task.attachments.map((attachment: Attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                  >
                    <Paperclip size={16} />
                    <span className="text-sm text-blue-600 truncate">
                      {attachment.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Comments</h3>
            <div className="space-y-4">
              {task.comments.map((comment: Comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t space-y-4">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border rounded-md"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
          </form>

          <div className="flex justify-end gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
              >
                Edit Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}