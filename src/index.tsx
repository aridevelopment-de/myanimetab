import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { metaDb } from "./utils/db";
import { addMissing } from "./utils/registry/fixmissing";

metaDb.registerMeta("selected_image", 1);
metaDb.anyImagesOrInsert(
	"https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp",
	"love! live! drinking"
);

addMissing();

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
