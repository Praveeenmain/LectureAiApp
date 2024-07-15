import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import SchoolIcon from '@mui/icons-material/School';
const LabelBottomNavigation = () => {
  const location = useLocation();

  // Determine which tab should be highlighted based on the current path
  const getValueFromPath = (path) => {
    switch (path) {
      case '/voice':
        return 'aichat';
      case '/students':
        return 'students';
      case '/profile':
        return 'profile';
      default:
        return 'home';
    }
  };

  const value = getValueFromPath(location.pathname);

  return (
    <BottomNavigation
      sx={{
        width: '100%', // Take full width of the viewport
        position: 'fixed', // Fixed positioning to keep it at the bottom
        bottom: 0, // Align at the bottom
        backgroundColor: '#212020',
        color: 'white',
        '& .Mui-selected': {
          color: 'white', // Text color for selected item
        },
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Box shadow
      }}
      value={value}
    >
      
      <BottomNavigationAction
        label="Assistant"
        value="aichat"
        icon={<AutoFixHighOutlinedIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
        component={Link}
        to="/voice"
      />
      <BottomNavigationAction
        label="Knowledge"
        value="home"
        icon={<SchoolIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
        component={Link}
        to="/home"
      />
      <BottomNavigationAction
        label="Students"
        value="students"
        icon={<PeopleIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
        component={Link}
        to="/students"
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<AccountCircleIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
        component={Link}
        to="/profile"
      />
    </BottomNavigation>
  );
}

export default LabelBottomNavigation;
