import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	paper: { minHeight: 350, textAlign: "center" },
	inputField: { width: "75%", margin: "10px 0" },
	buttons: { marginBottom: 25 },
	intro: {
		padding: "25px 15%",
		fontWeight: 600,
		lineHeight: "1.3em",
	},
}));

export default useStyles;
