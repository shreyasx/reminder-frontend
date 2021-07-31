import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { addTodo, deleteTodo, updateTodo } from "./homeHelper";
import {
	FormControlLabel,
	TextField,
	Button,
	Checkbox,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Grid } from "@material-ui/core";
import useStyles from "./styles";

const Todos = () => {
	const [loading, setLoading] = useState(true);
	const [todos, setTodos] = useState([]);
	const [title, setTitle] = useState("");
	const classes = useStyles();

	const getTodos = () => {
		fetch(`${API}/user/${isAuthenticated().user.username}/todos`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAuthenticated().token}`,
			},
		})
			.then(r => r.json())
			.then(resp => {
				setTodos(resp);
				setLoading(false);
			})
			.catch(console.log);
	};

	useEffect(getTodos, []);

	return (
		<>
			<Grid container justifyContent="center" spacing={1}>
				<Grid item xs={12} sm={6}>
					<h3>List of To-dos:</h3>
					{todos.length === 0 ? (
						<h5>List empty!</h5>
					) : (
						<>
							{todos.map((todo, i) => {
								return (
									<div>
										<FormControlLabel
											control={
												<Checkbox
													checked={todo.completed}
													// TODO: Update todo list in redux store before firing request to the backend.
													onChange={() => updateTodo(todo._id, getTodos)}
													color="primary"
												/>
											}
											label={todo.title}
										/>
										<span
											onClick={() => deleteTodo(todo._id, getTodos)}
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
						onClick={() => {
							setLoading(true);
							addTodo(title, getTodos, () => setLoading(false));
						}}
						disabled={loading}
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

export default Todos;
