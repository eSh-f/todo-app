import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
};

const projectList = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addTodoProject: (state, action) => {
      state.projects.push({
        id: Date.now(),
        title: action.payload.title,
        createdAt: new Date().toLocaleDateString('ru-RU'),
      });
    },
    deleteTodoProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload.id
      );
    },
  },
});

export const { addTodoProject, deleteTodoProject } = projectList.actions;

export default projectList.reducer;
