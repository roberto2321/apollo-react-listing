import React from "react";
import "./App.css";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const READ_TODOS = gql`
  query allTodos {
    allTodos {
      id
      title
      done
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $done: Boolean!) {
    createTodo(data: { title: $title, done: $done }) {
      id
    }
  }
`;

const COMPLETE_TODO = gql`
  mutation CompleteTodo($id: String!) {
    completeTodo(id: $id) {
      id
    }
  }
`;

function App() {
  let input;
  const { data, loading, error } = useQuery(READ_TODOS, {
    fetchPolicy: "network-only",
  });
  const [createTodo] = useMutation(CREATE_TODO);
  const [completeTodo] = useMutation(COMPLETE_TODO);

  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const handleCreate = (e) => {
    e.preventDefault();
    createTodo({
      variables: { title: input.value, done: false },
      refetchQueries: [{ query: READ_TODOS }],
    });
    input.value = "";
  };

  const handleDone = (todo) => {
    if (todo.done) {
      return;
    }
    completeTodo({
      variables: { id: todo.id },
      refetchQueries: [{ query: READ_TODOS }],
    });
  };

  return (
    <div className="app">
      <h3>Create New Todo</h3>
      <form onSubmit={handleCreate}>
        <input
          className="form-control"
          type="text"
          placeholder="Enter todo"
          ref={(node) => {
            input = node;
          }}
        ></input>
        <button className="btn btn-primary px-5 my-2" type="submit">
          Submit
        </button>
      </form>
      <ul>
        {data.allTodos.map((todo) => (
          <li key={todo.id} className="w-100">
            <span className={todo.completed ? "done" : "pending"}>
              {todo.title}
            </span>
            <button
              className={`btn btn-sm float-right ${
                todo.done ? "btn-success" : "btn-info"
              }`}
              onClick={() => handleDone(todo)}
            >
              {todo.done ? <span>Completed</span> : <span>Not completed</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
