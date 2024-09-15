import React from "react";
import ReadMoreLess from "components/common/ReadMoreLess";
import { Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete, Edit } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between", // Space between elements
		alignItems: "stretch", // Stretch items to full width
		padding: "0.86rem",
		borderRadius: "5px",
		boxShadow: "0 0 0.15rem 0 rgba(224, 224, 224, 0.5)",
		outline: "0.1rem solid rgba(224, 224, 224, 0.5)",
		backgroundColor: "#fff",
		marginBottom: "1rem",
		width: "92vw",
		boxSizing: "border-box", // Include padding and border in width/height
	},
	source_type_container: {
		display: "flex",
		width: "100%",
		justifyContent: "flex-start",
		alignItems: "center",
		overflow: "hidden", // Hide overflow content
	},
	source_type: {
		fontSize: "0.6rem",
		color: "var(--color5)",
		fontWeight: "bold",
		textTransform: "uppercase",
		padding: "0.25rem 0.5rem",
		borderRadius: "0.5rem",
		backgroundColor: "#f5f5f5",
		whiteSpace: "nowrap", // Prevent text wrapping
		overflow: "hidden", // Hide overflow content
		textOverflow: "ellipsis", // Add ellipsis for overflowed text
	},
	footer_container: {
		display: "flex",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "0.7rem",
	},
	details_container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		gap: "0.25rem",
	},
	source_link: {
		color: "var(--color5)",
		textDecoration: "underline",
		overflow: "hidden", // Hide overflow content
		textOverflow: "ellipsis", // Add ellipsis for overflowed text
		whiteSpace: "nowrap", // Prevent text wrapping
	},
	actions_container: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
	},
}));

const VectorData = ({ data, handleOpenEditDialog, handleDelete }) => {
	const classes = useStyles();
	return (
		<Box className={classes.root} >
			<ReadMoreLess height={50}>{data?.metadata?.text}</ReadMoreLess>
			<Box className={classes.source_type_container}>
				<Typography
					variant="caption"
					color="textPrimary"
					className={classes.source_type}
				>
					{data?.metadata?.source_type ?? "Unknown Source"}
				</Typography>
			</Box>

			<Box className={classes.footer_container}>
				<Box className={classes.details_container}>
					<Typography variant="caption" color="textPrimary">
						<a
							href={data?.metadata?.source_url ?? "#"}
							target="_blank"
							rel="noreferrer"
							className={classes.source_link}
						>
							View Source
						</a>
					</Typography>
					<Typography variant="subtitle1" color="#FA2871">
						{(() => {
							const createdAt = new Date(data?.metadata?.created_at);
							const now = new Date();

							// Calculate the difference in milliseconds
							const differenceInMs = now - createdAt;

							// Convert milliseconds to days
							const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

							return new Intl.RelativeTimeFormat("en", {
								numeric: "auto",
							}).format(-differenceInDays, "day");
						})()}
					</Typography>
				</Box>

				<Box className={classes.actions_container}>
					<IconButton size="medium" onClick={() => handleOpenEditDialog(data)}>
						<Edit color="primary" fontSize="small" />
					</IconButton>
					<IconButton
						size="medium"
						onClick={() => handleDelete(data?.vector_id)}
					>
						<Delete color="error" fontSize="small" />
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
};

export default VectorData;
