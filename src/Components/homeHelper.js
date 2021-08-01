import { API } from "../backend";
import { isAuthenticated } from "../auth/helper";

const deleteReminderAPIcall = id => {
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
	);
};

const deleteTodoAPIcall = id => {
	fetch(`${API}/user/${isAuthenticated().user.username}/delete/todo/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${isAuthenticated().token}`,
		},
	}).catch(console.log);
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

export { deleteTodoAPIcall, deleteReminderAPIcall, updateTodo };
