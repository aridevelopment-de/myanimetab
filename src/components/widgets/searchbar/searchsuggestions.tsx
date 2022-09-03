import SearchEngine from "../../../utils/searchengine";
import styles from "./searchsuggestion.module.css";

function SearchSuggestions(props: {
	suggestions: Array<string>;
	showing: boolean;
}) {
	return (
		<div
			className={`${styles.wrapper} ${
				props.showing ? "" : styles.invisible
			}`}
		>
			<div className={styles.suggestions}>
				{props.suggestions.map((element) => (
					<div
						className={styles.item__wrapper}
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
