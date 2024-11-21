import React, { useState } from 'react';
import '../scss/todoList.scss';
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
import Search from '../components/Search';

const TaskList = () => {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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
    state.taskList.tasks.filter((task) => task.projectId === project?.id)
  );
  console.log('Список задач:', tasks);

  const handleSearch = (results) => {
    setFilteredTasks(results);
    setIsSearching(true);
  };

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
    <div className='wrapper'>
      <Search tasks={tasks} onSearch={handleSearch} />

      <h1>Проект: {title}</h1>

      <div>
        Добавить задачу
        <button onClick={openModal}>+</button>
      </div>

      <div className='column-container'>
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <DropZone
            className={`column-${status.toLowerCase()}`}
            key={status}
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
        ))}
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
      </div>
    </div>
  );
};

export default TaskList;
