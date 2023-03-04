export interface Metadata {
	name: string;
	author: string;
	installableComponent: boolean;
	defaultComponent?: boolean;
	removeableComponent?: boolean;
}

export interface HeaderSettings {
	name: string;
	type: string;
	option: {
		type: "toggle" | null;
		default?: boolean;
	};
}

export interface Setting {
	name: string;
	key: string;
	type: "dropdown" | "input" | "number";
	[key: string]: any;
}

export interface Component {
	fullId: string;
	type: string;
	id: string;
	element: JSX.Element | null; // might be null as for non-renderable components
	metadata: Metadata;
	headerSettings: HeaderSettings;
	contentSettings?: Array<Setting>;
}

export interface KnownComponent {
	type: string;
	element: JSX.Element | null;
	metadata: Metadata;
	headerSettings?: HeaderSettings;
	contentSettings?: Array<Setting>;
}
