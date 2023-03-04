import Dexie, { Table } from "dexie";
import { useEffect, useState } from "react";
import EventHandler from "./eventhandler";

const asyncSleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type ISnapConfiguration = {
	horizontal: {
		// snap line ids
		top: number | null;
		mid: number | null;
		bottom: number | null;
		// x percentage
		percentage: number | null;
	},
	vertical: {
		// snap line ids
		left: number | null;
		mid: number | null;
		right: number | null;
		// y percentage
		percentage: number | null;
	}
}

export interface IWidget {
	id: string; // <type>-<number>
	settings: {
		snaps: ISnapConfiguration;
		[key: string]: any;
	};
}

class WidgetDatabase extends Dexie {
	widgets!: Table<IWidget>;

	constructor() {
		super("widgets");

		this.version(1).stores({
			widgets: "id, settings",
		});

		this.version(2).stores({
			widgets: "id, settings",
		});

		this.version(3).stores({
			widgets: "id, settings",
		});
		
		this.version(4).stores({
			widgets: "id, settings",
		})
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
				// @ts-ignore
				settings: settings || {
					snaps: {
						horizontal: {
							top: null,
							mid: 50,
							bottom: null,
						},
						vertical: {
							left: null,
							mid: 50,
							right: null,
						},
					},
				},
			};

			return this.widgets.add(widget);
		});
	}

	getWidget(id: string): Promise<IWidget | undefined> {
		return this.widgets.get(id);
	}

	async setSnapConfiguration(id: string, config: ISnapConfiguration) {
		return this.setSetting(id, "snaps", config);
	}

	async unlinkSnapLine(snapId: number) {
		const widgets = await this.widgets.toArray();

		for (let i = 0; i < widgets.length; i++) {
			const widget = widgets[i];
			const settings = widget.settings;

			if (!settings.snaps) continue;

			if (settings.snaps.horizontal.top === snapId) {
				settings.snaps.horizontal.top = 50;
			}

			if (settings.snaps.horizontal.mid === snapId) {
				settings.snaps.horizontal.mid = 50;
			}

			if (settings.snaps.horizontal.bottom === snapId) {
				settings.snaps.horizontal.bottom = 50;
			}

			if (settings.snaps.vertical.left === snapId) {
				settings.snaps.vertical.left = 50;
			}

			if (settings.snaps.vertical.mid === snapId) {
				settings.snaps.vertical.mid = 50;
			}

			if (settings.snaps.vertical.right === snapId) {
				settings.snaps.vertical.right = 50;
			}

			this.widgets.update(widget.id, { settings });
		}
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
	timed: boolean;
	from: string | null; // 17:00
	to: string | null; // 19:30
}

export const ROOT_FOLDER = {
	id: 0,
	parent: null,
	name: "root",
	color: null,
} as IFolder;

export type IVerticalSnapLine = {
	id: number;
	axis: "vertical";
	left: number | null;
	right: number | null;
};

export type IHorizontalSnapLine = {
	id: number;
	axis: "horizontal";
	top: number | null;
	bottom: number | null;
};

export type ISnapLine = IVerticalSnapLine | IHorizontalSnapLine;

class MetaDatabase extends Dexie {
	meta!: Table<Meta>;
	images!: Table<IImage>;
	folders!: Table<IFolder>;
	queues!: Table<IQueue>;
	snapLines!: Table<ISnapLine>;
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

