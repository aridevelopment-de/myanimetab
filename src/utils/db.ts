import Dexie, { Table } from "dexie";
import { useEffect, useState } from "react";

const asyncSleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface IWidget {
	id: string; // <type>-<number>
	settings: any;
}

class WidgetDatabase extends Dexie {
	widgets!: Table<IWidget>;

	constructor() {
		super("widgets");

		this.version(1).stores({
			widgets: "id, settings",
		});
	}

	async toJson(): Promise<Array<IWidget>> {
		return await this.widgets.toArray();
	}

	async fromJSON(data: Array<IWidget>) {
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

			const widget: IWidget = {
				id,
				settings: settings || {},
			};

			return this.widgets.add(widget);
		});
	}

	getWidget(id: string): Promise<IWidget | undefined> {
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
		return this.widgets.get(id).then((widget: IWidget | undefined) => {
			if (widget === undefined) {
				return undefined;
			}

			return widget.settings[key];
		});
	}

	setSetting(id: string, key: string, value: any) {
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
	folder: number;
	url: string;
	name: string;
}

export interface IFolder {
	id: number;
	parent: number | null;
	name: string;
	color: string | null;
}

export interface IQueue {
	id: number;
	name: string;
	images: Array<number>;
}

export const ROOT_FOLDER = {
	id: 0,
	parent: null,
	name: "root",
	color: null,
} as IFolder;

class MetaDatabase extends Dexie {
	meta!: Table<Meta>;
	images!: Table<IImage>;
	folders!: Table<IFolder>;
	queues!: Table<IQueue>;
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

