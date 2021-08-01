import { isAuthenticated } from "../../auth/helper";
import { API } from "../../backend";

export const getTodos = () => async dispatch => {
	dispatch({ type: "TODOS_PENDING" });
	try {
		const response = await fetch(
			`${API}/user/${isAuthenticated().user.username}/todos`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${isAuthenticated().token}`,
				},
			}
		);
		const todos = await response.json();
		dispatch({
			type: "TODOS_SUCCESS",
			payload: todos,
		});
	} catch (error) {
		console.log("Failed to get todoos.");
		dispatch({ type: "TODOS_FAILURE" });
	}
};

export const addTodo = title => async dispatch => {
	dispatch({ type: "ADD_TODO_PENDING" });

	if (title === "") {
		dispatch({ type: "ADD_TODO_FAILURE" });
		return;
	}

	try {
		const response = await fetch(
			`${API}/user/${isAuthenticated().user.username}/add/todo`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${isAuthenticated().token}`,
				},
				body: JSON.stringify({ title }),
			}
		);
		const todo = await response.json();
		dispatch({ type: "ADD_TODO_SUCCESS", payload: todo });
	} catch (error) {
		console.log("Failed to add todo.");
		dispatch({ type: "ADD_TODO_FAILURE" });
	}
};

export const clearTodoMessages = () => ({ type: "CLEAR_SUCCESS_MESSAGE" });

export const deleteTodo = id => dispatch => {
	dispatch({
		type: "DELETE_TODO",
		payload: { id },
	});
	fetch(`${API}/user/${isAuthenticated().user.username}/delete/todo/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${isAuthenticated().token}`,
		},
	}).catch(console.log);
};

export const updateTodo = id => dispatch => {
	dispatch({
		type: "UPDATE_TODO",
		payload: { id },
	});
	fetch(`${API}/user/${isAuthenticated().user.username}/update/todo/${id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${isAuthenticated().token}`,
		},
	});
};
