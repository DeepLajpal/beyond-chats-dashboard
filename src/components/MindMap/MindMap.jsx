import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import HistoryIcon from "@mui/icons-material/History";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PaginationItem from "@mui/material/PaginationItem";
import makeStyles from "@mui/styles/makeStyles";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { alpha, Chip, Divider, InputBase, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2/dist/sweetalert2";
import { useMediaQuery, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useOrgContext } from "context/OrgContext";
import { useApiCall } from "components/common/appHooks.js";
import { usePlanContext } from "context/PlanContext";
import InboxIcon from "@mui/icons-material/Inbox";
import {
	PLANS_LIMIT_REACHED,
	PLAN_UNLIMITED,
} from "components/common/constants";
import { useUserContext } from "context/UserContext";
import { DialogLoader, SmallLoader } from "components/common/NewLoader";
import { fromUnixTime } from "date-fns";
import ReadMoreLess from "components/common/ReadMoreLess";
import mindMapData from "staticData/mindmap.json"
import Grid from '@mui/material/Grid';
import styled from '@mui/system/styled';
import { red } from "react-color/lib/helpers/color";
import SearchIcon from '@mui/icons-material/Search';
import MobileBottomNav from "components/Navbar/MobileBottomNav";
import ResponsiveAppBar from "components/Navbar/ResponsiveAppBar";

const VectorData = lazy(() => import("./VectorData"));
const CustomNoRowsOverlay = lazy(
	() => import("components/common/CustomNoRowsOverlay")
);
const GroundTruthDialog = lazy(() => import("./GroundTruth/GroundTruthDialog"));
const BucketsDialog = lazy(() => import("./Buckets/BucketsDialog"));
const ViewTrainingStatusDialog = lazy(
	() => import("./ViewTrainingStatusDialog")
);
const AddDataDialog = lazy(() => import("./AddDataDialog"));
const EditDataDialog = lazy(() => import("./EditDataDialog"));

const useStyles = makeStyles((theme) => ({
	table: {
		maxWidth: 1600,
		// "& .MuiTableCell-root": {
		// 	padding: "14px",
		// },
		"& thead th": {
			position: "sticky",
			top: 0,
			color: "var(--white)",
			backgroundColor: "var(--primary)",
			fontWeight: "bold",
		},
		"& tbody tr:nth-child(even)": {
			backgroundColor: " #2872FA14",
			color: "var(--color5)",
		},
	},
	loading: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100px",
	},
	titleContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		margin: "16px auto",
		maxWidth: 1200,
	},
	pagination: {
		margin: "10px auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	tableRow: {
		whiteSpace: "break-spaces",
	},
	action_box: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexWrap: "wrap",
		gap: "0.5rem",
		marginBottom: "0.5rem",
	},
	search_container: {
		display: "flex",
		justifyContent: "center",
	},
}));

const Item = styled('div')(({ theme }) => ({
	backgroundColor: '#fff',
	border: '1px solid',
	borderColor: '#ced7e0',
	padding: theme.spacing(1),
	borderRadius: '4px',
	textAlign: 'center',
	...theme.applyStyles('dark', {
		backgroundColor: '#1A2027',
		borderColor: '#444d58',
	}),
}));

