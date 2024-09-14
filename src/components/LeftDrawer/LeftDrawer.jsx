import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Button, Tooltip, Typography, styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useResponsiveContext } from "context/ResponsiveContext";
import { useHistory } from "react-router-dom";
import { useState } from "react";

// Drawer header styling for alignment
const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar, // Adjust for app bar
}));

const drawerWidth = 270; // Set drawer width

// Drawer open state styling
const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

// Drawer closed state styling
const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`, // Width when collapsed
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
	[theme.breakpoints.down("sm")]: {
		width: `0px`, // Hide on small screens
	},
});

// Styled Drawer component
const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open", // Avoid passing "open" prop to DOM
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));




// Main component to render LeftDrawer
const LeftDrawer = ({ isOpened, toggleLeftNav, navOptions }) => {
	const history = useHistory();
	const { isMobile } = useResponsiveContext();
	
	const [showStartTutorial, setShowStartTutorial] = useState(() => {
		const searchParams = new URLSearchParams(history.location.search);
		return searchParams.get("guide") === "true";
	});
	return (
		<Drawer
			variant="permanent"
			anchor="left"
			open={isOpened}
			onClose={toggleLeftNav}
		>
			{/* Tooltip for opening/closing the drawer */}
			<Tooltip title={isOpened ? "Close Left Drawer" : "Open Left Drawer"} arrow>
				<DrawerHeader sx={{ margin: "1rem", marginRight: "0px" }}>
					{isOpened ? <WhatsAppIcon sx={{ color: "#2872FA", fontSize: "2.5rem", marginRight: "0.5rem" }} /> : null}
					{isOpened ? <Typography variant="h4" sx={{ fontWeight: "600" }}>Dashboard <span style={{ fontSize: "0.7rem", color: "#8A8A8A" }}>v.01</span></Typography> : null}
					<IconButton onClick={toggleLeftNav}>
						{isOpened ? <ChevronLeftIcon /> : <MenuIcon />}
					</IconButton>
				</DrawerHeader>
			</Tooltip>
			<Divider /> {/* Divider between header and list */}

			<List>
				{/* Map over navigation options */}
				{navOptions.map(({ title, Icon, onClick, isActive }, index) => (
					<Tooltip
						title={isOpened ? "" : title}
						arrow
						placement="right"
						key={title}
					>
						<ListItem
							disablePadding
							sx={{
								display: "block",
								backgroundColor: isActive ? "primary.light" : undefined, // Highlight active item
							}}
							className={`nav-option-${index}`}
						>
							{/* Navigation item button */}
							<ListItemButton
								onClick={() => {
									toggleLeftNav(false);
									onClick();
								}}
								sx={{
									minHeight: 48,
									justifyContent: isOpened ? "initial" : "center",
									px: 2.5,
								}}
							>
								{/* Icon for the nav option */}
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: isOpened ? 3 : "auto",
										justifyContent: "center",
									}}
								>
									<Icon color={isActive ? "primary" : undefined} />
								</ListItemIcon>
								{/* Text for the nav option */}
								<ListItemText
									primary={title}
									primaryTypographyProps={{ color: "#8A8A8A" }} // Adjust the font size here
									sx={{
										opacity: isOpened ? 1 : 0,
										"& span": {
											fontSize: "0.9rem", // Target the span inside
										},
									}} />
							</ListItemButton>
						</ListItem>
					</Tooltip>
				))}
			</List>

			{!isMobile ? (
				<Button
					variant="outlined"
					onClick={() => setShowStartTutorial(true)}
				>
					<Typography variant="h6">Guided Tour</Typography>
				</Button>
			) : null}
		</Drawer>
	);
};

export default withErrorBoundary(LeftDrawer, "LeftDrawer"); // Wrap with error boundary
