import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Box, Button, Grid, Tooltip, Typography, styled } from "@mui/material";
import { makeStyles } from "@mui/styles"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import { useResponsiveContext } from "context/ResponsiveContext";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";

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

const useStyles2 = makeStyles((theme) => ({
	org: {
		display: "flex",
		alignItems: "center",
		padding: "0.5rem 1rem",
		cursor: "pointer",
		color: "var(--primary)",
		borderRadius: 8,
		"&:hover": {
			backgroundColor: "#f6f2f2",
		},
	},
	orgName: {
		color: "white",
		fontSize: "1rem",
		fontWeight: "600",
	},
	noOrg: {
		color: "var(--color5)",
		fontSize: "0.82rem",
		fontWeight: "400",
		height: "100%",
		display: "flex",
		width: "180px",
		padding: "0.5rem 1rem",
		lineHeight: "1.5",
	},
	orgBtn: {
		border: "none",
		outline: "none",
		color: "white",
		borderRadius: "0.5rem",
		fontWeight: "600",
		// background:"lightblue",
		backgroundImage: "linear-gradient(to bottom right, #EAABF0, #6848ff)",
		padding: "1rem",
		// "&:hover": {
		// 	backgroundColor: "transparent",
		// },
	},
	orgSelector: {
		top: "51px !important",
		right: "65px !important",
		maxHeight: "80vh",
		overflowY: "scroll",
	},
}));


// Main component to render LeftDrawer
const LeftDrawer = ({ isOpened, toggleLeftNav, navOptions, setShowStartTutorial }) => {
	const { isMobile } = useResponsiveContext();
	const classes = useStyles2();


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
								margin: "0.5rem"
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

			{/* Guided Tour BTN  */}
			<Box display="flex" justifyContent="center" sx={{ margin: "0.8rem 0" }}>
				{!isMobile && isOpened ? (
					<Button
						variant="outlined"
						onClick={() => setShowStartTutorial(true)}
						sx={{ width: "60%" }}
					>
						<Typography variant="h6">Guided Tour</Typography>
					</Button>
				) : null}
			</Box>

			{/* Select ORG  */}
			{isOpened && !isMobile ? <Box display="flex" justifyContent="center" sx={{ marginTop: "5rem" }}>

				<Tooltip title="View Orgs">
					<Button
						variant="text"
						disableFocusRipple
						disableTouchRipple
						classes={{
							root: classes.orgBtn,
						}}
						endIcon={<KeyboardArrowDown />}

					// onClick={handleOpenOrgMenu}
					>
						<Typography
							variant="h5"
							component="div"
							className={classes.orgName}
						>
							Select Org
						</Typography>
					</Button>
				</Tooltip>

			</Box> : null}
			{/*  */}
			{isOpened && !isMobile ? (
				<Box
					sx={{
						marginTop: "2rem",
						display: "flex",
						justifyContent: "center",
						width: "100%" // Ensure it takes full width of the container
					}}
				>
					<Grid
						container
						sx={{
							// border: "2px solid black", 
							padding: "0.5rem", 
							borderRadius: "8px", 
							width: "60%",
							maxWidth: "600px", 
							boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
						}}
						justifyContent="center"
						alignItems="center" // Center items vertically
					>
						<Grid item xs={4} sx={{marginRight:"1rem"}} display="flex" alignItems="center" justifyContent="center">
							<Avatar sx={{ bgcolor: "#FFA7C6" }}>
								<PersonIcon/>
							</Avatar>
						</Grid>
						<Grid item xs={4} display="flex" alignItems="center" justifyContent="flex-end">
							<Typography
								variant="h5"
								sx={{
									fontWeight: "600",
									fontSize: "1.25rem", 
									color: "#333",
								}}
							>
								Ritika
							</Typography>
						</Grid>
					</Grid>
				</Box>
			) : null}

			{/*  */}
		</Drawer>
	);
};

export default withErrorBoundary(LeftDrawer, "LeftDrawer"); // Wrap with error boundary
