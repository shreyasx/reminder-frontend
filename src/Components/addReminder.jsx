import React from "react";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { addReminder } from "./homeHelper";

const AddReminder = () => {
	const [loading, setLoading] = React.useState(true);
	const [verified, setVerified] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

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
			.then(setVerified)
			.catch(console.log);
	};

	React.useEffect(isVerified, []);

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
			<div
				style={
					verified
						? {}
						: {
								filter: "blur(1.5px)",
								pointerEvents: "none",
						  }
				}
				id="blur"
			>
				<h4>Add Reminder:</h4>
				<label className={`label2`} htmlFor="title">
					Title:
				</label>
				<input type="text" id="title" />
				<br />
				<label className={`label2`} htmlFor="date">
					Date:
				</label>
				<input type="date" id="date" />
				<br />
				<label className={`label2`} htmlFor="time">
					Time:
				</label>
				<input type="time" id="time" />
				<br />
				{loading ? (
					""
				) : verified ? (
					<button
						onClick={() => {
							setError(false);
							setLoading(true);
							addReminder(
								() => {
									setSuccess(true);
									setLoading(false);
								},
								() => {
									setError(true);
									setLoading(false);
								}
							);
						}}
					>
						Add reminder
					</button>
				) : (
					<button style={{ color: "red" }} onClick={verify}>
						Verify email to set reminder
					</button>
				)}
			</div>
		</>
	);
};

export default AddReminder;
