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

	removeWidget(fullId: string) {
		this.widgets.delete(fullId);
	}

	addWidget(type: string, settings?: { [key: string]: any }) {
		this.getIdentifiers().then((identifiers) => {
			const filteredIdentifiers = identifiers.filter(
				(identifier) => identifier.id === type
			);

			let firstMissingIdentifier = Infinity;

			for (let i = 0; i < filteredIdentifiers.length; i++) {
				if (filteredIdentifiers[i].id === type) {
					if (parseInt(filteredIdentifiers[i].number) !== i) {
						firstMissingIdentifier = i;
						break;
					}
				}
			}

			if (firstMissingIdentifier === Infinity) {
				firstMissingIdentifier = filteredIdentifiers.length;
			}

			const id = `${type}-${firstMissingIdentifier}`;

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

export interface IImage {
	id: number;
	folder: string;
	url: string;
	name: string;
}

export interface Folder {
	id: number;
	path: string;
}

class MetaDatabase extends Dexie {
	meta!: Table<Meta>;
	images!: Table<IImage>;
	folders!: Table<Folder>;
	changes: { [key: string]: Array<Function> } = {};

	constructor() {
		super("meta");

		this.version(1).stores({
			meta: "name, value",
		});

		// Folders always have to start with a slash and cannot end with a slash
		this.version(2).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
		});

		this.version(3).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
			folders: "++id, path",
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

	async anyImagesOrInsert(defaultUrl: string, defaultName: string) {
		const images = await this.images.toArray();

		if (images.length === 0) {
			// @ts-ignore
			this.images.put({
				folder: "/",
				url: defaultUrl,
				name: defaultName,
			});
		}
	}

	async getImages(folder: string): Promise<Array<IImage>> {
		return this.images.where("folder").equals(folder).toArray();
	}

	async getSubFolders(parentDirectory: string): Promise<Array<string>> {
		return (await this.folders.toArray())
			.map((folder) => folder.path)
			.filter((path) => path.startsWith(parentDirectory))
			.filter((path) => path !== parentDirectory)
			.filter((path) => {
				let afterParent = path.substring(parentDirectory.length);

				if (afterParent.startsWith("/")) {
					afterParent = afterParent.substring(1);
				}

				console.log(afterParent);

				return afterParent.indexOf("/") === -1 && afterParent !== "";
			});
	}

	async getImage(id: number): Promise<IImage | undefined> {
		return this.images.get(id);
	}

	addBulkImages(urls: string[]) {
		return this.images.bulkPut(
			// @ts-ignore
			urls.map((url: string) => {
				return {
					folder: "/",
					url: url,
					name: `Image #${Math.floor(Math.random() * 1000000)}`,
				};
			})
		);
	}

	async addImage(folder: string, url: string, name: string) {
		if (!(await this.checkFolderExists(folder)) && folder !== "/") {
			await this.addFolder(folder);
		}

		// @ts-ignore
		return this.images.put({ folder, url, name });
	}

	async relocateImage(id: number, newPath: string) {
		if (!(await this.checkFolderExists(newPath)) && newPath !== "/") {
			await this.addFolder(newPath);
		}

		return this.images.update(id, { folder: newPath });
	}

	async removeImage(id: number) {
		return this.images.delete(id);
	}

	async checkFolderExists(path: string): Promise<boolean> {
		return (
			(await this.folders.where("path").equals(path).toArray()).length > 0
		);
	}

	async addFolder(path: string, folderName?: string) {
		if (folderName === undefined) {
			// create new folder name with template "New Folder #1, 2, ..."
			const folders = await this.getSubFolders(path);
			let folderNumber = 1;
			while (folders.includes(`New Folder #${folderNumber}`)) {
				folderNumber++;
			}

			folderName = `New Folder #${folderNumber}`;
		}

		if (path === "/") {
			// prevent mis-formmatting in final folder name
			path = "";
		}

		// @ts-ignore
		return this.folders.put({ path: path + "/" + folderName });
	}

	async removeFolder(path: string) {
		return this.folders.where("path").equals(path).delete();
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
