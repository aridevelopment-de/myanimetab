import {
	Button,
	Center,
	Drawer,
	Group,
	Stack,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import FolderIcon from "@mui/icons-material/Folder";
import { useEffect, useState } from "react";
import { IFolder, metaDb } from "../../../../utils/db";

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
		},
		validate: {
			name: (value: string) =>
				value.trim() !== "" && value.trim().indexOf("/") === -1
					? null
					: "Name cannot be empty and cannot contain slashes",
		},
	});

	const [internalOpen, setInternalOpen] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => setInternalOpen(props.opened), 50);
	}, [props, props.opened]);

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
			title={`Editing ${props.file.name}`}
			padding="xl"
			size="xl"
		>
			<form
				/* @ts-ignore */
				onSubmit={form.onSubmit((values: { name: string }) => {
					metaDb
						.editFolder((props.file as IFolder).id, {
							name: values.name,
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
					<Center style={{ height: 120 }}>
						<FolderIcon
							style={{
								width: "100%",
								height: "100%",
								fill: theme.colors.blue[5],
							}}
						/>
					</Center>
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
