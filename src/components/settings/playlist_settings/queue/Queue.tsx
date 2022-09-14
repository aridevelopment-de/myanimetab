import {
	ActionIcon,
	Button,
	Drawer,
	Group,
	Modal,
	Space,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import FolderOpen from "@mui/icons-material/FolderOpen";
import Settings from "@mui/icons-material/Settings";
import { useLiveQuery } from "dexie-react-hooks";
import { useState, useRef } from "react";
import { IImage, IQueue, metaDb, useMeta } from "../../../../utils/db";
import styles from "./queue.module.css";
import MinimizeIcon from "@mui/icons-material/Minimize";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import EventHandler from "../../../../utils/eventhandler";
import { useForm } from "@mantine/form";

const Queue = () => {
	const qid = useMeta("selected_queue");
	const cImage = useMeta("selected_image");

	const currentQueue = useLiveQuery(async () => {
		const currentQueue = await metaDb.meta.get("selected_queue");

		if (currentQueue !== undefined && currentQueue.value !== null) {
			return await metaDb.queues.get(currentQueue.value);
		}
	});

	const images = useLiveQuery(async () => {
		const currentQueue = await metaDb.meta.get("selected_queue");

		if (currentQueue !== undefined && currentQueue.value !== null) {
			const queue = await metaDb.queues.get(currentQueue.value);

			if (queue !== undefined) {
				return (await metaDb.images.bulkGet(queue.images)) || [];
			}
		}

		return [];
	});

	const [queueManagerOpened, setQueueManagerOpened] =
		useState<boolean>(false);
	const [minimized, setMinimized] = useState<boolean>(false);

	return (
		<>
			<div
				className={styles.container}
				style={{
					padding: minimized ? "3px 1em" : undefined,
				}}
			>
				<header
					className={styles.header}
					style={{
						marginBottom: minimized ? "0px" : undefined,
					}}
				>
					<span>
						{currentQueue !== undefined
							? `${currentQueue.name} (${(images || []).length})`
							: "Queue"}
					</span>
					<div className={styles.toolbar}>
						<ActionIcon onClick={() => setQueueManagerOpened(true)}>
							<FolderOpen />
						</ActionIcon>
						{minimized ? (
							<ActionIcon onClick={() => setMinimized(false)}>
								<FullscreenIcon />
							</ActionIcon>
						) : (
							<ActionIcon onClick={() => setMinimized(true)}>
								<MinimizeIcon />
							</ActionIcon>
						)}
					</div>
				</header>
				{!minimized && (
					<main className={styles.main}>
						{qid === undefined || qid === null ? (
							<Text color="dimmed">No queue selected.</Text>
						) : images !== undefined && images.length > 0 ? (
							(images as unknown as IImage[]).map(
								(image: IImage, index: number) => {
									return (
										<div
											className={styles.image}
											key={index}
											style={{
												border:
													cImage === image.id
														? "3px solid var(--mantine-color-blue-5)"
														: undefined,
											}}
										>
											<img
												src={image.url}
												alt={"Queue"}
												onClick={() =>
													metaDb.setMeta(
														"selected_image",
														image.id
													)
												}
											/>
											<ActionIcon
												className={styles.clear_button}
												color="red"
												variant="transparent"
												onClick={() => {
													metaDb.removeImageFromQueue(
														qid,
														image
													);

													EventHandler.emit(
														"queue.removeImage",
														{ value: image.id }
													);
												}}
											>
												<ClearIcon
													sx={{
														fontSize: "19px",
													}}
													className={
														styles.clear_icon
													}
												/>
											</ActionIcon>
										</div>
									);
								}
							)
						) : (
							<Text color="dimmed">
								The queue doesn't contain any images
							</Text>
						)}
					</main>
				)}
			</div>

			{/* Queue list drawer */}
			<Drawer
				opened={queueManagerOpened}
				position="right"
				onClose={() => setQueueManagerOpened(false)}
				title="Manage your image queues"
				padding="xl"
				size="xl"
			>
				<QueueList />
			</Drawer>
		</>
	);
};

const QueueList = () => {
	const queues = useLiveQuery(() => metaDb.queues.toArray() || []);

	return (
		<>
			<Space h="md" />
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<Button
					leftIcon={<AddIcon />}
					onClick={() => metaDb.addQueue()}
				>
					Create Queue
				</Button>
			</div>
			<Space h="lg" />
			<Stack spacing="xs">
				{queues &&
					(queues as unknown as IQueue[]).map((queue: IQueue) => (
						<QueueListEntry queue={queue} key={queue.id} />
					))}
			</Stack>
		</>
	);
};

const QueueListEntry = (props: { queue: IQueue }) => {
	const toolbarHovered = useRef<boolean>(false);
	const currentQid = useMeta("selected_queue");

	const [editQueue, setEditQueue] = useState<IQueue | null>(null);
	const editQueueForm = useForm({
		initialValues: {
			name: "",
		},
		validate: {
			name: (value) =>
				value.length > 0 ? null : "Queue name cannot be empty",
		},
	});

	return (
		<>
			<div
				className={styles.list__queue}
				style={{
					border:
						currentQid === props.queue.id
							? "1px solid var(--mantine-color-blue-5)"
							: "none",
				}}
				onClick={() => {
					toolbarHovered.current
						? void 0
						: metaDb.setMeta("selected_queue", props.queue.id);
				}}
			>
				<span>
					{props.queue.name} ({props.queue.images.length})
				</span>
				<Group
					position="right"
					spacing="xs"
					onMouseEnter={() => (toolbarHovered.current = true)}
					onMouseLeave={() => (toolbarHovered.current = false)}
				>
					<ActionIcon
						onClick={() => {
							editQueueForm.setFieldValue(
								"name",
								props.queue.name
							);
							setEditQueue(props.queue);
						}}
					>
						<Settings />
					</ActionIcon>
					<ActionIcon
						onClick={() => {
							metaDb.deleteQueue(props.queue.id);
							metaDb.setMeta("selected_queue", null);
						}}
					>
						<ClearIcon />
					</ActionIcon>
				</Group>
			</div>

			{/* Edit queue drawer */}
			<Drawer
				position="right"
				opened={editQueue !== null}
				onClose={() => setEditQueue(null)}
				padding="xl"
				size="xl"
				title="Editing queue information"
			>
				<form
					onSubmit={editQueueForm.onSubmit((values, event) => {
						metaDb.editQueue(editQueue!.id, { name: values.name });
						setEditQueue(null);
					})}
				>
					<Stack>
						<TextInput
							placeholder="Enter name of queue"
							label="Name of Queue"
							withAsterisk
							{...editQueueForm.getInputProps("name", {
								type: "input",
							})}
						/>
						<Group position="right">
							<Button type="submit">Save</Button>
						</Group>
					</Stack>
				</form>
			</Drawer>
		</>
	);
};

export default Queue;
