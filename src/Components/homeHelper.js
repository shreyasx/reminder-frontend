import { API } from "../backend";
import { isAuthenticated } from "../auth/helper";

const deleteReminder = (id, next) => {
	fetch(
		`${API}/user/${isAuthenticated().user.username}/delete/reminder/${id}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		}
	)
		.then(r => r.json())
		.then(re => {
			if (re === "done") next();
		})
		.catch(console.log);
};

const addReminder = (payload, next, error) => {
	const { dateTime, title } = payload;
	if (title === "" || dateTime < Date.now() + 120000) {
		error();
		return;
	}
	const data = {
		title,
		user: isAuthenticated().user.username,
		date: dateTime,
	};
	fetch(`${API}/user/${isAuthenticated().user.username}/add/reminder`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${isAuthenticated().token}`,
		},
		body: JSON.stringify(data),
	})
		.then(resp => next())
		.catch(er => {
			console.log(er);
			next();
		});
};

const addTodo = (title, next, error) => {
	if (title === "") {
		console.log("Error!");
		error();
		return;
	}
	fetch(`${API}/user/${isAuthenticated().user.username}/add/todo`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${isAuthenticated().token}`,
		},
		body: JSON.stringify({ title }),
	})
		.then(resp => next())
		.catch(er => {
			console.log(er);
			next();
		});
};

const deleteTodo = (id, next) => {
	fetch(`${API}/user/${isAuthenticated().user.username}/delete/todo/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${isAuthenticated().token}`,
		},
	})
		.then(r => next())
		.catch(er => {
			console.log(er);
			next();
		});
};

const updateTodo = (id, next) => {
	fetch(`${API}/user/${isAuthenticated().user.username}/update/todo/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${isAuthenticated().token}`,
		},
	})
		.then(r => next())
		.catch(er => {
			console.log(er);
			next();
		});
};

export { addReminder, addTodo, deleteTodo, deleteReminder, updateTodo };
