import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
  tasks: [],
};

const findComment = (comments, id) => {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    if (comment.replies) {
      const found = findComment(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
};

const taskList = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTasks: (state, action) => {
      state.tasks.push({
        status: action.payload.status,
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description || null,
        completed: false,
        priority: action.payload.priority,
        projectId: action.payload.projectId,
        createdAt: dayjs().format('DD.MM.YYYY'),
        startTime: null,
        workingTime: 0,
        isActive: false,
        deadLineDate: action.payload.deadLineDate || null,
        subTasks: [],
        comments: [],
      });
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = 'Done';
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.completed = action.payload.status === 'Done';
      }
    },
    updateTaskTitle: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
    },
    updateTaskDiscription: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.description = action.payload.description;
      }
    },
    updatePriority: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
      }
    },
    startTask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        if (task.isActive) {
          const diff = dayjs().diff(dayjs(task.startTime), 'second');
          task.workingTime += diff;
          task.startTime = null;
          task.isActive = false;
        } else {
          task.startTime = dayjs().toISOString();
          task.isActive = true;
        }
      }
    },
    updateDeadLineDate: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.deadLineDate = action.payload.deadLineDate;
      }
    },
    addSubtask: (state, action) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );
      if (task) {
        const newSubtask = {
          id: Date.now(),
          title: action.payload.title,
          completed: false,
        };
        task.subTasks.push(newSubtask);
      }
    },
    deleteSubTask: (state, action) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );
      if (task) {
        task.subTasks = task.subTasks.filter(
          (subTask) => subTask.id !== action.payload.subTaskId
        );
      }
    },
    toggleSubtaskCompletion: (state, action) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );
      if (task) {
        const subtask = task.subTasks.find(
          (subTask) => subTask.id === action.payload.subTaskId
        );
        if (subtask) {
          subtask.completed = !subtask.completed;
        }
      }
    },
    addComment: (state, action) => {
      const { taskId, parentId, content } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        const newComment = {
          id: Date.now(),
          content,
          replies: [],
        };
        if (parentId) {
          const parentComment = findComment(task.comments, parentId);
          if (parentComment) {
            parentComment.replies.push(newComment);
          }
        } else {
          task.comments.push(newComment);
        }
      }
    },
  },
});

export const {
  addTasks,
  toggleTaskCompletion,
  deleteTask,
  updateTaskStatus,
  updateTaskTitle,
  updateTaskDiscription,
  updatePriority,
  startTask,
  updateDeadLineDate,
  addSubtask,
  deleteSubTask,
  toggleSubtaskCompletion,
  addComment,
} = taskList.actions;

export default taskList.reducer;