		this.version(4).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
			folders: "++id, parent, name, color",
		});

		this.version(5).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
			folders: "++id, parent, name, color",
			queues: "++id, &name, images",
		});
	}

	async initializeFirstTimers(): Promise<boolean> {
		// Check if this is the first time the app is opened
		if ((await this.getMeta("exists")) === undefined) {
			this.registerMeta("exists", true);
			await this.registerMeta("selected_image", 1);
			await this.registerMeta("selected_queue", null);
			await this.anyImagesOrInsert(
				"https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp",
				"love! live! drinking"
			);

			return true;
		}

		return false;
	}

	/* Meta table */
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
		if (value !== undefined) {
			this.meta.update(name, { value: value });
			this.emitOnMetaChange(name, value);
		}
	}

	async registerMeta(name: string, value: any): Promise<boolean> {
		const meta = await this.getMeta(name);

		if (meta === undefined) {
			this.meta.put({ name: name, value: value });
			return true;
		}

		return false;
	}

	/* Image table */
	async anyImagesOrInsert(defaultUrl: string, defaultName: string) {
		const images = await this.images.toArray();

		if (images.length === 0) {
			// @ts-ignore
			this.images.put({
				folder: ROOT_FOLDER.id,
				url: defaultUrl,
				name: defaultName,
			});
		}
	}

	async getImages(folder: number): Promise<Array<IImage>> {
		return this.images.where("folder").equals(folder).toArray();
	}

	async getImage(id: number): Promise<IImage | undefined> {
		return this.images.get(id);
	}

	addBulkImages(urls: string[], folder: IFolder) {
		return this.images.bulkPut(
			urls.map((url: string) => {
				return {
					folder: folder.id || ROOT_FOLDER.id,
					url: url,
					name: `Image #${Math.floor(Math.random() * 1000000)}`,
				} as IImage;
			})
		);
	}

	async addImage(folder: number, url: string, name: string) {
		if (!(await this.checkFolderExists(folder))) {
			return false;
		}

		// @ts-ignore
		return this.images.put({ folder, url, name });
	}

	async editImage(id: number, values: Omit<Partial<IImage>, "id">) {
		return this.images.update(id, values);
	}

	async relocateImage(id: number, newFolder: number) {
		if (!(await this.checkFolderExists(newFolder))) {
			return false;
		}

		return this.images.update(id, { folder: newFolder });
	}

	async removeImage(id: number) {
		// Unlink from any queues using filter
		const queues = await this.queues.toArray();

		for (const queue of queues) {
			await this.queues.update(queue.id, {
				images: queue.images.filter((imageId) => imageId !== id),
			});
		}

		return this.images.delete(id);
	}

	/* Folder table */
	async getSubFolders(parent: number): Promise<Array<IFolder>> {
		return this.folders.where("parent").equals(parent).toArray();
	}

	async checkFolderExists(id: number): Promise<boolean> {
		if (id === ROOT_FOLDER.id) {
			return true;
		}

		return (await this.folders.get(id)) !== undefined;
	}

	async addFolder(settings: Omit<Partial<IFolder>, "id">) {
		const defaultProperties = {
			parent: ROOT_FOLDER.id,
			name: "New Folder",
			color: null,
		} as Omit<Partial<IFolder>, "id">;

		// @ts-ignore: Id is not required
		return this.folders.put({ ...defaultProperties, ...settings });
	}

	async removeFolder(folder: IFolder) {
		if (folder.id === ROOT_FOLDER.id) {
			return false;
		}

		// Change every folder and image that has this folder as their parent
		// so that their parent is the parent of this folder
		await this.folders
			.where("parent")
			.equals(folder.id)
			.modify({ parent: folder.parent });

		await this.images
			.where("folder")
			.equals(folder.id)
			.modify({ folder: folder.parent });

		return await this.folders.delete(folder.id);
	}

	async editFolder(id: number, values: Omit<Partial<IFolder>, "id">) {
		if (id === ROOT_FOLDER.id) {
			return false;
		}

		return this.folders.update(id, values);
	}

	async getFolder(id: number): Promise<IFolder | undefined> {
		if (id === ROOT_FOLDER.id) {
			return ROOT_FOLDER;
		}

		return this.folders.get(id);
	}

	async getFolderHirachy(childFolder: IFolder): Promise<IFolder[]> {
		if (childFolder.id === ROOT_FOLDER.id) {
			return [];
		}

		const folders = [childFolder];

		let currentFolder = childFolder;

		while (
			currentFolder.parent !== ROOT_FOLDER.id &&
			currentFolder.parent !== null
		) {
			// @ts-ignore
			currentFolder = await this.getFolder(currentFolder.parent.id);

			if (currentFolder === undefined) {
				break;
			}

			folders.push(currentFolder);
		}

		return folders.reverse();
	}

	/* Queue table */
	async getQueue(qid: number | null): Promise<IQueue | undefined> {
		// TOOD: Let this function call getImage
		// TOOD: Implement cache on function getImage

		if (qid === null || qid === undefined) {
			return undefined;
		}

		return this.queues.get(qid);
	}

	async addQueue(): Promise<boolean> {
		// generate random queue name
		const name = `Queue #${Math.floor(Math.random() * 1000)}`;
		const queue = {
			name,
			images: [],
		} as unknown as IQueue;

		// @ts-ignore Id is not required
		this.queues.put(queue);
		return true;
	}

	async deleteQueue(qid: number) {
		return this.queues.delete(qid);
	}

	async insertImageToQueue(qid: number, image: IImage): Promise<boolean> {
		// images in queue are stored via id
		const queue = await this.getQueue(qid);

		if (queue === undefined) {
			return false;
		}

		if (queue.images.includes(image.id)) {
			return false;
		}

		queue.images.push(image.id);

		try {
			this.queues.update(qid, { images: queue.images });
		} catch (e) {
			console.error(e);
			return false;
		}

		return true;
	}

	async removeImageFromQueue(qid: number, image: IImage): Promise<boolean> {
		// use the modify method of dexie

		const queue = await this.getQueue(qid);

		if (queue === undefined) {
			return false;
		}

		if (!queue.images.includes(image.id)) {
			return false;
		}

		queue.images = queue.images.filter((id) => id !== image.id);

		try {
			this.queues.update(qid, { images: queue.images });
		} catch (e) {
			console.error(e);
			return false;
		}

		return true;
	}

	async queueContainsImage(qid: number, image: IImage) {
		const queue = await this.getQueue(qid);

		if (queue === undefined) {
			return false;
		}

		return queue.images.includes(image.id);
	}

	async editQueue(qid: number, values: Omit<Partial<IQueue>, "id">) {
		return this.queues.update(qid, values);
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
