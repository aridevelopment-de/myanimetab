import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import DatabaseChecker from "./DatabaseChecker";
import "./index.css";

ReactDOM.render(
	<React.StrictMode>
		<DatabaseChecker>
			<App />
		</DatabaseChecker>
	</React.StrictMode>,
	document.getElementById("root")
);
