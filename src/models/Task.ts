import mongoose, { Schema, model, models } from 'mongoose';
import { Priority, Status } from '../types/task';

const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this task.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['todo', 'completed'],
    default: 'todo',
  },
  dueDate: {
    type: String,
    required: [true, 'Please provide a due date.'],
  },
  category: {
    type: String,
    default: 'Personal',
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
}, {
  timestamps: false, // We use createdAt: Number to match existing frontend expectations
});

// Avoid re-compiling the model if it already exists
const Task = models.Task || model('Task', TaskSchema);

export default Task;
