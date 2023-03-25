/* eslint-disable @typescript-eslint/no-unused-vars */
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useSetting, useWidget } from "../../../utils/eventhooks";
import { IDropdownOptions, KnownComponent } from "../../../utils/registry/types";
import SearchEngine from "../../../utils/searchengine";
import SuggestionCaller from "../../../utils/searchsuggestioncaller";
import WidgetMoverWrapper from "../../widgetmover/wrapper/WidgetMoverWrapper";
import styles from "./searchbar.module.css";
import SearchEngineChooser from "./searchenginechooser";
import SearchSuggestions from "./searchsuggestions";

const opacityValues = [1, 0, 0.7, 0.5, 0.3];


function SearchBar(props: { blur: boolean; id: string }) {
	const widget = useWidget(props.id);
	const [searchEngine, setSearchEngine] = useSetting(props.id, "search_engine", 0);
	const [searchEngines, _1] = useSetting(
		props.id,
		"search_engines",
		{"i-0": {
			title: "Google.com",
			url: "https://www.google.com/search?client=firefox-b-d&q=",
			icon_url: "https://www.google.com/favicon.ico",
		}}
	);

	const [modalChooseEngine, setModalChooseEngine] = useState<boolean>(false);
	const [suggestions, setSuggestions] = useState<Array<string>>([]);
	const [content, setContent] = useState<string>("");
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	if (searchEngines === undefined) {
		return null;
	}

	return (
		<WidgetMoverWrapper id={props.id}>
			<div className={styles.wrapper}>
				<div
					className={`${styles.searchbar} widget`}
					style={{
						opacity: props.blur ? opacityValues[widget.auto_hide] : 1,
					}}
				>
					<div>
						<div
							className={styles.engine_icon__container}
							onClick={() => setModalChooseEngine(!modalChooseEngine)}
						>
							<img
								className={styles.engine_icon}
								src={searchEngines[`i-${searchEngine}`].icon_url}
								alt={searchEngines[`i-${searchEngine}`].title}
							/>
						</div>
						{modalChooseEngine ? (
							<SearchEngineChooser
								searchEngines={searchEngines}
								searchEngine={searchEngine}
								setSearchEngine={(idx: number) => {
									setSearchEngine(idx);
									setModalChooseEngine(false);
								}}
								onClose={() => setModalChooseEngine(false)}
							/>
						) : null}
					</div>
					<input
						className={styles.input}
						onKeyDown={(e) => {
							if (e.keyCode === 38 || e.keyCode === 40) {
								e.preventDefault();
							}
							
							// up arrow
							if (e.keyCode === 38) {
								let r = null;

								if (selectedIndex === null) {
									r = suggestions.length - 1;
								} else if (selectedIndex > 0) {
									r = selectedIndex - 1;
								}

								setSelectedIndex(r);

								if (r !== null) {
									setContent(suggestions[r]);
								} else {
									setContent(suggestions[0]);
								}
							}
							// down arrow
							else if (e.keyCode === 40) {
								let r = null;

								if (selectedIndex === null) {
									r = 0;
								} else if (selectedIndex < suggestions.length - 1) {
									r = selectedIndex + 1;
								}

								setSelectedIndex(r);

								if (r !== null) {
									setContent(suggestions[r]);
								} else {
									setContent(suggestions[0]);
								}
							}
						}}
						onKeyUp={(e) => {
							if (e.keyCode === 13) {
								SearchEngine.search(
									// @ts-ignore
									e.target.value,
									searchEngines[`i-${searchEngine}`].url,
									widget.open_with
								);
							}
						}}
						onInput={(event: any) => {
							setContent(event.target.value);
							if (selectedIndex !== null) setSelectedIndex(null);

							if (event.target.value.length > 1) {
								SuggestionCaller.fetchSearchSuggestions(
									event.target.value,
									(data: { suggestions: Array<string> }) => {
										setSuggestions(
											[
												data.suggestions
													.slice(0, 5)
													.map((s) => s.toLowerCase())
													.includes(
														event.target.value.toLowerCase()
													)
													? null
													: event.target.value,
												...data.suggestions.slice(0, 5),
											].filter((e) => e !== null)
										);
									}
								);
							}
						}}
						onBlur={(e) =>
							e.target.setAttribute("readonly", "readonly")
						}
						onFocus={(e) => e.target.removeAttribute("readonly")}
						value={content}
						type="text"
						spellCheck="false"
						placeholder="Search"
						autoComplete="off"
						tabIndex={0}
						readOnly
						autoFocus
					/>
					<SearchIcon
						className={styles.icon}
						onClick={() =>
							SearchEngine.search(
								content,
								searchEngines[`i-${searchEngine}`].url,
								widget.open_with
							)
						}
					/>
				</div>
				<SearchSuggestions
					suggestions={suggestions}
					showing={suggestions.length > 0 && content.length > 1}
					selectedIndex={selectedIndex}
				/>
			</div>
		</WidgetMoverWrapper>
	);
}

export default {
	type: "searchbar",
	element: SearchBar as unknown as JSX.Element,
	metadata: {
		name: "Searchbar",
		author: "Aridevelopment.de",
		defaultComponent: true,
		removeableComponent: true,
		installableComponent: true,
	},
	headerSettings: {
		name: "Searchbar",
		type: "searchbar",
		option: {
			type: "toggle",
			default: true,
		},
	},
	contentSettings: [
		{
			name: "Search Engines",
			key: "search_engines",
			type: "accordion",
			options: {
				addable: true,
				description: [
					{
						key: "title",
						name: "Name",
						type: "input",
						options: {
							hidden: false,
							tooltip: "e.g. Google"
						}
					},
					{
						key: "url",
						name: "Search Engine URL",
						type: "input",
						options: {
							hidden: false,
							tooltip: "e.g. https://google.com/search?q="
						}
					},
					{
						key: "icon_url",
						name: "Icon URL",
						type: "input",
						options: {
							hidden: false,
							tooltip: "Preferably the favicon url"
						}
					}
				]
			}
		},
		{
			name: "Open With",
			key: "open_with",
			type: "dropdown",
			options: {
				values: ["Current Tab", "New Tab"],
				displayedValues: ["Current Tab", "New Tab"],
			} as IDropdownOptions,
		},
		{
			name: "When Autohiding",
			key: "auto_hide",
			type: "dropdown",
			options: {
				values: opacityValues,
				displayedValues: [
					"Show",
					"Hide",
					"Opacity 0.7",
					"Opacity 0.5",
					"Opacity 0.3",
				],
			} as IDropdownOptions,
		},
	],
} as KnownComponent;
