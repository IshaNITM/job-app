import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './AddWidgetDialog.css';

const AddWidgetDialog = ({
  open,
  onClose,
  selectedWidgets,
  setSelectedWidgets,
  onConfirm
}) => {
  const handleToggleWidget = (title) => {
    setSelectedWidgets(prev => 
      prev.includes(title) 
        ? prev.filter(w => w !== title) 
        : [...prev, title]
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <div className="dialog-header">
          <span>Personalize your dashboard by adding the following widget:</span>
          <CloseIcon className="close-icon" onClick={onClose} />
        </div>
      </DialogTitle>
      <DialogContent>
        <Table className="widget-select-table">
          <TableBody>
            {/* Header Row */}
            <TableRow className="header-row">
              <TableCell><strong>CSPM</strong></TableCell>
              <TableCell><strong>CWPP</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Ticket</strong></TableCell>
            </TableRow>
            
            {/* First Widget Row - */}
            <TableRow>
              <TableCell>
                <Checkbox 
                  checked={selectedWidgets.includes('Cloud Accounts')}
                  onChange={() => handleToggleWidget('Cloud Accounts')}
                  className="widget-checkbox"
                />
                Cloud Accounts
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            
            {/* Second Widget Row -  */}
            <TableRow>
              <TableCell>
                <Checkbox 
                  checked={selectedWidgets.includes('Clear Account Risk Assessment')}
                  onChange={() => handleToggleWidget('Clear Account Risk Assessment')}
                  className="widget-checkbox"
                />
                Clear Account Risk Assessment
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWidgetDialog;