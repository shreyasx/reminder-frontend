const initialState = { loading: true, error: "", success: "", reminders: [] };

export const reminders = (state = initialState, action = {}) => {
	switch (action.type) {
		case "REMINDERS_PENDING":
			return Object.assign({}, state, {
				loading: true,
				error: "",
				success: "",
			});

		case "REMINDERS_SUCCESS":
			return Object.assign({}, state, {
				reminders: action.payload,
				loading: false,
				error: "",
				success: "",
			});

		case "REMINDERS_FAILURE":
			return Object.assign({}, state, {
				error: action.payload,
				loading: false,
				success: "",
			});

		case "ADD_REMINDER_PENDING":
			return Object.assign({}, state, {
				loading: true,
				error: "",
				success: "",
			});

		case "ADD_REMINDER_SUCCESS":
			return Object.assign({}, state, {
				loading: false,
				reminders: [...state.reminders, action.payload],
				error: "",
				success: "Reminder added successfully!",
			});

		case "ADD_REMINDER_FAILURE":
			return Object.assign({}, state, {
				loading: false,
				error: "Please check your data!",
				success: "",
			});

		case "CLEAR_SUCCESS_MESSAGE":
			return Object.assign({}, state, { error: "", success: "" });

		case "DELETE_REMINDER":
			return Object.assign({}, state, {
				reminders: [
					...state.reminders.filter(
						reminder => reminder._id !== action.payload.id
					),
				],
				error: "",
				success: "",
			});

		default:
			return state;
	}
};
