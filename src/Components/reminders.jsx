import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { deleteReminder, addReminder } from "./homeHelper";
import Dustbin from "../images/dustbin.webp";
import RemindersTable from "./remTable";

const Reminders = () => {
	const [reminders, setReminders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

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
				resp === "Sent mail" ? setSuccess(true) : setError(true);
			})
			.catch(er => {
				setLoading(false);
				console.log(er);
			});
	};

	const getReminders = () => {
		fetch(`${API}/user/${isAuthenticated().user.username}/reminders`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(resp => {
				setReminders(
					resp.map(rem => {
						const { date, title, _id } = rem;
						const d = new Intl.DateTimeFormat("en-IN", {
							dateStyle: "long",
							timeStyle: "medium",
						}).format(new Date(date));
						return { date: d, title, _id, dateSeconds: Date.parse(date) };
					})
				);
				setLoading(false);
			})
			.catch(console.log);
	};

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

	const errorMessage = () =>
		error && <p style={{ color: "red" }}>{`Invalid data entered.`}</p>;

	const successMessage = () =>
		success && (
			<p
				style={{ color: "green" }}
			>{`Sent a mail to the email address you provided. Check your mail!`}</p>
		);

	useEffect(() => {
		getReminders();
		isVerified();
		console.log(reminders);
	}, []);

	return (
		<>
			{errorMessage()}
			{successMessage()}
			{loading ? (
				<h3>Loading..</h3>
			) : reminders.length === 0 ? (
				<h5>List empty!</h5>
			) : (
				<RemindersTable reminders={reminders} />
			)}
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
			</div>
			<br />
			{loading ? (
				""
			) : verified ? (
				<button
					onClick={() => {
						setError(false);
						setLoading(true);
						addReminder(getReminders, () => {
							setError(true);
							setLoading(false);
						});
					}}
				>
					Add reminder
				</button>
			) : (
				<button style={{ color: "red" }} onClick={verify}>
					Verify email to set reminder
				</button>
			)}
		</>
	);
};

export default Reminders;
