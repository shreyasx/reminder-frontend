const initialState = { loading: true, error: "", success: "", todos: [] };

export const todos = (state = initialState, action = {}) => {
	switch (action.type) {
		case "TODOS_PENDING":
			return Object.assign({}, state, {
				loading: true,
				error: "",
				success: "",
			});

		case "TODOS_SUCCESS":
			return Object.assign({}, state, {
				todos: action.payload,
				loading: false,
				error: "",
				success: "",
			});

		case "TODOS_FAILURE":
			return Object.assign({}, state, {
				error: "Couldn't fetch your reminders.",
				loading: false,
				success: "",
			});

		case "ADD_TODO_PENDING":
			return Object.assign({}, state, {
				loading: true,
				error: "",
				success: "",
			});

		case "ADD_TODO_SUCCESS":
			return Object.assign({}, state, {
				loading: false,
				error: "",
				success: "Todo added successfully!",
				todos: [...state.todos, action.payload],
			});

		case "ADD_TODO_FAILURE":
			return Object.assign({}, state, {
				loading: false,
				error: "Please check your data!",
				success: "",
			});

		case "CLEAR_SUCCESS_MESSAGE":
			return Object.assign({}, state, { error: "", success: "" });

		case "DELETE_TODO":
			return Object.assign({}, state, {
				todos: [...state.todos.filter(todo => todo._id !== action.payload.id)],
			});

		case "UPDATE_TODO":
			return Object.assign({}, state, {
				todos: [
					...state.todos.map(todo => {
						if (todo._id === action.payload.id)
							todo.completed = !todo.completed;
						return todo;
					}),
				],
			});

		default:
			return state;
	}
};
