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

export interface IDropdownOptions {
	values: Array<any>;
	displayedValues: Array<string>;
	// TODO: add default value
}

export interface IInputOptions {
	tooltip: string;
	hidden: boolean; /* hidden => password input */
	// TODO: add default value
}

export interface INumberInputOptions {
	min: number;
	max: number;
	step: number;
	default: number;
}

export type IAccordionAddable = {
	addable: true;
	description: Array<Setting>;
	// There has to be at least one input element with the key "title"
	// key will be a string number starting from 0 (i-0, i-1, ...)
}

export type IAccordionNotAddable = {
	addable: false;
	elements: Array<{
		title: string;
		key: string;
		content: Array<Setting>;
	}>
}

export type IAccordionOptions = IAccordionAddable | IAccordionNotAddable;

type ParentSetting = {
	name: string;
	key: string;
}

export type Setting = ParentSetting & ({
	type: "dropdown";
	options: IDropdownOptions;
} | {
	type: "input";
	options: IInputOptions;
} | {
	type: "number";
	options: INumberInputOptions;
} | {
	type: "accordion";
	options: IAccordionOptions;
})

export type SettingType = Setting["type"]

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
