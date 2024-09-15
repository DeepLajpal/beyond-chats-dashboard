import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import TableChartIcon from "@mui/icons-material/TableChart";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Paper } from '@mui/material';
import { useOrgContext } from 'context/OrgContext';

export default function MobileBottomNav() {
  const [value, setValue] = React.useState(0);
  const history = useHistory(); // Using useHistory for navigation
	const { org } = useOrgContext();

  const handleNavChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        history.push(`/${encodeURIComponent(org.host_url)}/mind-map`);  // Navigate to Mind Map
        break;
      case 1:
        history.push("/");     // Navigate to Chats
        break;
      case 2:
        history.push(`/${encodeURIComponent(org.host_url)}/leads`);     // Navigate to Business Leads
        break;
      case 3:
        history.push(`/${encodeURIComponent(org.host_url)}/team`);      // Navigate to Team Management
        break;
      case 4:
        history.push(`/${encodeURIComponent(org.host_url)}/config`);    // Navigate to Chatbot Configuration
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ width: "100vw" }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex:"1000" }} elevation={3}>
        <BottomNavigation
        sx={{zIndex:"1000"}}
          showLabels
          value={value}
          onChange={handleNavChange} // Handle navigation change
        >
          <BottomNavigationAction label="Mind Map" icon={<TableChartIcon />} />
          <BottomNavigationAction label="Chats" icon={<InboxIcon />} />
          <BottomNavigationAction label="Leads" icon={<ContactPhoneIcon />} />
          <BottomNavigationAction label="Team" icon={<GroupsIcon />} />
          <BottomNavigationAction label="C.ChatBot" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
