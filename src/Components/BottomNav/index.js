import * as React from 'react';
import { Link } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const LabelBottomNavigation = () => {
  const [value, setValue] = React.useState('home');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      sx={{
        width: '100%', // Take full width of the viewport
        position: 'fixed', // Fixed positioning to keep it at the bottom
        bottom: 0, // Align at the bottom
        backgroundColor: '#4f5153',
        color: 'white',
        '& .Mui-selected': {
          color: 'white', // Text color for selected item
        },
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Box shadow
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        label="HOME"
        value="home"
        icon={<HomeIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
        component={Link}
        to="/"
      />
      <BottomNavigationAction
        label="AICHAT"
        value="aichat"
        icon={<ChatIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
        component={Link}
        to="/aichat"
      />
      <BottomNavigationAction
        label="STUDENTS"
        value="students"
        icon={<PeopleIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
        component={Link}
        to="/students"
      />
      <BottomNavigationAction
        label="PROFILE"
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
