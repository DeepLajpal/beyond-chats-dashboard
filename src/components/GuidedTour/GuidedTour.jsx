// GuidedTour.jsx
import React from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';

const GuidedTour = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="guided-tour-title"
      aria-describedby="guided-tour-description"
    >
      <Box sx={{ ...styles.modalContent }}>
        <Typography id="guided-tour-title" variant="h6" component="h2">
          Welcome to the Guided Tour!
        </Typography>
        <Typography id="guided-tour-description" sx={{ mt: 2 }}>
          This is a brief overview of the application features.
        </Typography>
        {/* Add more tour content here */}
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Close Tour
        </Button>
      </Box>
    </Modal>
  );
};

const styles = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
};

export default GuidedTour;
