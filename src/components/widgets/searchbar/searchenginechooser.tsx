import { useClickOutside } from "@mantine/hooks";
import styles from "./searchenginechooser.module.css";

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

function SearchEngineChooser(props: {
	searchEngine: number;
	setSearchEngine: Function;
	onClose: Function;
}) {
	const ref = useClickOutside(() => props.onClose());

	return (
		<div className={styles.container} ref={ref}>
			{searchEngines.map((searchEngine, index) => {
				return (
					<div
						className={`${styles.item} ${
							index === props.searchEngine ? styles.active : ""
						}`}
						key={index}
						onClick={() => props.setSearchEngine(index)}
					>
						<div className={styles.icon}>
							<img
								src={`/icons/engines/${searchEngine?.toLowerCase()}.png`}
								alt={searchEngine}
							/>
						</div>
						<div>{searchEngine}</div>
					</div>
				);
			})}
		</div>
	);
}

export default SearchEngineChooser;
