import { useLiveQuery } from "dexie-react-hooks";
import md5 from "md5";
import { useEffect, useState } from "react";
import { widgetsDb } from "./db";
import EventHandler from "./eventhandler";

export const useSetting = (
	id: string,
	key: string,
	trigger_function?: Function
): [any, Function] => {
	/* const [state, setState] = useState();
    const changeStatus = (value: any) => widgetsDb.setSetting(id, key, value);

    useEvent(`widget.${id}.${key}`, HashCode.value(id + key + String(trigger_function)), null, (data: any) => {
        const value = (trigger_function || (() => {}))(data) || data;        
        setState(value);
    })

    useEffect(() => {
        widgetsDb.getSetting(id, key).then((data: any) => {
            const value = (trigger_function || (() => {}))(data) || data;
            setState(value);
        })
    }, [id, key, trigger_function])
    
    return [state, changeStatus]; */

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
			setState(data[0].settings[key]);
		}
	}, [data, key]);

	return [state, changeData];
};

export const useEvent = (
	event_name: string,
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

/**
 * Javascript HashCode v1.0.0
 * This function returns a hash code (MD5) based on the argument object.
 * http://pmav.eu/stuff/javascript-hash-code
 *
 * Example:
 *  var s = "my String";
 *  alert(HashCode.value(s));
 *
 * pmav, 2010
 */
var HashCode = (function () {
	var serialize = function (object: any) {
		// Private
		var type,
			serializedCode = "";

		type = typeof object;

		if (type === "object") {
			var element;

			for (element in object) {
				serializedCode +=
					"[" +
					type +
					":" +
					element +
					serialize(object[element]) +
					"]";
			}
		} else if (type === "function") {
			serializedCode += "[" + type + ":" + object.toString() + "]";
		} else {
			serializedCode += "[" + type + ":" + object + "]";
		}

		return serializedCode.replace(/\s/g, "");
	};

	// Public, API
	return {
		value: function (object: any) {
			return md5(serialize(object));
		},
	};
})();
