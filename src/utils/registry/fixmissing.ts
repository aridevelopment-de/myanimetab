import { widgetsDb } from "../db";
import { registry } from "./customcomponentregistry";

export const addMissing = () => {
	// register known component in registry
	registry.registerKnownComponent({
		type: "wallpaper",
		element: null,
		metadata: {
			name: "Wallpaper",
			author: "aridevelopment.de",
			installableComponent: false,
		},
		headerSettings: {
			name: "Switch Wallpaper",
			type: "wallpaper",
			option: {
				type: "toggle",
				default: true,
			},
		},
		contentSettings: [
			{
				name: "When to Switch",
				key: "when_switch",
				type: "dropdown",
				values: [null, 10, 60, 120, 300, 600, 1800, 3600],
				displayedValues: [
					"Only on Page Visit",
					"Every 10 seconds",
					"Every minute",
					"Every 2 minutes",
					"Every 5 minutes",
					"Every 10 minutes",
					"Every 30 minutes",
					"Every hour",
				],
			},
			{
				name: "Playlist Order",
				key: "playlist_order",
				type: "dropdown",
				values: [0, 1],
				displayedValues: ["Ordered", "Shuffled"],
			},
		],
	});

	registry.registerKnownComponent({
		type: "autohide",
		element: null,
		metadata: {
			name: "Auto Hide",
			author: "aridevelopment.de",
			installableComponent: false,
		},
		headerSettings: {
			name: "Auto Hide",
			type: "autohide",
			option: {
				type: "toggle",
				default: true,
			},
		},
		contentSettings: [
			{
				name: "Time Lapse",
				key: "time_lapse",
				type: "dropdown",
				values: [5, 10, 30, 60, 300],
				displayedValues: ["5 s", "10 s", "30 s", "1 min", "5 min"],
			},
		],
	});

	// add component to db if not exists
	widgetsDb.registerWidget("wallpaper", {
		state: true,
		when_switch: 1,
		playlist_order: 0,
	});

	widgetsDb.registerWidget("autohide", {
		state: false,
		time_lapse: 1,
	});
};
