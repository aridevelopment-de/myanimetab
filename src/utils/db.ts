import Dexie, { Table } from "dexie";
import { useEffect, useState } from "react";
import EventHandler from "./eventhandler";

interface Widget {
	id: string; // <type>-<number>
	settings: any;
}

class WidgetDatabase extends Dexie {
	widgets!: Table<Widget>;

	constructor() {
		super("widgets");

		this.version(1).stores({
			widgets: "id, settings",
		});
	}

	async toJson(): Promise<Array<Widget>> {
		return await this.widgets.toArray();
	}

	async fromJSON(data: Array<Widget>) {
		// TODO: Add data validation
		await this.widgets.clear();
		await this.widgets.bulkAdd(data);
	}

	registerWidget(type: string, settings?: { [key: string]: any }) {
		this.widgets.get(`${type}-0`).then((widget) => {
			if (widget === undefined) {
				this.addWidget(type, settings);
			}
		});
	}

	addWidget(type: string, settings?: { [key: string]: any }) {
		this.getIdentifiers().then((identifiers) => {
			let amt = identifiers.filter(
				(identifier) => identifier.id === type
			).length;

			const id = `${type}-${amt}`;

			const widget: Widget = {
				id,
				settings: settings || {},
			};

			return this.widgets.add(widget);
		});
	}

	getWidget(id: string): Promise<Widget | undefined> {
		return this.widgets.get(id);
	}

	async getIdentifiers(): Promise<Array<{ id: string; number: string }>> {
		return this.widgets.toArray().then((widgets) => {
			return widgets.map((widget) => {
				return {
					id: widget.id.split("-")[0],
					number: widget.id.split("-")[1],
				};
			});
		});
	}

	async getSetting(id: string, key: string): Promise<any | undefined> {
		return this.widgets.get(id).then((widget: Widget | undefined) => {
			if (widget === undefined) {
				return undefined;
			}

			return widget.settings[key];
		});
	}

	setSetting(id: string, key: string, value: any) {
		EventHandler.emit(`widget.${id}.${key}`, value);

		key = `settings.${key}`;
		this.widgets.update(id, { [key]: value });
	}
}

interface Meta {
	name: string;
	value: any;
}

class MetaDatabase extends Dexie {
	meta!: Table<Meta>;
	changes: { [key: string]: Array<Function> } = {};

	constructor() {
		super("meta");

		this.version(1).stores({
			meta: "name, value",
		});
	}

	onMetaChange(name: string, callback: (value: any) => void) {
		if (this.changes[name] === undefined) {
			this.changes[name] = [];
		}

		this.changes[name].push(callback);
	}

	emitOnMetaChange(name: string, newValue: any) {
		if (this.changes[name] !== undefined) {
			this.changes[name].forEach((callback) => callback(newValue));
		}
	}

	async getMeta(name: string): Promise<any | undefined> {
		return this.meta
			.get(name)
			.then((meta) => (meta || { value: undefined }).value);
	}

	setMeta(name: string, value: any) {
		this.meta.update(name, { value: value });
		this.emitOnMetaChange(name, value);
	}

	registerMeta(name: string, value: any) {
		this.getMeta(name).then((meta) => {
			if (meta === undefined) {
				this.meta.put({ name: name, value: value });
			}
		});
	}
}

export const useMeta = (key: string, mapFunction?: Function): any => {
	const [status, setStatus] = useState();
	useEffect(() => {
		metaDb.getMeta(key).then((result) => {
			const newData = (mapFunction || ((d: any) => d))(result) || result;
			setStatus(newData);
		});
	}, [key, mapFunction]);

	useEffect(() => {
		metaDb.onMetaChange(key, (data: any) => {
			const newData = (mapFunction || ((d: any) => d))(data) || data;
			setStatus(newData);
		});
	}, [key, mapFunction]);

	return status;
};

export const widgetsDb = new WidgetDatabase();
export const metaDb = new MetaDatabase();
