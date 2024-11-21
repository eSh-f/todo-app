import { configureStore } from '@reduxjs/toolkit';
import taskList from './slices/taskListSlice';
import projectList from './slices/projectListSlice';

export const store = configureStore({
  reducer: { taskList, projectList },
});
