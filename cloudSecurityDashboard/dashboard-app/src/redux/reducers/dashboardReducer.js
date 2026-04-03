import { ADD_WIDGET, REMOVE_WIDGET } from '../actions/dashboardActions';

export const initialState = {
  categories: [
    {
      id: 'cspm',
      title: 'CSPM Executive Dashboard',
      widgets: [
        { 
          id: 'w1', 
          title: 'Cloud Accounts', 
          content: 'Commercial (1)\nNot Commercial (2)',
          type: 'text'
        },
        { 
          id: 'w2', 
          title: 'Clear Account Risk Assessment', 
          content: 'No Graph-data available',
          type: 'graph-placeholder'
        }
      ]
    },
    {
      id: 'cwpp',
      title: 'CWPP Dashboard',
      widgets: [
        { 
          id: 'w3', 
          title: 'Top Homepages Specific alerts', 
          content: 'Workload alerts',
          type: 'text' 
        },
        { 
          id: 'w4', 
          title: 'Workload alerts', 
          content: 'No Graph-data available',
          type: 'graph-placeholder'
        }
      ]
    },
    {
      id: 'registry',
      title: 'Registry Scan',
      widgets: [
        { 
          id: 'w5', 
          title: 'Image Risk Assessment', 
          content: [
            ['MTO', 'Total Value-Related'],
            ['Office (5)', 'App (No)']
          ],
          type: 'table'
        },
        { 
          id: 'w6', 
          title: 'Image Security Issues', 
          content: '2 Year images',
          type: 'text'
        }
      ]
    }
  ],
  availableWidgets: {
    cspm: ['Cloud Accounts', 'Account Risk Score', 'Compliance Status'],
    cwpp: ['Workload Alerts', 'Vulnerability Scan'],
    registry: ['Image Risk', 'Registry Vulnerabilities']
  }
};
const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WIDGET:
      const { categoryId, title, content } = action.payload;
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === categoryId 
            ? { 
                ...category, 
                widgets: [...category.widgets, { id: `w${Date.now()}`, title, content }] 
              }
            : category
        )
      };
    case REMOVE_WIDGET:
      const { categoryId: cId, widgetId } = action.payload;
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === cId
            ? {
                ...category,
                widgets: category.widgets.filter(widget => widget.id !== widgetId)
              }
            : category
        )
      };
    default:
      return state;
  }
};

export default dashboardReducer;