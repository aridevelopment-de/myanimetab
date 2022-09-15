import {
	Button,
	Center,
	ColorPicker,
	Drawer,
	Group,
	Stack,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IFolder, metaDb, ROOT_FOLDER } from "../../../../utils/db";
import Folder from "../filetypes/folder";

const EditFolderDialog = (props: {
	opened: boolean;
	setOpened: Function;
	file: IFolder | undefined;
	update: Function;
}) => {
	const theme = useMantineTheme();
	const form = useForm({
		initialValues: {
			name: ((props.file as IFolder) || { name: "" }).name
				.split("/")
				.pop(),
			color:
				((props.file as IFolder) || { color: theme.colors.blue[5] })
					.color || theme.colors.blue[5],
		},
		validate: {
			name: (value: string) =>
				value.trim() !== "" && value.trim().indexOf("/") === -1
					? null
					: "Name cannot be empty and cannot contain slashes",
			color: (value: string) =>
				value.trim() !== "" ? null : "Color cannot be empty",
		},
	});

	const [internalOpen, setInternalOpen] = useState<boolean>(false);
	const [previewFolder, setPreviewFolder] = useState<IFolder>(
		props.file || ROOT_FOLDER
	);

	useEffect(() => {
		setTimeout(() => setInternalOpen(props.opened), 50);
	}, [props, props.opened]);

	useEffect(() => {
		setPreviewFolder({
			...props.file,
			name: form.values.name as string,
			color: form.values.color as string,
		} as IFolder);
	}, [form.values, props.file]);

	if (props.file === undefined) {
		return null;
	}

	return (
		<Drawer
			opened={internalOpen}
			position="right"
			onClose={() => {
				setInternalOpen(false);
				props.setOpened(false);
			}}
			title={`Editing ${previewFolder.name}`}
			padding="xl"
			size="xl"
		>
			<form
				/* @ts-ignore */
				onSubmit={form.onSubmit((values: { name: any; color: any }) => {
					metaDb
						.editFolder((props.file as IFolder).id, {
							name: values.name,
							color: values.color,
						})
						.then(() => {
							showNotification({
								title: "Updated folder information",
								message: undefined,
							});
							props.setOpened(false);
							props.update();
						});
				})}
			>
				<Stack spacing="md">
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "10px",
						}}
					>
						<Center>
							<ColorPicker
								swatches={[
									theme.colors.red[5],
									theme.colors.pink[5],
									theme.colors.grape[5],
									theme.colors.violet[5],
									theme.colors.indigo[5],
									theme.colors.blue[5],
									theme.colors.cyan[5],
									theme.colors.teal[5],
									theme.colors.green[5],
									theme.colors.lime[5],
									theme.colors.yellow[5],
									theme.colors.orange[5],
									theme.colors.gray[5],
								]}
								{...form.getInputProps("color", {
									type: "input",
								})}
							/>
						</Center>
						<Center>
							<Folder
								folder={previewFolder}
								draggedElement={undefined}
								onDroppedImage={() => {}}
							/>
						</Center>
					</div>
					<TextInput
						placeholder="Enter name of the folder"
						label="Name of the folder"
						withAsterisk
						required
						{...form.getInputProps("name", {
							type: "input",
						})}
					/>
					<Group position="right">
						<Button type="submit">Save</Button>
					</Group>
				</Stack>
			</form>
		</Drawer>
	);
};

export default EditFolderDialog;
