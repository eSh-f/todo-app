import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  addSubtask,
  deleteSubTask,
  toggleSubtaskCompletion,
  addComment,
} from '../redux/slices/taskListSlice';
import { useDrag } from 'react-dnd';
import 'react-quill/dist/quill.snow.css';
import '../scss/todostylenew.scss';
import dayjs from 'dayjs';

const Task = ({
  task,
  toggleTaskCompletion,
  deleteTask,
  openModal,
  handleStart,
}) => {
  const dispatch = useDispatch();

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplayingTo] = useState(null);

  const [showSubtask, setShowSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const [showComment, setShowComment] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    dispatch(
      addComment({ taskId: task.id, parentId: replyingTo, content: newComment })
    );
    setNewComment('');
    setReplayingTo(null);
  };

  const renderComments = (comments = []) => {
    return comments.map((comment) => (
      <div key={comment.id} className='comment-box'>
        <p className='comment-content'>
          {comment.content}
          <button
            className='reply-button'
            onClick={() => setReplayingTo(comment.id)}
          >
            Ответить
          </button>
        </p>
        {replyingTo === comment.id && (
          <div className='reply-box'>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Введите ваш ответ'
            />
            <button onClick={handleAddComment}>Добавить ответ</button>
          </div>
        )}
        {comment.replies?.length > 0 && (
          <div className='replies'>{renderComments(comment.replies)}</div>
        )}
      </div>
    ));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim() === '') return;
    dispatch(addSubtask({ taskId: task.id, title: newSubtaskTitle }));
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subTaskId) => {
    dispatch(deleteSubTask({ taskId: task.id, subTaskId }));
  };

  const handleToggleSubtaskComplition = (subTaskId) => {
    dispatch(toggleSubtaskCompletion({ taskId: task.id, subTaskId }));
  };

  const [elapsedTime, setElapsedTime] = useState(task.workingTime);

  const selectPriority = { low: '🟢', medium: '🟠', high: '🔴' };

  useEffect(() => {
    let timer;
    if (task.isActive) {
      timer = setInterval(() => {
        const diff = dayjs().diff(dayjs(task.startTime), 'second');
        setElapsedTime(task.workingTime + diff);
      }, 1000);
    } else {
      setElapsedTime(task.workingTime);
    }

    return () => clearInterval(timer);
  }, [task.isActive, task.startTime, task.workingTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${hours}h ${minutes}m ${sec}s`;
  };

  const style = {
    opacity: isDragging ? 0.5 : 1,
    textDecoration:
      task.completed && task.status === 'Done' ? 'line-through' : 'none',
    padding: '5px',
    border: '1px solid rgb(91, 90, 165)',
    borderRadius: '10px',
    margin: '4px',
    backgroundColor: 'white',
    cursor: 'move',
  };

  return (
    <li ref={drag} style={style}>
      <span onDoubleClick={() => openModal(task)}> {task.title}</span>
      {selectPriority[task.priority]}
      <button onClick={() => toggleTaskCompletion(task.id)}>✅</button>
      <button onClick={() => openModal(task)}>✏️</button>
      <button onClick={() => deleteTask(task.id)}>❌</button>
      <button onClick={() => handleStart(task.id)}>
        {task.isActive ? formatTime(elapsedTime) : '⏱️'}
      </button>
      <button onClick={() => setShowSubtask(!showSubtask)}> 📋 </button>
      <button onClick={() => setShowComment(!showComment)}> 📝</button>

      {showSubtask && (
        <div className='subtasks-section'>
          <ul>
            {task.subTasks.map((subtask) => (
              <li key={subtask.id} className='subtask-item'>
                <input
                  type='checkbox'
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtaskComplition(subtask.id)}
                />
                <span className={subtask.completed ? 'completed-subtask' : ''}>
                  {subtask.title}
                </span>
                <button
                  className='delete-subtask'
                  onClick={() => handleDeleteSubtask(subtask.id)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <div className='add-subtask'>
            <input
              type='text'
              placeholder='Добавить подзадачу'
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
            />
            <button onClick={handleAddSubtask}>Добавить</button>
          </div>
        </div>
      )}

      {showComment && (
        <div className='comment-section'>
          <input
            type='text'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Введите комментарий'
          />
          <button className='add-comment' onClick={handleAddComment}>
            Добавить комментарий
          </button>
          <div>{task.comments && renderComments(task.comments)}</div>
        </div>
      )}
    </li>
  );
};

export default Task;
