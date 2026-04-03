import React from 'react';
import { Card, CardHeader, CardContent, IconButton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Widget.css';

const Widget = ({ id, title, content, type, onRemove }) => {
  const renderContent = () => {
    switch(type) {
      case 'table':
        return (
          <Table className="widget-table">
            <TableBody>
              {content.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case 'graph-placeholder':
        return <div className="graph-placeholder">{content}</div>;
      default:
        return content.split('\n').map((line, i) => <p key={i}>{line}</p>);
    }
  };

  return (
    <Card className="widget-card">
      <CardHeader
        title={title}
        action={
          <IconButton onClick={() => onRemove(id)}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Widget;