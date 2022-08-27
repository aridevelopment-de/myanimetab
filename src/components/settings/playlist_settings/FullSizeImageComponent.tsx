import CloseIcon from "@mui/icons-material/Close";
import EventHandler from "../../../utils/eventhandler";
import styles from "./fullsizedimagecomponent.module.css";

function ZoomedImage(props: { url: string }) {
	return (
		<div className={styles.container}>
			<div className={styles.inner}>
				<div className={styles.image}>
					<img src={props.url} alt="" />
					<footer className="zoomed_image__footer">
						<button onClick={() => {}}>
							<CloseIcon />
						</button>
					</footer>
				</div>
			</div>
		</div>
	);
}

export default ZoomedImage;
