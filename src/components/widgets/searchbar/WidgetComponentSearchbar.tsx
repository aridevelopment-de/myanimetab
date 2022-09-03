/* eslint-disable @typescript-eslint/no-unused-vars */
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useSetting } from "../../../utils/eventhooks";
import { KnownComponent } from "../../../utils/registry/types";
import SearchEngine from "../../../utils/searchengine";
import SuggestionCaller from "../../../utils/searchsuggestioncaller";
import styles from "./searchbar.module.css";
import SearchEngineChooser from "./searchenginechooser";
import SearchSuggestions from "./searchsuggestions";

const opacityValues = [1, 0, 0.7, 0.5, 0.3];
const verticalAlignValues = [styles.two, styles.one];
const searchEngines = [
	"Google",
	"Bing",
	"Ecosia",
	"Yahoo",
	"DuckDuckGo",
	"Baidu",
	"Ask",
	"WolframAlpha",
];

function SearchBar(props: { blur: boolean; id: string }) {
	const [position, _1] = useSetting(props.id, "vertical_align");
	const [searchEngine, setSearchEngine] = useSetting(
		props.id,
		"search_engine"
	);
	const [openWith, _2] = useSetting(props.id, "open_with");
	const [autoHideValue, _3] = useSetting(props.id, "auto_hide");
	const [modalChooseEngine, setModalChooseEngine] = useState<boolean>(false);
	const [suggestions, setSuggestions] = useState<Array<string>>([]);
	const [content, setContent] = useState<string>("");

	if (position === undefined) return <></>;

	return (
		<div className={`${styles.wrapper} ${verticalAlignValues[position]}`}>
			<div
				className={`${styles.searchbar} widget`}
				style={{
					opacity: props.blur ? opacityValues[autoHideValue] : 1,
				}}
			>
				<div>
					<div
						className={styles.engine_icon__container}
						onClick={() => setModalChooseEngine(!modalChooseEngine)}
					>
						<img
							className={styles.engine_icon}
							src={`/icons/engines/${searchEngines[
								searchEngine
							]?.toLowerCase()}.png`}
							alt={searchEngines[searchEngine]}
						/>
					</div>
					{modalChooseEngine ? (
						<SearchEngineChooser
							searchEngine={searchEngine}
							setSearchEngine={(idx: number) => {
								setSearchEngine(idx);
								setModalChooseEngine(false);
							}}
						/>
					) : null}
				</div>
				<input
					className={styles.input}
					onKeyUp={(e) => {
						if (e.keyCode === 13) {
							SearchEngine.search(
								// @ts-ignore
								e.target.value,
								searchEngine,
								openWith
							);
						}
					}}
					onInput={(event) => {
						// @ts-ignore
						setContent(event.target.value);

						// @ts-ignore
						if (event.target.value.length > 1) {
							SuggestionCaller.fetchSearchSuggestions(
								// @ts-ignore
								event.target.value,
								(data: { suggestions: Array<string> }) => {
									setSuggestions(
										data.suggestions.slice(0, 5)
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
						SearchEngine.search(content, searchEngine, openWith)
					}
				/>
			</div>
			<SearchSuggestions
				suggestions={suggestions}
				showing={suggestions.length > 0 && content.length > 1}
			/>
		</div>
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
			name: "Search Engine",
			key: "search_engine",
			type: "dropdown",
			values: searchEngines,
			displayedValues: [
				"Google",
				"Bing",
				"Ecosia",
				"Yahoo",
				"DuckDuckGo",
				"Baidu",
				"Ask",
				"WolframAlpha",
			],
		},
		{
			name: "Open With",
			key: "open_with",
			type: "dropdown",
			values: ["Current Tab", "New Tab"],
			displayedValues: ["Current Tab", "New Tab"],
		},
		{
			name: "When Autohiding",
			key: "auto_hide",
			type: "dropdown",
			values: opacityValues,
			displayedValues: [
				"Show",
				"Hide",
				"Opacity 0.7",
				"Opacity 0.5",
				"Opacity 0.3",
			],
		},
		{
			name: "Vertical Alignment",
			key: "vertical_align",
			type: "dropdown",
			values: verticalAlignValues,
			displayedValues: ["Upper half", "Screen top"],
		},
	],
} as KnownComponent;
