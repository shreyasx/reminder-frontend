import React from "react";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { addReminder } from "./homeHelper";
import { Grid, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";

const AddReminder = () => {
	const [loading, setLoading] = React.useState(true);
	const [verified, setVerified] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [title, setTitle] = React.useState("");
	const [selectedDate, setSelectedDate] = React.useState(new Date());

	const isVerified = () => {
		fetch(`${API}/user/${isAuthenticated().user.username}/isVerified`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(resp => {
				setVerified(resp);
				setLoading(false);
			})
			.catch(console.log);
	};

	React.useEffect(isVerified, []);
	const classes = useStyles();
	const handleDateChange = date => setSelectedDate(date);

	const errorMessage = () =>
		error && <p style={{ color: "red" }}>{`Invalid data entered.`}</p>;

	const successMessage = () =>
		success && (
			<p
				style={{ color: "green" }}
			>{`Sent a mail to the email address you provided. Check your mail!`}</p>
		);

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
				setLoading(false);
				if (resp === "Sent mail") setSuccess(true);
			})
			.catch(er => {
				setLoading(false);
				console.log(er);
			});
	};

	return (
		<>
			{errorMessage()}
			{successMessage()}
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
				{verified ? (
					<Button
						style={{ marginTop: "20px" }}
						className={classes.buttons}
						color="primary"
						variant="contained"
						onClick={() => {
							setError(false);
							setLoading(true);
							addReminder(
								{ dateTime: Date.parse(selectedDate), title },
								() => setLoading(false),
								() => {
									setError(true);
									setLoading(false);
								}
							);
						}}
						disabled={loading}
					>
						add reminder
					</Button>
				) : (
					<Button
						variant="contained"
						style={{ marginTop: "20px" }}
						onClick={verify}
						color="secondary"
					>
						Verify email to set reminder
					</Button>
				)}
			</div>
		</>
	);
};

export default AddReminder;
