import React from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { connect } from "react-redux";
import { deleteReminder } from "../store/actions/reminders";
import {
	Switch,
	FormControlLabel,
	Paper,
	Typography,
	TableSortLabel,
	TableRow,
	TablePagination,
	TableHead,
	Table,
	TableBody,
	TableContainer,
	TableCell,
} from "@material-ui/core";

const mapStateToProps = state => ({
	reminders: state.reminders,
});

const mapDispatchToProps = dispatch => ({
	deleteReminder: id => dispatch(deleteReminder(id)),
});

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

const headCells = [
	{ id: "title", label: "Title" },
	{ id: "date", label: "Date" },
	{ id: "delete", label: "Delete" },
];

function EnhancedTableHead(props) {
	const { classes, order, orderBy, onRequestSort } = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map(headCell => (
					<TableCell
						key={headCell.id}
						align={`center`}
						padding={"normal"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						{headCell.id === "delete" ? (
							<div>{headCell.label}</div>
						) : (
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : "asc"}
								onClick={createSortHandler(headCell.id)}
							>
								{headCell.label}
								{orderBy === headCell.id ? (
									<span className={classes.visuallyHidden}>
										{order === "desc"
											? "sorted descending"
											: "sorted ascending"}
									</span>
								) : null}
							</TableSortLabel>
						)}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
	root: { paddingLeft: theme.spacing(2), paddingRight: theme.spacing(1) },
	highlight:
		theme.palette.type === "light"
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark,
			  },
	title: { padding: 10, flex: "1 1 100%" },
}));

const EnhancedTableToolbar = () => {
	const classes = useToolbarStyles();

	return (
		<Typography
			className={classes.title}
			variant="h4"
			id="tableTitle"
			component="div"
		>
			Reminders
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	root: { width: "100%" },
	paper: {
		maxWidth: 1000,
		margin: "0 auto",
		marginBottom: theme.spacing(2),
	},
	table: { width: "100%", minWidth: 500 },
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
}));

const Reminders = props => {
	const classes = useStyles();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("title");
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = event => {
		setDense(event.target.checked);
	};

	const emptyRows =
		rowsPerPage -
		Math.min(
			rowsPerPage,
			props.reminders.reminders.length - page * rowsPerPage
		);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar numSelected={0} />
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={dense ? "small" : "medium"}
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={0}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={props.reminders.reminders.length}
						/>
						<TableBody>
							{stableSort(
								props.reminders.reminders,
								getComparator(order, orderBy)
							)
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const labelId = `th-${index}`;

									return (
										<TableRow hover tabIndex={-1} key={index} selected={false}>
											<TableCell
												component="th"
												align="center"
												id={labelId}
												scope="row"
												padding="normal"
											>
												{row.title}
											</TableCell>
											<TableCell align="center">{row.date}</TableCell>
											<TableCell align="center">
												<div
													style={{ cursor: "pointer" }}
													onClick={() => props.deleteReminder(row._id)}
												>
													<DeleteForeverIcon />
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={props.reminders.reminders.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<FormControlLabel
				control={<Switch checked={dense} onChange={handleChangeDense} />}
				label="Dense padding"
			/>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Reminders);
