import React, { useState } from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import {
	deleteTodo,
	addTodo,
	clearTodoMessages,
	updateTodo,
} from "../store/actions/todos";
import useStyles from "./styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {
	FormControlLabel,
	TextField,
	Button,
	Checkbox,
} from "@material-ui/core";

const mapStateToProps = state => ({
	todos: state.todos,
});

const mapDispatchToProps = dispatch => ({
	clearSuccessMessage: () => dispatch(clearTodoMessages()),
	addTodo: title => dispatch(addTodo(title)),
	deleteTodo: id => dispatch(deleteTodo(id)),
	updateTodo: id => dispatch(updateTodo(id)),
});

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Todos = props => {
	const [title, setTitle] = useState("");
	const [error, setError] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const classes = useStyles();

	React.useEffect(() => {
		const { success, error } = props.todos;
		if (error !== "") {
			setError(true);
			setTimeout(() => {
				props.clearSuccessMessage();
			}, 3000);
		}
		if (success !== "") {
			setSuccess(true);
			setTimeout(() => {
				props.clearSuccessMessage();
			}, 3000);
		}
	}, [props]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") return;
		setError(false);
		setSuccess(false);
	};

	return (
		<>
			<Snackbar open={error} autoHideDuration={2500} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error">
					{props.todos.error}
				</Alert>
			</Snackbar>
			<Snackbar open={success} autoHideDuration={2500} onClose={handleClose}>
				<Alert onClose={handleClose} severity="success">
					{props.todos.success}
				</Alert>
			</Snackbar>
			<Grid container justifyContent="center" spacing={1}>
				<Grid item xs={12} sm={6}>
					<h3>List of To-dos:</h3>
					{props.todos.todos.length === 0 ? (
						<h5>List empty!</h5>
					) : (
						<>
							{props.todos.todos.map((todo, i) => {
								return (
									<div key={i}>
										<FormControlLabel
											control={
												<Checkbox
													checked={todo.completed}
													onChange={() => props.updateTodo(todo._id)}
													color="primary"
												/>
											}
											label={todo.title}
										/>
										<span
											onClick={() => props.deleteTodo(todo._id)}
											style={{ cursor: "pointer" }}
										>
											<DeleteForeverIcon />
										</span>
									</div>
								);
							})}
						</>
					)}
				</Grid>
				<Grid item xs={12} sm={6}>
					<div>
						<TextField
							id="todo-input"
							className={classes.inputField}
							label={"Title"}
							placeholder="shreyasx"
							helperText="What do you wanna do?"
							onChange={event => setTitle(event.target.value)}
							variant="outlined"
						/>
					</div>
					<Button
						className={classes.buttons}
						onClick={async () => {
							await props.addTodo(title);
							document.getElementById("todo-input").value = null;
						}}
						disabled={props.todos.loading}
						color="primary"
						variant="contained"
					>
						add todo
					</Button>
				</Grid>
			</Grid>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
