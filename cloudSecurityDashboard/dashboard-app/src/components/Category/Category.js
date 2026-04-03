import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Widget from '../Widget/Widget';
import './Category.css';

const Category = ({ id, title, widgets, onAddWidget, onRemoveWidget }) => {
  const [open, setOpen] = useState(false);
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [newWidgetContent, setNewWidgetContent] = useState('');

  const handleAddWidget = () => {
    onAddWidget(id, newWidgetTitle, newWidgetContent);
    setNewWidgetTitle('');
    setNewWidgetContent('');
    setOpen(false);
  };

  return (
    <Box className="category-container">
    <Typography variant="h6" className="category-title">
      {title}
    </Typography>
    <Box className="widgets-container">
      {widgets.map(widget => (
        <Widget
          key={widget.id}
          id={widget.id}
          title={widget.title}
          content={widget.content}
          type={widget.type}
          onRemove={(widgetId) => onRemoveWidget(id, widgetId)}
        />
      ))}
        <Button 
          variant="outlined" 
          className="add-widget-btn"
          onClick={() => setOpen(true)}
        >
          + Add Widget
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Widget</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Widget Title"
            fullWidth
            value={newWidgetTitle}
            onChange={(e) => setNewWidgetTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Widget Content"
            fullWidth
            multiline
            rows={4}
            value={newWidgetContent}
            onChange={(e) => setNewWidgetContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddWidget}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Category;