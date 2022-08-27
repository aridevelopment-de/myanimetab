import {
	Button,
	Group,
	Image,
	Modal,
	Space,
	Stack,
	Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useState } from "react";
import { metaDb, useMeta } from "../../../utils/db";
import EventHandler from "../../../utils/eventhandler";
import image_styles from "./imagestyles.module.css";
import styles from "./playlistsettingscomponent.module.css";

function DisplayedImage(props: {
	url: string;
	idx: number;
	selectedIdx: number;
	resizeClickCallback: Function;
	deleteClickCallback: Function;
	disabled: boolean;
}) {
	const onImageClick = () => {
		if (props.idx !== props.selectedIdx) {
			metaDb.setMeta("selected_image", props.idx);
			EventHandler.emit("select_image", { idx: props.idx });
			EventHandler.emit("playlist_refresh", null);
		}
	};

	return (
		<div
			className={`${image_styles.image} ${
				props.idx === props.selectedIdx ? image_styles.selected : ""
			}`}
		>
			<img src={props.url} alt={`${props.idx}`} onClick={onImageClick} />
			<div>
				<div className={image_styles.overlay_buttons}>
					<div
						className={image_styles.overlay__button}
						onClick={() => props.resizeClickCallback(props.idx)}
					>
						<FullscreenIcon />
					</div>
					<div
						className={`${image_styles.overlay__button} ${
							props.disabled === true ? image_styles.disabled : ""
						}`}
						onClick={() => {
							if (props.disabled === false) {
								props.deleteClickCallback(props.idx);
							}
						}}
					>
						<DeleteIcon />
					</div>
				</div>
			</div>
		</div>
	);
}

function PlaylistSettingsComponent(props: {}) {
	const images = useMeta("images");
	const [addImageModalState, setAddImageModalState] =
		useState<boolean>(false);
	const selectedIdx = useMeta("selected_image");

	const [fullScreenModalState, setFullScreenModalState] =
		useState<boolean>(false);
	const [fullScreenIdx, setFullScreenIdx] = useState<number>();

	const addImageForm = useForm({
		initialValues: {
			images: "",
		},
		validate: {
			images: (value: string) => {
				value = value.trim();

				if (value.length === 0) {
					return "Please enter at least one image URL";
				}

				return null;
			},
		},
	});

	const addImage = (
		values: { images: string },
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		const imagesToAdd = values.images
			.split(",")
			.map((url: string) => url.trim());

		metaDb.setMeta("images", [...images, ...imagesToAdd]);
		setAddImageModalState(false);
	};

	return (
		<>
			{/* Add Image Modal */}
			<Modal
				opened={addImageModalState}
				onClose={() => setAddImageModalState(false)}
				title="Add Image"
			>
				<form onSubmit={addImageForm.onSubmit(addImage)}>
					<Stack>
						<Textarea
							placeholder="e.g. https://i.imgur.com/0X0X0X0.png, https://i.imgur.com/1X1X1X1.png"
							label="Add images via url"
							description="Enter one or multiple image urls (comma seperated)"
							required
							{...addImageForm.getInputProps("images", {
								type: "input",
							})}
						/>
						<Group position="right">
							<Button
								variant="outline"
								color="gray"
								onClick={() => setAddImageModalState(false)}
							>
								Cancel
							</Button>
							<Button color="green" type="submit">
								Add Images
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>

			{/* Fullscreen image modal */}
			<Modal
				opened={fullScreenModalState}
				onClose={() => {
					setFullScreenModalState(false);
					setFullScreenIdx(undefined);
				}}
				centered
				size="max-content"
			>
				{fullScreenIdx !== undefined ? (
					<>
						<Image
							radius="md"
							src={images[fullScreenIdx]}
							alt="Image in Fullscreen"
							caption={
								<a href={images[fullScreenIdx]}>
									{images[fullScreenIdx]}
								</a>
							}
							width={window.innerWidth * 0.5}
							height={window.innerHeight * 0.5}
						/>
						<Space h="xl" />
					</>
				) : null}
			</Modal>

			{/* Image list */}
			<div className={styles.images}>
				{(images || []).map((image: string, index: number) => {
					return (
						<DisplayedImage
							url={image}
							key={index}
							idx={index}
							disabled={index === 0 && images.length === 1}
							selectedIdx={selectedIdx}
							resizeClickCallback={(idx: number) => {
								setFullScreenIdx(idx);
								setFullScreenModalState(true);
							}}
							deleteClickCallback={(idx: number) => {
								images.splice(idx, 1);
								metaDb.setMeta("images", images);
								metaDb.setMeta(
									"selected_image",
									Math.max(0, idx - 1)
								);
							}}
						/>
					);
				})}

				<div className={styles.dragdrop__container}>
					<div
						className={styles.dragdrop}
						onClick={() => setAddImageModalState(true)}
					>
						<div className={styles.dragdrop__text}>
							<p>+</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default PlaylistSettingsComponent;
