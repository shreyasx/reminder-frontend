import React, { useState } from "react";
import { deleteTodoAPIcall, updateTodo } from "./homeHelper";
import {
	FormControlLabel,
	TextField,
	Button,
	Checkbox,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { deleteTodo, addTodo } from "../store/actions/todos";
import useStyles from "./styles";

const mapStateToProps = state => ({
	todos: state.todos,
});

const mapDispatchToProps = dispatch => ({
	addTodo: title => dispatch(addTodo(title)),
	deleteTodo: id => {
		dispatch(deleteTodo(id));
		deleteTodoAPIcall(id);
	},
});

const Todos = props => {
	const [title, setTitle] = useState("");
	const classes = useStyles();

	return (
		<>
			<Grid container justifyContent="center" spacing={1}>
				<Grid item xs={12} sm={6}>
					<h3>List of To-dos:</h3>
					{props.todos.todos.length === 0 ? (
						<h5>List empty!</h5>
					) : (
						<>
							{props.todos.todos.map((todo, i) => {
								return (
									<div>
										<FormControlLabel
											control={
												<Checkbox
													checked={todo.completed}
													// TODO: Update todo list in redux store before firing request to the backend.
													onChange={() => updateTodo(todo._id)}
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
						onClick={() => props.addTodo(title)}
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
