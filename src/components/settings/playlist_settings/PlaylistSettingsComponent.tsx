// @ts-nocheck
import {
	Button,
	Group,
	Menu,
	Modal,
	Stack,
	Text,
	Textarea
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import { UIEventHandler, useEffect, useRef, useState } from "react";
import {
	IFolder,
	IImage,
	metaDb,
	ROOT_FOLDER,
	useMeta
} from "../../../utils/db";
import { useSearch } from "../../../utils/use-search";
import Background from "./filetypes/background";
import Folder from "./filetypes/folder";
import styles from "./playlistsettingscomponent.module.css";
import Queue from "./queue/Queue";
import EditFolderDialog from "./subcomponents/editfolder";
import EditImageDialog from "./subcomponents/editimage";
import TimeLine from "./subcomponents/timeline";

function PlaylistSettingsComponent(props: { bodyRef: any }) {
	const [addImageModalState, setAddImageModalState] =
		useState<boolean>(false);

	const [images, setImages] = useState<IImage[]>([]);

	const currentImageId = useMeta("selected_image");
	const [currentFolder, setCurrentFolder] = useState<IFolder>(ROOT_FOLDER);
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

		metaDb.addBulkImages(imagesToAdd, currentFolder);
		setAddImageModalState(false);

		setTimeout(
			() => metaDb.getImages(currentFolder.id).then(setImages),
			50
		);
	};

	const getImagesRecur = async (folder: IFolder) => {
		const rootSubFolders = await metaDb.getSubFolders(folder.id);
		const subImages = await metaDb.getImages(folder.id);

		let imageCollection: IImage[] = [];
		imageCollection = imageCollection.concat(subImages);

		if (rootSubFolders.length > 0) {
			for (let i = 0; i < rootSubFolders.length; i++) {
				const subFolderImages = await getImagesRecur(rootSubFolders[i]);
				imageCollection = imageCollection.concat(subFolderImages);
			}
			return imageCollection;
		}

		return imageCollection;
	};

	const [searchbarValue, setSearchbarValue] = useState<string>("");
	const { results, search } = useSearch("", setSearchbarValue);

	const inputHandler: UIEventHandler = async (e) => {
		setSearchbarValue((e.target as HTMLInputElement).value);
		await search((e.target as HTMLInputElement).value);
	};

	return (
		<>
			{/* Additional add image button for playlist tab*/}
			<div className={styles.toolbar_container}>
				<input
					onInput={inputHandler}
					type="text"
					spellCheck="false"
					placeholder="Enter Keywords"
					autoComplete="off"
				/>
				<Button
					variant="outline"
					color="gray"
					onClick={() => {
						setAddImageModalState(!addImageModalState);
					}}
				>
					+
				</Button>
			</div>
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
								<Menu.Item
									color="red"
									onClick={() => {
										metaDb.removeImage(file.id).then(() => {
											metaDb
												.getImages(currentFolder.id)
												.then(setImages);
										});
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
								<Menu.Item
									color="red"
									onClick={() => {
										metaDb
											.removeFolder(file as IFolder)
											.then((_: any) => {
												metaDb
													.getSubFolders(
														currentFolder.id
													)
													.then(setSubFolders);
												metaDb
													.getImages(currentFolder.id)
													.then(setImages);
												showNotification({
													title: "Folder deleted",
													message:
														"Folder has been deleted and every file in it has been moved to the parent folder",
												});
											});
									}}
								>
									Delete
								</Menu.Item>
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

							setTimeout(
								() =>
									metaDb
										.getImages(currentFolder.id)
										.then(setImages),
								50
							);
						}}
					/>
				</div>
				<div className={styles.images}>
					{subFolders.map((folder: IFolder) => {
						if (searchbarValue.trim() === "") {
							return (
								<Folder
									folder={folder}
									onClick={() => setCurrentFolder(folder)}
									draggedElement={draggedElement}
									onDroppedImage={() => {
										setDraggedElement(undefined);
										setCurrentFolder(currentFolder);
										setTimeout(
											() =>
												metaDb
													.getImages(currentFolder.id)
													.then(setImages),
											50
										);
									}}
									key={folder.id}
								/>
							);
						}

						// if (containsStringFolder(searchbarValue, folder)) {
						// 	return (
						// 		<Folder
						// 			folder={folder}
						// 			onClick={() => setCurrentFolder(folder)}
						// 			draggedElement={draggedElement}
						// 			onDroppedImage={() => {
						// 				setDraggedElement(undefined);
						// 				setCurrentFolder(currentFolder);

						// 				setTimeout(
						// 					() =>
						// 						metaDb
						// 							.getImages(currentFolder.id)
						// 							.then(setImages),
						// 					50
						// 				);
						// 			}}
						// 			key={folder.id}
						// 		/>
						// 	);
						// }
					})}
					{images.map((image: IImage, index: number) => {
						if (searchbarValue.trim() === "") {
							return (
								<Background
									selected={currentImageId === image.id}
									image={image}
									index={index}
									setDraggedElement={setDraggedElement}
									key={index}
								/>
							);
						}
					})}
					{results.map((image: IImage, index: number) => {
						return (
							<>
								{
									<Background
										selected={false}
										image={image}
										index={index}
										setDraggedElement={setDraggedElement}
										key={index}
									/>
								}
							</>
						);
					})}
				</div>
				{images.length === 0 && subFolders.length === 0 ? (
					<Text color="dimmed">
						Seems empty here. Add new images or folders by
						right-clicking on the menu
					</Text>
				) : null}
				<Queue />
			</div>
		</>
	);
}

export default PlaylistSettingsComponent;
