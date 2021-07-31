import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { deleteReminder } from "./homeHelper";
import { RemindersTable } from ".";

const Reminders = () => {
	const [reminders, setReminders] = useState([]);

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
			})
			.catch(console.log);
	};

	useEffect(getReminders, []);

	return (
		<RemindersTable
			deleteRem={id => deleteReminder(id, getReminders)}
			reminders={reminders}
		/>
	);
};

export default Reminders;
