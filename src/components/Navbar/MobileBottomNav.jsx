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
  const history = useHistory();
  const { org } = useOrgContext();

  const handleNavChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        history.push(`/${encodeURIComponent(org.host_url)}/mind-map`);
        break;
      case 1:
        history.push("/");
        break;
      case 2:
        history.push(`/${encodeURIComponent(org.host_url)}/leads`);
        break;
      case 3:
        history.push(`/${encodeURIComponent(org.host_url)}/team`);
        break;
      case 4:
        history.push(`/${encodeURIComponent(org.host_url)}/mind-map`);
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavChange}
          sx={{
            '& .MuiBottomNavigationAction-root': {
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              fontSize: "0.7rem", 
              padding:"10px",
              '& .MuiSvgIcon-root': {
                fontSize:"1.2rem"
              },
            },
            '& .Mui-selected': {
              backgroundColor: "#2872FA", 
              borderRadius: "0.5rem",
              color: "white",
              fontSize: "0.7rem !important",
              '& .MuiSvgIcon-root': {
                color: "white", 
                fontSize:"1.2rem"

              },
            },
          }}
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
