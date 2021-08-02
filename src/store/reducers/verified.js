const initialState = { verified: false, loading: false };

export const isVerified = (state = initialState, action = {}) => {
	switch (action.type) {
		case "IS_VERIFIED_PENDING":
			return Object.assign({}, state, { loading: true });

		case "IS_VERIFIED_SUCCESS":
			return Object.assign({}, state, {
				loading: false,
				verified: action.payload,
			});

		case "IS_VERIFIED_FAILURE":
			return Object.assign({}, state, {
				loading: false,
				verified: false,
			});

		default:
			return state;
	}
};
