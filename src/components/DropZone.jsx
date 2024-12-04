import React from 'react';
import { useDrop } from 'react-dnd';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

const DropZone = ({ status, children, updateTaskStatus, className }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (draggedItem) => {
      if (draggedItem.status !== status) {
        updateTaskStatus(draggedItem.id, status);
      }
    },
  });

  const color = (status) => {
    switch (status) {
      case 'Queue':
        return 'lightblue';
      case 'Development':
        return 'lightgreen';
      case 'Done':
        return 'lightcoral';
    }
  };

  return (
    <Box
      ref={drop}
      sx={{
        padding: 2,
        border: '1px solid grey',
        borderRadius: 2,
        backgroundColor: color(status),
        width: '50vh',
        minHeight: '250px',
      }}
    >
      <Typography variant='h6' align='center' gutterBottom>
        {status}
      </Typography>
      <List>
        {React.Children.map(children, (child, index) => (
          <ListItem key={index} disablePadding>
            {child}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DropZone;
