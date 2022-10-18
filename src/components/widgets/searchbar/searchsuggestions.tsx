import SearchEngine from "../../../utils/searchengine";
import styles from "./searchsuggestion.module.css";

function SearchSuggestions(props: {
	suggestions: Array<string>;
	showing: boolean;
	selectedIndex: number | null;
}) {
	return (
		<div
			className={`${styles.wrapper} ${
				props.showing ? "" : styles.invisible
			}`}
		>
			<div className={styles.suggestions}>
				{props.suggestions.map((element, idx) => (
					<div
						className={`${styles.item__wrapper} ${props.selectedIndex === idx ? styles.selected : ""}`}
						key={element}
						// @ts-ignore
						onClick={(e) => SearchEngine.search(e.target.innerHTML)}
						tabIndex={0}
					>
						<p>{element}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default SearchSuggestions;