		this.version(6).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
			folders: "++id, parent, name, color",
			queues: "++id, &name, images",
			snapLines: "++id, axis, top, left, right, bottom",
		});

		this.version(7).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
			folders: "++id, parent, name, color",
			queues: "++id, &name, images",
			snapLines: "++id, axis, top, left, right, bottom",
		});
		
		this.version(8).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
			folders: "++id, parent, name, color",
			queues: "++id, &name, images",
			snapLines: "++id, axis, top, left, right, bottom",
		});

		this.version(9).stores({
			meta: "&name, value",
			images: "++id, folder, url, name",
			folders: "++id, parent, name, color",
			queues: "++id, &name, images, timed, from, to",
			snapLines: "++id, axis, top, left, right, bottom",
		})
	}

	async justInstalled(): Promise<boolean> {
		return (await this.getMeta("justInstalled")) === true;
	}

	async removeJustInstalled(): Promise<void> {
		return this.setMeta("justInstalled", false);
	}

	async initializeFirstTimers(): Promise<boolean> {
		if ((await this.getMeta("justInstalled")) === undefined) {
			this.registerMeta("justInstalled", true);
		}

		// Check if this is the first time the app is opened
		if ((await this.getMeta("exists")) === undefined) {
			this.registerMeta("exists", true);
			this.registerMeta("justInstalled", true);
			await this.registerMeta("selected_image", 1);
			await this.registerMeta("selected_queue", null);
			await this.anyImagesOrInsert(
				"https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp",
				"love! live! drinking"
			);

			const snapLines = await this.snapLines.toArray();

			if (snapLines.length === 0) {
				await this.snapLines.bulkAdd([
					{
						id: 0,
						axis: "horizontal",
						top: 5,
						bottom: null,
					},
					{
						id: 1,
						axis: "horizontal",
						bottom: 5,
						top: null,
					},
					{
						id: 2,
						axis: "vertical",
						left: 5,
						right: null,
					},
					{
						id: 3,
						axis: "vertical",
						right: 5,
						left: null,
					},
					{
						id: 4,
						axis: "horizontal",
						top: 50,
						bottom: null,
					},
					{
						id: 5,
						axis: "vertical",
						left: 50,
						right: null,
					}
				]);
			}

			return true;
		}

		return false;
	}

	/* Snapline table */
	addSnapLine(snapLine: Omit<ISnapLine, "id">): Promise<number> {
		// @ts-ignore
		return this.snapLines.add(snapLine);
	}

	async deleteSnapLine(id: number) {;
		// await widgetsDb.unlinkSnapLine(id);
		return this.snapLines.delete(id);
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

	removeMeta(name: string) {
		this.meta.delete(name);
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
			from: null,
			to: null,
			timed: false,
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

	async getCurrentTimedQueue(hour: number, minute: number): Promise<IQueue | undefined> {
		const queues = await this.queues
			.filter(e => e.timed === true)
			.toArray();

		for (const queue of queues) {
			if (queue.from === null || queue.to === null) {
				continue;
			}

			const from = queue.from.split(":").map(e => parseInt(e));
			const to = queue.to.split(":").map(e => parseInt(e));

			if (from[0] <= hour && hour <= to[0]) {
				if (from[0] === to[0]) {
					if (from[1] <= minute && minute <= to[1]) {
						return queue;
					}
				} else {
					return queue;
				}
			}
		}

		return undefined;
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

interface Layout {
	snapLines: ISnapLine[];
	widgetSnaps: {
		[widgetId: string]: ISnapConfiguration;
	}
}

export const exportLayout = async (): Promise<Layout> => {
	const snapLines = await metaDb.snapLines.toArray();
	const widgets = await widgetsDb.widgets.toArray();

	const layout: Layout = {
		snapLines,
		widgetSnaps: {},
	};

	widgets.forEach((widget: IWidget) => {
		layout.widgetSnaps[widget.id] = widget.settings.snaps;
	});

	return layout;
}

export const importLayout = async (layout: {[key: string]: any}, clearSnaplines: boolean): Promise<boolean> => {
	// check if layout is valid
	if (!layout.snapLines || !layout.widgetSnaps) {
		console.error("[Importing Layout] Layout does not contain snapLines or widgetSnaps as attributes")
		return false;
	}

	const snapLines = layout.snapLines;
	const widgetSnaps = layout.widgetSnaps;

	for (const snapLine of snapLines) {
		if (!snapLine.axis) {console.error("[Importing Layout] Snapline axis missing"); return false}
		if (snapLine.axis === "vertical" && (snapLine.left === undefined || snapLine.right === undefined)) {console.error("[Importing Layout] Snapline is vertical but either left or right is missing"); return false}
		if (snapLine.axis === "horizontal" && (snapLine.top === undefined || snapLine.bottom === undefined)) {console.error("[Importing Layout] Snapline is horizontal but either top or bottom is missing"); return false}
	}

	for (const widgetId in widgetSnaps) {
		const widgetSnap = widgetSnaps[widgetId];
		if (!widgetSnap.horizontal || !widgetSnap.vertical) {console.error("[Importing Layout] Widget does not have horizontal or vertical setting"); return false}
		if (widgetSnap.horizontal.top === undefined || widgetSnap.horizontal.mid === undefined || widgetSnap.horizontal.bottom === undefined || widgetSnap.horizontal.percentage === undefined) {console.error("[Importing Layout] Either top, mid, bottom or percentage is missing in widget"); return false}
		if (widgetSnap.vertical.left === undefined || widgetSnap.vertical.mid === undefined || widgetSnap.vertical.right === undefined || widgetSnap.vertical.percentage === undefined) {console.error("[Importing Layout] Either left, mid, right or percentage is missing in widget"); return false}
	}

	if (clearSnaplines) {
		await metaDb.snapLines.clear();
	}

	const idMapping = {} as {[oldId: number]: number}

	for (const snapLine of snapLines) {
		const newId = await metaDb.addSnapLine(snapLine);
		idMapping[snapLine.id] = newId;
	}

	for (const widgetId in widgetSnaps) {
		if (await widgetsDb.getWidget(widgetId) !== undefined) {
			let config: ISnapConfiguration = widgetSnaps[widgetId];

			if (config.horizontal.top !== null) {if (idMapping[config.horizontal.top] === undefined) {continue;} else {config.horizontal.top = idMapping[config.horizontal.top];}}
			if (config.horizontal.mid !== null) {if (idMapping[config.horizontal.mid] === undefined) {continue;} else {config.horizontal.mid = idMapping[config.horizontal.mid];}}
			if (config.horizontal.bottom !== null) {if (idMapping[config.horizontal.bottom] === undefined) {continue;} else {config.horizontal.bottom = idMapping[config.horizontal.bottom];}}

			if (config.vertical.left !== null) {if (idMapping[config.vertical.left] === undefined) {continue;} else {config.vertical.left = idMapping[config.vertical.left];}}
			if (config.vertical.mid !== null) {if (idMapping[config.vertical.mid] === undefined) {continue;} else {config.vertical.mid = idMapping[config.vertical.mid];}}
			if (config.vertical.right !== null) {if (idMapping[config.vertical.right] === undefined) {continue;} else {config.vertical.right = idMapping[config.vertical.right];}}

			await widgetsDb.setSnapConfiguration(widgetId, config);
		}
	}

	window.location.reload();

	return true;
}

export const initialLayouts = {
	"/layouts/one.svg": {
		"snapLines":[{"id":0,"axis":"horizontal","top":1,"bottom":null},{"id":1,"axis":"horizontal","bottom":1,"top":null},{"id":2,"axis":"vertical","left":1,"right":null},{"id":3,"axis":"vertical","right":1,"left":null},{"id":4,"axis":"horizontal","top":null,"bottom":60},{"id":5,"axis":"vertical","left":50,"right":null}],"widgetSnaps":{"clock-0":{"horizontal":{"top":null,"mid":null,"bottom":1,"percentage":null},"vertical":{"left":2,"mid":null,"right":null,"percentage":null}},"controlbar-0":{"horizontal":{"top":0,"mid":null,"bottom":null,"percentage":null},"vertical":{"left":null,"mid":null,"right":3,"percentage":null}},"searchbar-0":{"horizontal":{"top":null,"mid":null,"bottom":4,"percentage":null},"vertical":{"left":null,"mid":5,"right":null,"percentage":null}},"weather-0":{"horizontal":{"top":null,"mid":null,"bottom":1,"percentage":null},"vertical":{"left":null,"mid":null,"right":3,"percentage":null}}}
	},
	"/layouts/two.svg": {
		"snapLines":[{"id":4,"axis":"horizontal","top":50,"bottom":null},{"axis":"vertical","left":50,"right":null,"id":6},{"axis":"horizontal","top":1,"bottom":null,"id":7},{"axis":"vertical","left":null,"right":1,"id":8},{"axis":"horizontal","top":40,"bottom":null,"id":9},{"axis":"horizontal","top":null,"bottom":40,"id":10}],"widgetSnaps":{"clock-0":{"horizontal":{"top":null,"mid":10,"bottom":null,"percentage":null},"vertical":{"left":null,"mid":6,"right":null,"percentage":null}},"controlbar-0":{"horizontal":{"top":7,"mid":null,"bottom":null,"percentage":null},"vertical":{"left":null,"mid":null,"right":8,"percentage":null}},"searchbar-0":{"horizontal":{"top":null,"mid":4,"bottom":null,"percentage":null},"vertical":{"left":null,"mid":6,"right":null,"percentage":null}},"weather-0":{"horizontal":{"top":null,"mid":9,"bottom":null,"percentage":null},"vertical":{"left":null,"mid":6,"right":null,"percentage":null}}}
	},
	"/layouts/three.svg": {
		"snapLines":[{"id":4,"axis":"horizontal","top":50,"bottom":null},{"axis":"vertical","left":50,"right":null,"id":6},{"axis":"horizontal","top":1,"bottom":null,"id":7},{"axis":"vertical","left":1,"right":null,"id":8},{"axis":"vertical","left":null,"right":1,"id":11},{"axis":"horizontal","top":13,"bottom":null,"id":12}],"widgetSnaps":{"clock-0":{"horizontal":{"top":null,"mid":null,"bottom":12,"percentage":null},"vertical":{"left":null,"mid":null,"right":11,"percentage":null}},"controlbar-0":{"horizontal":{"top":7,"mid":null,"bottom":null,"percentage":null},"vertical":{"left":8,"mid":null,"right":null,"percentage":null}},"searchbar-0":{"horizontal":{"top":null,"mid":4,"bottom":null,"percentage":null},"vertical":{"left":null,"mid":6,"right":null,"percentage":null}},"weather-0":{"horizontal":{"top":12,"mid":null,"bottom":null,"percentage":null},"vertical":{"left":null,"mid":null,"right":11,"percentage":null}}}
	},
} as {[key: string]: Layout};

export const actUponInitialLayout = async (layout: string) => {
	console.log("Using layout: " + layout);
	importLayout(initialLayouts[layout], true);
}

