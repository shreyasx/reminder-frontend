import { isAuthenticated } from "../../auth/helper";
import { API } from "../../backend";

export const getReminders = () => async dispatch => {
	dispatch({ type: "REMINDERS_PENDING" });
	try {
		const response = await fetch(
			`${API}/user/${isAuthenticated().user.username}/reminders`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${isAuthenticated().token}`,
				},
			}
		);
		const reminders = await response.json();
		dispatch({
			type: "REMINDERS_SUCCESS",
			payload: reminders.map(rem => {
				const { date, title, _id } = rem;
				const d = new Intl.DateTimeFormat("en-IN", {
					dateStyle: "long",
					timeStyle: "medium",
				}).format(new Date(date));
				return { date: d, title, _id, dateSeconds: Date.parse(date) };
			}),
		});
	} catch (error) {
		console.log("Failed to get reminders.");
		dispatch({ type: "REMINDERS_FAILURE" });
	}
};

export const addReminder = payload => async dispatch => {
	dispatch({ type: "ADD_REMINDER_PENDING" });

	const { title, user, date } = payload;
	if (title === "" || user === "" || date < Date.now() + 120000) {
		dispatch({ type: "ADD_REMINDER_FAILURE" });
		return;
	}
	try {
		const response = await fetch(
			`${API}/user/${isAuthenticated().user.username}/add/reminder`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${isAuthenticated().token}`,
				},
				body: JSON.stringify(payload),
			}
		);
		const reminder = await response.json();
		dispatch({ type: "ADD_REMINDER_SUCCESS", payload: format(reminder) });
	} catch (error) {
		console.log("Failed to add reminder.");
		dispatch({ type: "ADD_REMINDER_FAILURE" });
	}
};

export const deleteReminder = id => ({
	type: "DELETE_REMINDER",
	payload: { id },
});

export const clear = () => ({ type: "CLEAR_SUCCESS_MESSAGE" });

const format = reminder => {
	const { date, title, _id } = reminder;
	const d = new Intl.DateTimeFormat("en-IN", {
		dateStyle: "long",
		timeStyle: "medium",
	}).format(new Date(date));
	return { date: d, title, _id, dateSeconds: Date.parse(date) };
};
