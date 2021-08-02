import { isAuthenticated } from "../../auth/helper";
import { API } from "../../backend";

export const isVerified = () => async dispatch => {
	dispatch({ type: "IS_VERIFIED_PENDING" });
	try {
		const resp = await fetch(
			`${API}/user/${isAuthenticated().user.username}/isVerified`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${isAuthenticated().token}`,
				},
			}
		);
		const verified = await resp.json();
		console.log(verified);
		dispatch({ type: "IS_VERIFIED_SUCCESS", payload: verified });
	} catch (error) {
		console.log(error);
		dispatch({ type: "IS_VERIFIED_FAILURE", payload: error });
	}
};
