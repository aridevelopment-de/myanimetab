import { Button, Group, Menu, Modal, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState, useRef } from "react";
import { IImage, metaDb } from "../../../utils/db";
import Background from "./filetypes/background";
import Folder from "./filetypes/folder";
import styles from "./playlistsettingscomponent.module.css";
import TimeLine from "./timeline";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";

function PlaylistSettingsComponent(props: { bodyRef: any }) {
	const [addImageModalState, setAddImageModalState] =
		useState<boolean>(false);

	const [path, setPath] = useState<string>("/");
	const [images, setImages] = useState<IImage[]>([]);
	const [subFolders, setSubFolders] = useState<string[]>([]);
	const [draggedElement, setDraggedElement] = useState<IImage>();
	const menuRef = useRef<HTMLDivElement>();
	const [menuOpened, setMenuOpened] = useState<boolean>(false);

	useEffect(() => {
		metaDb.getImages(path).then(setImages);
		metaDb.getSubFolders(path).then(setSubFolders);
	}, [path]);

	useEffect(() => {
		const onContextMenu = (e: MouseEvent) => {
			e.preventDefault();

			if (menuRef.current !== undefined) {
				// set top and left of menuRef relative to bodyRef
				menuRef.current.style.top =
					e.clientY -
					props.bodyRef.current.getBoundingClientRect().top +
					"px";
				menuRef.current.style.left =
					e.clientX -
					100 -
					props.bodyRef.current.getBoundingClientRect().left +
					"px";
				setMenuOpened(true);
			}
		};

		props.bodyRef.current.addEventListener("contextmenu", onContextMenu);
		document.addEventListener("mouseup", (e: any) => {
			// check if target element contains data tag data-menu-aabc and is left click
			if (e.target.dataset.menuAabc === undefined && e.button === 0) {
				setMenuOpened(false);
			}
		});

		return () => {
			props.bodyRef.current.removeEventListener(
				"contextmenu",
				onContextMenu
			);
		};
	}, [props]);

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

		metaDb.addBulkImages(imagesToAdd);
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

			<div
				/* @ts-ignore */
				ref={menuRef}
				style={{ position: "absolute", width: "200px" }}
				data-menu-aabc={true}
			>
				<Menu width={200} opened={menuOpened} onChange={setMenuOpened}>
					<Menu.Dropdown>
						<Menu.Item
							icon={<ImageIcon />}
							onClick={() => setAddImageModalState(true)}
						>
							Add new Image
						</Menu.Item>
						<Menu.Item
							icon={<FolderIcon />}
							onClick={() => {
								metaDb.addFolder(path).then(() => {
									metaDb
										.getSubFolders(path)
										.then(setSubFolders);
								});
							}}
						>
							Create new Folder
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</div>

			{/* Image list */}
			<div className={styles.container}>
				<div
					className={`${styles.toolbar_hidden} ${
						path === "/" ? "" : styles.toolbar
					}`}
				>
					<TimeLine
						fullPath={path}
						onClick={setPath}
						draggedElement={draggedElement}
						onDroppedImage={(path: string) => {
							setDraggedElement(undefined);
							setPath(path);

							setTimeout(
								() => metaDb.getImages(path).then(setImages),
								50
							);
						}}
					/>
				</div>
				<div className={styles.images}>
					{subFolders.map((path: string) => (
						<Folder
							path={path}
							onClick={() => setPath(path)}
							draggedElement={draggedElement}
							onDroppedImage={() => {
								setDraggedElement(undefined);
								setPath(path);

								setTimeout(
									() =>
										metaDb.getImages(path).then(setImages),
									50
								);
							}}
							key={path}
						/>
					))}

					{images.map((image: IImage, index: number) => {
						return (
							<Background
								image={image}
								index={index}
								setDraggedElement={setDraggedElement}
								key={index}
							/>
						);
					})}

					{/* <div className={styles.dragdrop__container}>
						<div
							className={styles.dragdrop}
							onClick={() => setAddImageModalState(true)}
						>
							<div className={styles.dragdrop__text}>
								<p>+</p>
							</div>
						</div>
					</div> */}
				</div>
			</div>
		</>
	);
}

export default PlaylistSettingsComponent;
