import { useClickOutside } from "@mantine/hooks";
import styles from "./searchenginechooser.module.css";


function SearchEngineChooser(props: {
	searchEngine: number;
	searchEngines: {[id: string]: {title: string, url: string, icon_url: string}};
	setSearchEngine: Function;
	onClose: Function;
}) {
	const ref = useClickOutside(() => props.onClose());

	return (
		<div className={styles.container} ref={ref}>
			{Object.keys(props.searchEngines).map((id: string) => {
				return (
					<div
						className={`${styles.item} ${
							id === "i-" + props.searchEngine ? styles.active : ""
						}`}
						key={id}
						onClick={() => props.setSearchEngine(id.split("-")[1])}
					>
						<div className={styles.icon}>
							<img
								src={props.searchEngines[id].icon_url}
								alt={props.searchEngines[id].title}
							/>
						</div>
						<div>{props.searchEngines[id].title}</div>
					</div>
				);
			})}
		</div>
	);
}

export default SearchEngineChooser;
