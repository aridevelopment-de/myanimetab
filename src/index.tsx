import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import DatabaseChecker from "./DatabaseChecker";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
	<React.StrictMode>
		<DatabaseChecker>
			<App />
		</DatabaseChecker>
	</React.StrictMode>
)
