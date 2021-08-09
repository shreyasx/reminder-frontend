const initialState = {
	serviceWorkerInitialized: false,
	serviceWorkerUpdated: false,
	serviceWorkerRegistration: null,
};

export const sw = (state = initialState, action = {}) => {
	switch (action.type) {
		case "SW_INIT":
			return { ...state, serviceWorkerInitialized: true };
		case "SW_UPDATE":
			return { ...state, serviceWorkerRegistration: action.payload };
		default:
			return state;
	}
};
