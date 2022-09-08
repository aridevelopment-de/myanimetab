import { Button, Drawer, Group, Image, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IImage, metaDb } from "../../../../utils/db";
import { useState, useEffect } from "react";

const EditImageDialog = (props: {
	opened: boolean;
	setOpened: Function;
	file: IImage | undefined;
	update: Function;
}) => {
	const form = useForm({
		initialValues: {
			name: ((props.file as IImage) || { name: "" }).name,
		},
		validate: {
			name: (value) =>
				value.trim() !== "" ? null : "Name cannot be empty",
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
				onSubmit={form.onSubmit((values: { name: string }) => {
					metaDb
						.editImage((props.file as IImage).id, {
							name: values.name,
						})
						.then(() => {
							showNotification({
								title: "Updated image information",
								message: undefined,
							});
							props.setOpened(false);
							props.update();
						});
				})}
			>
				<Stack spacing="md">
					<Image radius="sm" src={props.file.url} alt="Background" />
					<TextInput
						placeholder="Enter name of the image"
						label="Name of the image"
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

export default EditImageDialog;
