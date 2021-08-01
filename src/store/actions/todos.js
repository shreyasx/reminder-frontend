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
		dispatch({ type: "TODOS_FAILURE", payload: error });
	}
};

export const addTodo = title => async dispatch => {
	dispatch({ type: "ADD_TODO_PENDING" });
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
		dispatch({ type: "ADD_TODO_FAILURE", payload: error });
	}
};

export const deleteTodo = id => ({
	type: "DELETE_TODO",
	payload: { id },
});
