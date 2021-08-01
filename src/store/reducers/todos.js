const initialState = { loading: true, todos: [] };

export const todos = (state = initialState, action = {}) => {
	switch (action.type) {
		case "TODOS_PENDING":
			return Object.assign({}, state, { loading: true });

		case "TODOS_SUCCESS":
			return Object.assign({}, state, {
				todos: action.payload,
				loading: false,
			});

		case "TODOS_FAILURE":
			return Object.assign({}, state, {
				error: action.payload,
				loading: false,
			});

		case "ADD_TODO_PENDING":
			return Object.assign({}, state, { loading: true });

		case "ADD_TODO_SUCCESS":
			return Object.assign({}, state, {
				loading: false,
				todos: [...state.todos, action.payload],
			});

		case "ADD_TODO_FAILURE":
			return Object.assign({}, state, {
				error: action.payload,
				loading: false,
			});

		case "DELETE_TODO":
			return Object.assign({}, state, {
				todos: [...state.todos.filter(todo => todo._id !== action.payload.id)],
			});

		default:
			return state;
	}
};
