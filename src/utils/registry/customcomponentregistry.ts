// @ts-nocheck
import { widgetsDb } from "../db";
import { Component, KnownComponent } from "./types";

const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));
	return arr.filter((_v, index) => results[index]);
};

class CustomComponentRegistry {
	installedComponents: Array<Component> = [];
	knownComponents: Array<KnownComponent> = [];

	constructor() {
		this.loadKnownComponents();
	}

	registerKnownComponent(component: KnownComponent) {
		this.knownComponents.push(component);
	}

	loadKnownComponents() {
		const components = require("../../widgets.json");

		components.forEach((data: { name: string; entryPoint: string }) => {
			// TODO: Let it return the element + the settings metadata
			const metadata: KnownComponent =
				require(`../../components/widgets/${data.entryPoint}.tsx`).default;
			this.knownComponents.push(metadata);
		});
	}

	_prepareSettings(component: KnownComponent) {
		const settings = {};

		if (component.headerSettingd?.option.type !== null) {
			settings.state = component.headerSettings?.option.default;
		}

		if (component.contentSettings) {
			for (let element of component.contentSettings) {
				if (element.type === "dropdown") {
					settings[element.key] = 0;
				} else if (element.type === "input") {
					settings[element.key] = "";
				}
			}
		}

		settings["snaps"] = {
			horizontal: {
				top: null,
				mid: null,
				bottom: null,
				percentage: 50,
			},
			vertical: {
				left: null,
				mid: null,
				right: null,
				percentage: 50,
			}
		}

		return settings;
	}

	async setupDefaultComponents() {
		await asyncFilter(
			this.knownComponents,
			async (component: KnownComponent) => {
				if (component.metadata.defaultComponent === true) {
					const identifiers = await widgetsDb.getIdentifiers();
					let amt = identifiers.filter(
						(identifier) => identifier.id === component.type
					).length;

					if (amt === 0) {
						await widgetsDb.addWidget(
							component.type,
							this._prepareSettings(component)
						);
					}
				}
			}
		);
	}

	installComponent(knownComponent: KnownComponent) {
		if (knownComponent.metadata.installableComponent === true) {
			// add the component to the database
			widgetsDb.addWidget(
				knownComponent.type,
				this._prepareSettings(knownComponent)
			);
		}
	}

	uninstallComponent(component: Component) {
		if (component.metadata.removeableComponent === true) {
			// remove the component from the database
			widgetsDb.removeWidget(component.fullId);
		}
	}

	loadInstalledComponents(callback) {
		this.installedComponents = [];

		widgetsDb.getIdentifiers().then((identifiers) => {
			identifiers.forEach((identifier) => {
				const component: KnownComponent = this.knownComponents.find(
					(c) => c.type === identifier.id
				);

				if (component === undefined) {
					throw new Error(
						`Component type ${identifier.id} is not known`
					);
				}

				const metadata: Component = {
					element: component.element,
					type: component.type,
					id: identifier.number,
					fullId: `${component.type}-${identifier.number}`,
					metadata: component.metadata,
					headerSettings: component.headerSettings,
					contentSettings: component.contentSettings,
				};

				this.installedComponents.push(metadata);
			});

			callback();
		});
	}
}

export const registry = new CustomComponentRegistry();
