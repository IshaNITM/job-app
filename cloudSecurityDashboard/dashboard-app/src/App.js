import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addWidget, removeWidget } from './redux/actions/dashboardActions';
import Category from './components/Category/Category';
import Search from './components/Search/Search';
import './App.css';

function App() {
  const categories = useSelector(state => state.dashboard.categories);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddWidget = (categoryId, title, content) => {
    dispatch(addWidget(categoryId, title, content));
  };

  const handleRemoveWidget = (categoryId, widgetId) => {
    dispatch(removeWidget(categoryId, widgetId));
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget =>
      widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <Box className="app-container">
      <Typography variant="h4" gutterBottom className="breadcrumb">
        Home &gt; Dashboard V2
      </Typography>
      <Typography variant="subtitle1" gutterBottom className="path">
        C:\APP\Dashboard
      </Typography>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {filteredCategories.map(category => (
        <Category
        key={category.id}
        id={category.id}
        title={category.title}
        widgets={category.widgets}
        onAddWidget={handleAddWidget}
        onRemoveWidget={handleRemoveWidget}
      />
      
      ))}
    </Box>
  );
}

export default App;