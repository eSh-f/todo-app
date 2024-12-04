import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTasks,
  toggleTaskCompletion,
  deleteTask,
  updateTaskTitle,
  updateTaskStatus,
  updateTaskDiscription,
  updatePriority,
  startTask,
  updateDeadLineDate,
} from '../redux/slices/taskListSlice';

import TaskModal from '../components/modals/TaskModal';
import Task from '../components/Task';
import DropZone from '../components/DropZone';

const TaskList = ({ searchQuery, isSearching, filteredTasks, resetSearch }) => {
  const { title } = useParams();
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [deadLineDate, setDeadLineDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const dispatch = useDispatch();

  const project = useSelector((state) =>
    state.projectList.projects.find((proj) => proj.title === title)
  );

  const tasks = useSelector((state) =>
    project
      ? state.taskList.tasks.filter((task) => task.projectId === project?.id)
      : []
  );
  console.log('Список задач:', tasks);

  const taskToDisplay = isSearching ? filteredTasks : tasks;

  const handleAddOrUpdateTask = () => {
    if (editingTask) {
      dispatch(updateTaskTitle({ id: editingTask.id, title: taskTitle }));
      dispatch(updateTaskDiscription({ id: editingTask.id, description }));
      dispatch(updatePriority({ id: editingTask.id, priority }));
      dispatch(updateDeadLineDate({ id: editingTask.id, deadLineDate }));
    } else {
      dispatch(
        addTasks({
          projectId: project?.id,
          title: taskTitle,
          description,
          priority,
          status: 'Queue',
          deadLineDate,
        })
      );
    }
    resetModal();
  };

  const resetModal = () => {
    setTaskTitle('');
    setDescription('');
    setPriority('low');
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const openModal = () => {
    resetModal();
    setIsModalOpen(true);
    setEditingTask(null);
  };
  const openEditModal = (task) => {
    setTaskTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDeadLineDate(task.deadLineDate || null);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tasksByStatus = {
    Queue: taskToDisplay.filter((task) => task.status === 'Queue'),
    Development: taskToDisplay.filter((task) => task.status === 'Development'),
    Done: taskToDisplay.filter((task) => task.status === 'Done'),
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: 2,
        }}
      >
        <Box sx={{ marginBottom: '10px' }}>
          <Button variant='contained' onClick={openModal}>
            Добавить задачу
          </Button>
        </Box>

        <Box>
          <Grid container spacing={1}>
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <Grid key={status}>
                <Box>
                  <DropZone
                    status={status}
                    updateTaskStatus={(id, status) =>
                      dispatch(updateTaskStatus({ id, status }))
                    }
                  >
                    {tasks.map((task) => (
                      <Task
                        handleStart={(id) => {
                          dispatch(startTask({ id: task.id }));
                        }}
                        key={task.id}
                        task={task}
                        editingTask={editingTask}
                        openModal={() => openEditModal(task)}
                        toggleTaskCompletion={(id) =>
                          dispatch(toggleTaskCompletion(id))
                        }
                        deleteTask={(id) => dispatch(deleteTask(id))}
                        updateTaskTitle={(id, newTitle) =>
                          dispatch(updateTaskTitle({ id, title: newTitle }))
                        }
                      />
                    ))}
                  </DropZone>
                </Box>
              </Grid>
            ))}
          </Grid>
          <TaskModal
            deadLineDate={deadLineDate}
            setDeadLineDate={setDeadLineDate}
            editingTask={editingTask}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            taskTitle={taskTitle}
            description={description}
            priority={priority}
            setTaskTitle={setTaskTitle}
            setDescription={setDescription}
            setPriority={setPriority}
            handleAddOrUpdateTask={handleAddOrUpdateTask}
          />
        </Box>
      </Box>
    </>
  );
};

export default TaskList;