const MindMap = () => {
	const { Post, Get } = useApiCall();
	const classes = useStyles();
	const {
		user: { is_god },
	} = useUserContext();
	const { org } = useOrgContext();
	const { plan } = usePlanContext();
	const theme = useTheme();
	const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const [data, setData] = useState([]);

	const [openGroundTruthDialog, setOpenGroundTruthDialog] = useState(false);
	const [openBucketsDialog, setOpenBucketsDialog] = useState(false);

	const location = useLocation();
	const { search } = location;
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const page = Number(query.get("page")) || 1;
	const sortBy = Number(query.get("sort_by")) || undefined;
	const order = Number(query.get("order")) || undefined;

	const [count, setCount] = useState(0);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [hasSearched, setHasSearched] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset: resetForm,
	} = useForm({
		defaultValues: {
			q: "",
			numResults: 3,
		},
	});

	// Edit Dialog
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState(null);

	// Add Dialog
	const [openAddDialog, setOpenAddDialog] = useState(false);
	// Tasks
	const [openTasksDialog, setOpenTasksDialog] = useState(false);
	const fetchData = async ({ per_page = 10 } = {}) => {
		try {
			setLoading(true);
			// const response = await Get(1, "view_vectors", {
			// 	page,
			// 	per_page,
			// 	sortBy: sortBy || undefined,
			// 	order: order || undefined,
			// });
			setData(mindMapData[page].data.data);
			setTotal(mindMapData[page].data.total);
			setCount(mindMapData[page].data.last_page);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
		}
	};

	async function clearResults() {
		setHasSearched(false);
		resetForm(undefined, { keepDefaultValues: true });
		fetchData();
	}

	async function handleOpenGroundTruthDialog() {
		setOpenGroundTruthDialog(true);
	}
	async function handleOpenBucketsDialog() {
		setOpenBucketsDialog(true);
	}
	async function searchVectors({ q, numResults }) {
		try {
			setLoading(true);
			const response = await Post(1, "search_vectors", {
				q,
				num_results: numResults,
			});
			setData(response.data.data);
			setHasSearched(true);
			setCount(1);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}

	// TODO: disabled from backend
	// const handleSort = useCallback((column) => {
	// 	setData([]);
	// 	const searchParams = new URLSearchParams(search);
	// 	switch (searchParams.get("order")) {
	// 		case "desc":
	// 			searchParams.set("order", "asc");
	// 			break;
	// 		case "asc":
	// 			searchParams.delete("order");
	// 			break;
	// 		default:
	// 			searchParams.set("order", "desc");
	// 			break;
	// 	}
	// 	searchParams.set("page", 1);
	// 	searchParams.set("sort_by", column);
	// 	history.push({ search: searchParams.toString() });
	// }, []);

	const columns = useMemo(
		() => [
			{
				field: "data",
				headerName: "Data",
				headerClassName: 'custom-header',
				align: "left",
				headerAlign: "left",
				flex: 1,
				filterable: false,
				renderCell: (params) => (
					<Box sx={{ py: 2, px: 1 }}>
						<ReadMoreLess height={50}>
							{params.row.metadata.text}
							{params.row.metadata.read_more_link ? (
								<>
									{" "}
									<a
										style={{ textDecoration: "underline" }}
										target="_blank"
										href={params.row.metadata.read_more_link}
										rel="noreferrer"
									>
										{params.row.metadata?.read_more_label || "Read More"}
									</a>
								</>
							) : (
								""
							)}
						</ReadMoreLess>
					</Box>
				),
			},
			{
				field: "source",
				headerName: "Source",
				headerClassName: 'custom-header',
				align: "center",
				headerAlign: "center",
				filterable: false,
				renderCell: (params) => {
					try {
						new URL(params.row.metadata.source_url);
						return (
							<Typography
								variant="subtitle2"
								component="a"
								href={params.row.metadata.source_url}
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: "underline" }}
							>
								Open Link
							</Typography>
						);
					} catch (error) {
						return <Typography variant="subtitle2">--</Typography>;
					}
				},
			},
			...(hasSearched
				? [
					{
						field: "score",
						headerName: "Score",
						align: "center",
						headerAlign: "center",
						filterable: true,
						renderCell: (params) => (
							<Typography variant="subtitle2">{params.row.score}</Typography>
						),
					},
				]
				: []),
			{
				field: "type",
				headerName: "Type",
				headerClassName: 'custom-header',
				align: "center",
				headerAlign: "center",
				filterable: true,
				renderCell: (params) => (
					// TODO: Add color for diffrent types
					<Chip
						label={params.row.metadata.source_type}
						variant="outlined"
						color="primary"
						size="small"
					/>
				),
			},
			{
				field: "created_at",
				headerName: "Created At",
				headerClassName: 'custom-header',
				align: "center",
				headerAlign: "center",
				filterable: true,
				renderCell: (params) => (
					<Typography variant="subtitle2" >
						{fromUnixTime(
							params.row?.metadata?.created_at
						).toLocaleDateString()}
					</Typography>
				),
			},
			// {
			// 	id: "read_more_link",
			// 	label: "Link",
			// },
			// {
			// 	id: "updated_at",
			// 	label: "Updated At",
			// },
			// { id: "read_more_link", label: "Link" },
			// { id: "updated_at", label: "Updated At" }
			{
				field: "actions",
				headerName: "Actions",
				headerClassName: 'custom-header',
				align: "center",
				headerAlign: "center",
				filterable: false,
				renderCell: (params) => (
					<>
						<IconButton
							color="primary"
							onClick={() => handleOpenEditDialog(params.row)}
						>
							<EditIcon />
						</IconButton>
						<IconButton
							color="secondary"
							onClick={() => handleDelete(params.row.vector_id)}
						>
							<DeleteIcon />
						</IconButton>
					</>
				),
			},
		],
		[hasSearched]
	);

	const handleOpenEditDialog = async (data) => {
		setEditData(data);
		// setEditDescription(description);
		setOpenEditDialog(true);
	};

	const handleCloseEditDialog = async () => {
		setOpenEditDialog(false);
		setEditData(null);
	};
	async function handleDelete(id) {
		try {
			const result = await Swal.fire({
				title: "Confirmation",
				text: "Are you sure you want to delete this data?",
				icon: "warning",
				showCancelButton: true,
			});

			if (result.isConfirmed) {
				// Call your delete API endpoint with the necessary parameters
				await Post(1, "delete_vector", { vector_id: id });

				// Update the originally mapped data
				setData((prevData) => prevData.filter((item) => item.vector_id !== id));

				toast.success("Data has been deleted");
			}
		} catch (error) {
			console.error("Error deleting data:", error);
			toast.error("Failed to delete data.");
		}
	}

	const handleOpenAddDialog = async () => {
		if (plan.training !== PLAN_UNLIMITED && total >= plan.training && !is_god) {
			return toast.info(PLANS_LIMIT_REACHED);
		}
		setOpenAddDialog(true);
	};
	const handleOpenTasksDialog = async () => {
		setOpenTasksDialog(true);
	};

	useEffect(() => {
		setData([]);
		// setCount(0);
		fetchData();
		// return addBeyondChat();
	}, [org.host_url, page, order, sortBy]);
	const getRowId = (row) => row.vector_id; // Assuming vector_id is the unique identifier for each row

	// Search styling 
	const Search = styled('div')(({ theme }) => ({
		position: 'relative',
		borderRadius: "0.5rem",
		backgroundColor: "#F7F9FE",
		'&:hover': {
			backgroundColor: "#F7F9FE",
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	}));

	const SearchIconWrapper = styled('div')(({ theme }) => ({
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}));

	const StyledInputBase = styled(InputBase)(({ theme }) => ({
		color: 'inherit',
		'& .MuiInputBase-input': {
			padding: theme.spacing(1, 1, 1, 0),
			// vertical padding + font size from searchIcon
			paddingLeft: `calc(1em + ${theme.spacing(4)})`,
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('md')]: {
				width: '20ch',
			},
		},
	}));

	return (
		<>

			<div className={classes.titleContainer} >
				{/* <Box className={classes.action_box}>
					<Button
						variant="contained"
						color="primary"
						startIcon={<AddIcon />}
						onClick={handleOpenAddDialog}
					>
						<Typography variant="h6" component="span" align="center">
							Add Data
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<HistoryIcon />}
						onClick={handleOpenTasksDialog}
					>
						<Typography variant="h6" component="span" align="center">
							Data Training Status
						</Typography>
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						startIcon={<QuestionAnswerIcon />}
						onClick={handleOpenGroundTruthDialog}
					>
						<Typography variant="h6" component="span" align="center">
							Ground Truths
						</Typography>
					</Button>
					{is_god ? (
						<Button
							variant="outlined"
							startIcon={<InboxIcon />}
							onClick={handleOpenBucketsDialog}
						>
							<Typography variant="h6" component="span" align="center">
								Buckets
							</Typography>
						</Button>
					) : null}
				</Box> */}

				{/* Line Divider */}
				{/* <hr
					style={{
						width: "80%",
						margin: "10px 0",
						border: "0.01rem solid grey",
					}}
				/> */}
				{/* <form
					onSubmit={handleSubmit(searchVectors)}
					className={classes.search_container}
				>
					<TextField
						label="Search"
						variant="outlined"
						error={errors?.q?.type}
						helperText={errors?.q?.message}
						sx={{ mt: 1 }}
						size="small"
						{...register("q", {
							required: "Required",
						})}
					/>
					<TextField
						select
						label="Results"
            defaultValue={3}
            sx={{ m: 1, minWidth: 120 }}
            size="small"
						{...register("numResults")}
					>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50].map((value) => (
							<MenuItem key={value} value={value}>
								{value}
							</MenuItem>
						))}
					</TextField>

					<Button type="submit" variant="contained" sx={{ m: 1 }}>
						Search
					</Button>
					{hasSearched ? (
						<Button
							color="secondary"
							variant="outlined"
							sx={{ my: 1 }}
							onClick={clearResults}
						>
							Clear Results
						</Button>
					) : null}
				</form> */}


				<Box sx={{ width: isSmScreen ? "100vw" : null }}>
					{isSmScreen ? <ResponsiveAppBar /> : null}
					{!isSmScreen ? <Grid container spacing={2} mb={2} alignItems="center">
						<Grid item xs={2}>
							<Typography variant="h4" component="span">
								Hello Ritika 👋🏼,
							</Typography>
						</Grid>
						<Grid item xs={10}>
							<Typography variant="subtitle2" component="subtitle2" sx={{ color: "#8A8A8A" }} >
								This is the brain and the memory of the chatbot. You can add, edit and analyse , the source data being used to answer user queries from here.
							</Typography>
						</Grid>
					</Grid> : null}

					<Box
						sx={{
							padding: "2rem",
							borderRadius: "1rem",
							boxShadow: "0 0 9px 0px #eaeaea",
							position: "relative",
							zIndex: isSmScreen ? "100" : "0",
							backgroundColor: "white",
							width: isSmScreen ? "92vw" : "inherit",
							margin: isSmScreen ? "auto" : "0",
							height: isSmScreen ? "auto" : "inherit",
							marginTop: isSmScreen ? "4rem" : "0",
						}}
					>
						<Grid container alignItems="center" justifyContent="space-between" spacing={2}>
							{/* Add Data Button */}
							<Grid item xs={3} display="flex" justifyContent="center">
								<Grid container alignItems="center" spacing={1} justifyContent="center">
									<Grid item>
										<Button
											sx={{
												backgroundColor: "#D3FFE7",
												borderRadius: "50%",
												minWidth: "56px",
												height: "56px",
												"&:hover": {
													backgroundColor: "rgba(144, 238, 144, 0.8)",
												},
											}}
											onClick={handleOpenAddDialog}
										>
											<AddIcon sx={{ color: "#00AC4F", fontSize: "24px" }} />
										</Button>
									</Grid>
									<Grid item>
										<Typography
											variant="h6"
											component="span"
											align="center"
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											Add Data
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							{/* Vertical Divider */}
							<Grid item>
								<Divider
									orientation="vertical"
									flexItem
									sx={{
										borderColor: "lightgray",
										height: "56px",
										alignSelf: "center",
									}}
								/>
							</Grid>

							{/* Data Training Status Button */}
							<Grid item xs={4} display="flex" justifyContent="center">
								<Grid container alignItems="center" spacing={1} justifyContent="center">
									<Grid item>
										<Button
											sx={{
												backgroundColor: "#FFA7C6",
												borderRadius: "50%",
												minWidth: "56px",
												height: "56px",
												"&:hover": {
													backgroundColor: "#FFA7C6",
												},
											}}
											onClick={handleOpenTasksDialog}
										>
											<HistoryIcon sx={{ color: "#FA2871", fontSize: "24px" }} />
										</Button>
									</Grid>
									<Grid item>
										<Typography
											variant="h6"
											component="span"
											align="center"
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											Data Training Status
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							{/* Vertical Divider */}
							<Grid item>
								<Divider
									orientation="vertical"
									flexItem
									sx={{
										borderColor: "lightgray",
										height: "56px",
										alignSelf: "center",
									}}
								/>
							</Grid>

							{/* Ground Truths Button */}
							<Grid item xs={3} display="flex" justifyContent="center">
								<Grid container alignItems="center" spacing={1} justifyContent="center">
									<Grid item>
										<Button
											sx={{
												backgroundColor: "#FFA7C6",
												borderRadius: "50%",
												minWidth: "56px",
												height: "56px",
												"&:hover": {
													backgroundColor: "#FFA7C6",
												},
											}}
											onClick={handleOpenGroundTruthDialog}
										>
											<QuestionAnswerIcon sx={{ color: "#FA2871", fontSize: "24px" }} />
										</Button>
									</Grid>
									<Grid item>
										<Typography
											variant="h6"
											component="span"
											align="center"
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											Ground Truths
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Box>



					{/* Table Container Box */}
					<Box sx={{ padding: "10px", padding: "2rem", borderRadius: "1rem", height: "100%", boxShadow: "0 0 9px 0px #eaeaea", marginTop: "2rem", marginBottom: isSmScreen ? "4rem" : "0" }} >
						<Box sx={{ padding: "0.5rem", marginBottom: "0.5rem" }}>
							<Grid container alignItems="center" spacing={2} justifyContent="center" >
								<Grid item xs={6} display="flex" ><Typography variant="h4" sx={{ fontWeight: "bold" }}>All Active Data</Typography> </Grid>

								<Grid item xs={6} display="flex" justifyContent="flex-end" alignItems="center">
									<form
										onSubmit={handleSubmit(searchVectors)}
										className={classes.search_container}
									>
										<Search>
											<SearchIconWrapper>
												<SearchIcon />
											</SearchIconWrapper>
											<StyledInputBase
												placeholder="Search…"
												inputProps={{ 'aria-label': 'search' }}
												{...register("q", {
													required: "Required",
												})}
											/>
										</Search>
									</form>
								</Grid>
							</Grid>
						</Box>
						{isSmScreen ? (
							loading ? (
								<SmallLoader />
							) : (
								<Suspense fallback={<SmallLoader />}>
									<Box >
										{data.map((item) => (
											<VectorData
												key={item.vector_id}
												data={item}
												handleOpenEditDialog={handleOpenEditDialog}
												handleDelete={handleDelete}
											/>
										))}
									</Box>
								</Suspense>
							)
						) : (
							<Box sx={{ width: "100%", minWidth: "960px" }}>
								<DataGrid
									rows={data}
									columns={columns}
									loading={loading}
									autoHeight
									getRowId={getRowId}
									slots={{
										noRowsOverlay: CustomNoRowsOverlay,
									}}
									slotProps={{
										noRowsOverlay: {
											title:
												"Looks like you have not added any data, click on the Add Data Button above",
										},
										loadingOverlay: {
											title: "Loading...",
										},
									}}
									disableSelectionOnClick
									disableRowSelectionOnClick
									hideFooter
									getRowHeight={() => "auto"}
									sx={{
										border: "none",
										"& .custom-header": { // Target the custom header class
											color: "#8A8A8A", // Change the header color
										},
									}}
								/>
							</Box>
						)}

						<Stack spacing={2} alignItems="center" my={1}>
							<Pagination
								page={page}
								count={count}
								sx={{ m: "10px auto" }}
								color="primary"
								renderItem={(item) => {
									const searchParams = new URLSearchParams(location.search);
									searchParams.set("page", item.page);
									return (
										<PaginationItem
											component={Link}
											to={`${location.pathname}?${searchParams.toString()}`}
											{...item}
										/>
									);
								}}
							/>
						</Stack>
					</Box>


				</Box>
			</div>


			<Suspense fallback={<></>}>
				<AddDataDialog {...{ openAddDialog, setData, setOpenAddDialog }} />
			</Suspense>
			<Suspense fallback={<></>}>
				<ViewTrainingStatusDialog
					{...{ openTasksDialog, setOpenTasksDialog }}
				/>
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openEditDialog && editData ? (
					<EditDataDialog
						{...{
							editData,
							setData,
							openEditDialog,
							setOpenEditDialog,
							handleCloseEditDialog,
						}}
					/>
				) : null}
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openGroundTruthDialog ? (
					<GroundTruthDialog
						{...{
							openGroundTruthDialog,
							setOpenGroundTruthDialog,
						}}
					/>
				) : null}
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openBucketsDialog ? (
					<BucketsDialog
						{...{
							openBucketsDialog,
							setOpenBucketsDialog,
						}}
					/>
				) : null}
			</Suspense>

		</>
	);
};

export default withErrorBoundary(MindMap, "MindMap");
