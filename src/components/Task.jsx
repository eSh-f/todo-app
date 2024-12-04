import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  Box,
  Button,
  Checkbox,
  Typography,
  Card,
  CardContent,
  CardActions,
  ButtonGroup,
} from '@mui/material';
import { useDrag } from 'react-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import TimerIcon from '@mui/icons-material/Timer';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CreateIcon from '@mui/icons-material/Create';
import CommentIcon from '@mui/icons-material/Comment';
import dayjs from 'dayjs';
import {
  addSubtask,
  deleteSubTask,
  toggleSubtaskCompletion,
  addComment,
} from '../redux/slices/taskListSlice';

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

  const renderComments = (comments = []) =>
    comments.map((comment) => (
      <Box
        key={comment.id}
        sx={{
          padding: 1,
          border: '1px solid #ccc',
          borderRadius: 1,
          marginY: 1,
        }}
      >
        <Typography>{comment.content}</Typography>
        <Button onClick={() => setReplayingTo(comment.id)}>Ответить</Button>
        {replyingTo === comment.id && (
          <Box>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Введите ваш ответ'
            />
            <Button onClick={handleAddComment}>Добавить ответ</Button>
          </Box>
        )}
      </Box>
    ));

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

  return (
    <Card
      ref={drag}
      sx={{
        marginBotton: 2,
        width: '100%',
        margin: '2px',
        maxWidth: 350,
        margin: '8px auto',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      <CardContent sx={{ paddingBottom: '8px' }}>
        <Typography variant='body2' color='textSecondary'>
          {selectPriority[task.priority]}
        </Typography>

        <Typography
          onDoubleClick={() => openModal(task)}
          sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          variant='h6'
        >
          {task.title}
        </Typography>

        {task.description ? (
          <Typography variant='body2'>
            Описание: {task.description.replace(/<[^>]+>/g, '')}
          </Typography>
        ) : (
          ''
        )}

        {task.deadLineDate ? (
          <Typography variant='body2' sx={{ marginTop: 1, color: 'gray' }}>
            Крайний срок: {task.deadLineDate}
          </Typography>
        ) : (
          ''
        )}

        <Typography variant='body2' sx={{ marginTop: 1, color: 'gray' }}>
          Дата создания: {task.createdAt}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'space-between',
          padding: '8px 16px',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <ButtonGroup size='small'>
          <Button onClick={() => toggleTaskCompletion(task.id)}>
            <DoneIcon />
          </Button>
          <Button onClick={() => openModal(task)}>
            <CreateIcon />
          </Button>
          <Button onClick={() => deleteTask(task.id)}>
            <DeleteIcon />
          </Button>
          <Button onClick={() => handleStart(task.id)}>
            {task.isActive ? formatTime(elapsedTime) : <TimerIcon />}
          </Button>
        </ButtonGroup>
        <ButtonGroup size='small'>
          <Button onClick={() => setShowSubtask(!showSubtask)}>
            <FormatListBulletedIcon />
          </Button>
          <Button onClick={() => setShowComment(!showComment)}>
            <CommentIcon />
          </Button>
        </ButtonGroup>

        {showSubtask && (
          <Box
            sx={{
              padding: '8px',
              borderTop: '1px solid #ddd',
            }}
          >
            <Typography variant='subtitle2'>Подзадачи:</Typography>
            <List>
              {task.subTasks.map((subtask) => (
                <ListItem
                  key={subtask.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Checkbox
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtaskComplition(subtask.id)}
                  />
                  <Typography>{subtask.title}</Typography>
                  <Button
                    size='small'
                    color='error'
                    onClick={() => handleDeleteSubtask(subtask.id)}
                  >
                    Удалить
                  </Button>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
              <input
                type='text'
                placeholder='Добавить подзадачу'
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <Button
                onClick={handleAddSubtask}
                size='small'
                variant='contained'
              >
                Добавить
              </Button>
            </Box>
          </Box>
        )}

        {showComment && (
          <Box x={{ padding: '6px', borderTop: '1px solid #ddd' }}>
            <Typography variant='subtitle2'> Комментарий:</Typography>
            <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
              <input
                type='text'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Введите комментарий'
                style={{
                  flex: 1,
                  padding: '6px',
                  border: '1px solic #ccc',
                  borderRadius: '4px',
                }}
              />
              <Button
                onClick={handleAddComment}
                size='small'
                variant='countainer'
              >
                Добавить комментарий
              </Button>
            </Box>
            <Box>{task.comments && renderComments(task.comments)}</Box>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default Task;
