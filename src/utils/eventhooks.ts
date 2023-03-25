import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { widgetsDb } from "./db";
import EventHandler from "./eventhandler";
import { EventType } from './eventhandler';

let SETTINGS_CACHE: { [key: string]: { [key: string]: any } } = {};

export const useCachedSetting = (id: string, key: string): [any, Function] => {
	/* 
		undefined means: not loaded yet
		null means: no value
	*/
	const [state, setState] = useState(
		SETTINGS_CACHE[id] !== undefined &&
			SETTINGS_CACHE[id][key] !== undefined
			? SETTINGS_CACHE[id][key]
			: undefined
	);

	const changeData = (newValue: any, update_database?: boolean) => {
		setState(newValue);

		if (SETTINGS_CACHE[id] === undefined) {
			SETTINGS_CACHE[id] = {};
		}

		let key_split = key.split(".");
		let current = SETTINGS_CACHE[id];

		for (let i = 0; i < key_split.length; i++) {
			if (i === key_split.length - 1) {
				current[key_split[i]] = newValue;
				break;
			}

			if (current[key_split[i]] === undefined) {
				current[key_split[i]] = {};
			}

			current = current[key_split[i]];
		}

		SETTINGS_CACHE[id] = current;
		SETTINGS_CACHE = { ...SETTINGS_CACHE };

		if (update_database) {
			widgetsDb.setSetting(id, key, newValue);
		}
	};

	useEffect(() => {
		if (SETTINGS_CACHE[id] !== undefined) {
			// key will contain "."
			let key_split = key.split(".");
			let current = SETTINGS_CACHE[id];

			for (let i = 0; i < key_split.length; i++) {
				if (current[key_split[i]] === undefined) {
					break;
				}

				if (i === key_split.length - 1) {
					setState(current[key_split[i]]);
					return;
				}

				current = current[key_split[i]];
			}

			widgetsDb.getSetting(id, key).then((value) => {
				if (value !== undefined) {
					changeData(value, false);
				} else {
					changeData(null, false);
				}
			});
		} else {
			widgetsDb.getSetting(id, key).then((value) => {
				if (value !== undefined) {
					changeData(value, false);
				} else {
					changeData(null, false);
				}
			});
		}
	}, [id, key, SETTINGS_CACHE[id]]);

	return [state, changeData];
};

export const useSetting = (id: string, key: string, registerDefault: any = undefined): [any, Function] => {
	const [state, setState] = useState();
	const data = useLiveQuery(() =>
		widgetsDb.widgets.where("id").equals(id).toArray()
	);

	const changeData = (newValue: any) => {
		setState(newValue);
		widgetsDb.setSetting(id, key, newValue);
	};

	useEffect(() => {
		if (data !== undefined) {
			if (data[0] !== undefined) {
				let key_split = key.split(".");
				let current = data[0].settings;

				for (let i = 0; i < key_split.length; i++) {
					if (current[key_split[i]] === undefined) {
						if (registerDefault !== undefined) {
							if (i === key_split.length - 1) {
								setState(registerDefault);
								widgetsDb.setSetting(id, key, registerDefault);
								return;
							} else {
								current[key_split[i]] = {};
							}
						} else {
							break;
						}
					}

					if (i === key_split.length - 1) {
						setState(current[key_split[i]]);
						return;
					}

					current = current[key_split[i]];
				}
			}
		}
	}, [data, key, registerDefault, id]);

	return [state, changeData];
};

const EmptyElement = new Proxy(
	{},
	{
		get: (obj, prop) => undefined,
	}
);

export const useWidget = (id: string): any => {
	const [state, setState] = useState<{ [key: string]: string }>(EmptyElement);

	const data = useLiveQuery(() =>
		widgetsDb.widgets.where("id").equals(id).toArray()
	);

	useEffect(() => {
		if (data !== undefined) {
			if (data[0] !== undefined) {
				setState(data[0].settings);
			}
		}
	}, [data]);

	return state;
};

export const useEvent = (
	event_name: EventType,
	identifier: string,
	default_value?: any,
	trigger_function?: Function
): [any, Function] => {
	const [state, setState] = useState(default_value);
	const changeEvent = (value: any) =>
		EventHandler.emit(event_name, { value: value, sender: identifier });

	useEffect(() => {
		EventHandler.on(event_name, identifier, (data: any) => {
			const value = (trigger_function || (() => {}))(data) || data.value;
			setState(value);
		});

		return () => {
			EventHandler.off(event_name, identifier);
		};
	}, [event_name, identifier, trigger_function]);

	return [state, changeEvent];
};
