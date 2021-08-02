import React from "react";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { Grid, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { addReminder, clearReminderMessages } from "../store/actions/reminders";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";

const mapStateToProps = state => ({
	reminders: state.reminders,
});

const mapDispatchToProps = dispatch => ({
	addReminder: data => dispatch(addReminder(data)),
	clearSuccessMessage: () => dispatch(clearReminderMessages()),
});

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddReminder = props => {
	const [title, setTitle] = React.useState("");
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	const [error, setError] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [mailSent, setMailSent] = React.useState(false);

	React.useEffect(() => {
		const { success, error } = props.reminders;
		if (error !== "") {
			setError(true);
			setTimeout(() => {
				props.clearSuccessMessage();
			}, 3000);
		}
		if (success !== "") {
			setSuccess(true);
			setTimeout(() => {
				props.clearSuccessMessage();
			}, 3000);
		}
	}, [props]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") return;
		setError(false);
		setSuccess(false);
	};

	const classes = useStyles();
	const handleDateChange = date => setSelectedDate(date);

	const verify = () => {
		setLoading(true);
		fetch(`${API}/user/verify/${isAuthenticated().user.username}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(resp => {
				if (resp === "Sent mail") {
					setMailSent(true);
					setSuccess(true);
					setTimeout(() => {
						setMailSent(false);
						setSuccess(false);
					}, 3000);
				}
				setLoading(false);
			})
			.catch(er => {
				console.log(er);
			});
	};

	const handleAddReminder = () => {
		const data = {
			title,
			user: isAuthenticated().user.username,
			date: Date.parse(selectedDate),
		};
		props.addReminder(data);
	};

	return (
		<>
			<Snackbar open={error} autoHideDuration={2500} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error">
					{props.reminders.error}
				</Alert>
			</Snackbar>
			<Snackbar open={success} autoHideDuration={2500} onClose={handleClose}>
				<Alert onClose={handleClose} severity="success">
					{mailSent
						? "Verification link sent to your email address!"
						: props.reminders.success}
				</Alert>
			</Snackbar>
			<h4>Add Reminder:</h4>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<TextField
					className={classes.inputField}
					label="Title"
					onChange={event => setTitle(event.target.value)}
					placeholder="Pick up potatoes!"
					helperText="What do you wanna be reminded about?"
					variant="outlined"
					id="title"
				/>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Grid container justifyContent="space-evenly">
						<KeyboardDatePicker
							margin="normal"
							id="date-picker-dialog"
							label="Pick a date."
							value={selectedDate}
							format="dd/MM/yyyy"
							onChange={handleDateChange}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
						/>
						<KeyboardTimePicker
							margin="normal"
							id="time-picker"
							value={selectedDate}
							label="Pick a time."
							onChange={handleDateChange}
							KeyboardButtonProps={{
								"aria-label": "change time",
							}}
						/>
					</Grid>
				</MuiPickersUtilsProvider>
				{isAuthenticated().user.isVerified ? (
					<Button
						style={{ marginTop: "20px" }}
						className={classes.buttons}
						color="primary"
						variant="contained"
						onClick={handleAddReminder}
						disabled={props.reminders.loading}
					>
						add reminder
					</Button>
				) : (
					<Button
						variant="contained"
						style={{ marginTop: "20px" }}
						onClick={verify}
						color="secondary"
						disabled={loading}
					>
						Verify email to set reminder
					</Button>
				)}
			</div>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddReminder);
