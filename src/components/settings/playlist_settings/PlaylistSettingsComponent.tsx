import {
	Button,
	Group,
	Menu,
	Modal,
	Stack,
	Text,
	Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import { useEffect, useRef, useState } from "react";
import { IFolder, IImage, metaDb, ROOT_FOLDER } from "../../../utils/db";
import Background from "./filetypes/background";
import Folder from "./filetypes/folder";
import styles from "./playlistsettingscomponent.module.css";
import EditFolderDialog from "./subcomponents/editfolder";
import EditImageDialog from "./subcomponents/editimage";
import TimeLine from "./subcomponents/timeline";

function PlaylistSettingsComponent(props: { bodyRef: any }) {
	const [addImageModalState, setAddImageModalState] =
		useState<boolean>(false);

	const [currentFolder, setCurrentFolder] = useState<IFolder>(ROOT_FOLDER);
	const [images, setImages] = useState<IImage[]>([]);
	const [subFolders, setSubFolders] = useState<IFolder[]>([]);

	const [draggedElement, setDraggedElement] = useState<IImage>();
	const menuRef = useRef<HTMLDivElement>();

	const [menuOpened, setMenuOpened] = useState<boolean>(false);
	const [menuType, setMenuType] = useState<string>("");
	const [file, setFile] = useState<IImage | IFolder | undefined>();
	const [editImage, setEditImage] = useState<boolean>(false);
	const [editFolder, setEditFolder] = useState<boolean>(false);

	useEffect(() => {
		metaDb.getImages(currentFolder.id).then(setImages);
		metaDb.getSubFolders(currentFolder.id).then(setSubFolders);
	}, [currentFolder]);

	useEffect(() => {
		const onContextMenu = (e: MouseEvent) => {
			e.preventDefault();

			if (menuRef.current !== undefined) {
				setMenuType("null");
				setFile(undefined);

				if (e.target !== null && e.target instanceof HTMLElement) {
					if (e.target.dataset !== null) {
						if (
							e.target.dataset.contextFiletype !== undefined &&
							e.target.dataset.id !== undefined
						) {
							if (e.target.dataset.contextFiletype === "image") {
								metaDb
									.getImage(parseInt(e.target.dataset.id))
									.then(setFile);
							} else if (
								e.target.dataset.contextFiletype === "folder"
							) {
								metaDb
									.getFolder(parseInt(e.target.dataset.id))
									.then(setFile);
							}

							setMenuType(e.target.dataset.contextFiletype);
						} else {
							setMenuType("desktop");
						}
					}
				}

				// set top and left of menuRef relative to bodyRef
				menuRef.current.style.top =
					20 /* Offset to avoid bugs */ +
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

		setTimeout(
			() => metaDb.getImages(currentFolder.id).then(setImages),
			50
		);
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
								Add Image(s)
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>

			{editImage && menuType === "image" && file !== undefined ? (
				<EditImageDialog
					opened={editImage}
					setOpened={setEditImage}
					file={file as IImage}
					update={() =>
						metaDb.getImages(currentFolder.id).then(setImages)
					}
				/>
			) : null}

			{editFolder && menuType === "folder" && file !== undefined ? (
				<EditFolderDialog
					opened={editFolder}
					setOpened={setEditFolder}
					file={file as IFolder}
					update={() =>
						metaDb
							.getSubFolders(currentFolder.id)
							.then(setSubFolders)
					}
				/>
			) : null}

			{/* Context menus */}
			<div
				/* @ts-ignore */
				ref={menuRef}
				style={{ position: "absolute", width: "200px" }}
				data-menu-aabc={true}
			>
				<Menu width={200} opened={menuOpened} onChange={setMenuOpened}>
					<Menu.Dropdown>
						{menuType === "image" && file !== undefined ? (
							/* Image context menu */
							<>
								<Menu.Label>{(file as IImage).name}</Menu.Label>
								<Menu.Item onClick={() => setEditImage(true)}>
									Edit
								</Menu.Item>
								<Menu.Item>View</Menu.Item>
								<Menu.Item>Move into</Menu.Item>
								<Menu.Item
									color="red"
									onClick={() => {
										metaDb.removeImage(file.id);
										metaDb
											.getImages(currentFolder.id)
											.then(setImages);
									}}
								>
									Delete
								</Menu.Item>
							</>
						) : menuType === "folder" && file !== undefined ? (
							/* Folder context menu */
							<>
								<Menu.Label>
									{(file as IFolder).name}
								</Menu.Label>
								<Menu.Item onClick={() => setEditFolder(true)}>
									Edit
								</Menu.Item>
								<Menu.Item color="red">Delete</Menu.Item>
							</>
						) : menuType === "desktop" ? (
							/* Normal context menu */
							<>
								<Menu.Item
									icon={<ImageIcon />}
									onClick={() => setAddImageModalState(true)}
								>
									Add new Image
								</Menu.Item>
								<Menu.Item
									icon={<FolderIcon />}
									onClick={() => {
										metaDb
											.addFolder({
												parent: currentFolder.id,
											})
											.then(() =>
												metaDb
													.getSubFolders(
														currentFolder.id
													)
													.then(setSubFolders)
											);
									}}
								>
									Create new Folder
								</Menu.Item>
							</>
						) : null}
					</Menu.Dropdown>
				</Menu>
			</div>

			{/* Image list */}
			<div className={styles.container}>
				<div
					className={`${styles.toolbar_hidden} ${
						currentFolder.id === ROOT_FOLDER.id
							? ""
							: styles.toolbar
					}`}
				>
					<TimeLine
						folder={currentFolder}
						onClick={setCurrentFolder}
						draggedElement={draggedElement}
						onDroppedImage={(folder: IFolder) => {
							setDraggedElement(undefined);
							setCurrentFolder(folder);

							setTimeout(
								() =>
									metaDb.getImages(folder.id).then(setImages),
								50
							);
						}}
					/>
				</div>
				<div className={styles.images}>
					{subFolders.map((folder: IFolder) => (
						<Folder
							folder={folder}
							onClick={() => setCurrentFolder(folder)}
							draggedElement={draggedElement}
							onDroppedImage={() => {
								setDraggedElement(undefined);
								setCurrentFolder(folder);

								setTimeout(
									() =>
										metaDb
											.getImages(folder.id)
											.then(setImages),
									50
								);
							}}
							key={folder.id}
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
				</div>
				{images.length === 0 && subFolders.length === 0 ? (
					<Text color="dimmed">
						Seems empty here. Add new images or folders by
						right-clicking on the menu
					</Text>
				) : null}
			</div>
		</>
	);
}

export default PlaylistSettingsComponent;
