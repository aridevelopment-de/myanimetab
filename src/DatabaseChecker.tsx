import { useState, useEffect } from "react";
import { metaDb } from "./utils/db";
import { addMissing } from "./utils/registry/fixmissing";
const DatabaseChecker = (props: { children: JSX.Element }) => {
	const [shouldRender, setShouldRender] = useState<boolean>(false);

	useEffect(() => {
		metaDb.initializeFirstTimers().then((newUser: boolean) => {
			addMissing();

			if (newUser) {
				// Reload the page for new users as this ensures correct creation of databases
				setTimeout(() => window.location.reload(), 500);
			}

			setShouldRender(true);
		});
	}, []);

	return shouldRender ? props.children : null;
};

export default DatabaseChecker;
