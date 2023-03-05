import {
	ActionIcon,
	Button,
	Code,
	Drawer,
	Group,
	NativeSelect,
	Space,
	Stack,
	Switch,
	Text,
	TextInput,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import FolderOpen from "@mui/icons-material/FolderOpen";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import MinimizeIcon from "@mui/icons-material/Minimize";
import Settings from "@mui/icons-material/Settings";
import { useLiveQuery } from "dexie-react-hooks";
import { useRef, useState } from "react";
import { downloadContent } from "../../../../utils/browserutils";
import { IImage, IQueue, metaDb, useMeta } from "../../../../utils/db";
import EventHandler, { EventType } from "../../../../utils/eventhandler";
import styles from "./queue.module.css";

const Queue = () => {
	const [qid, _1] = useMeta("selected_queue");
	const [cImage, _2] = useMeta("selected_image");

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
						<ActionIcon
							onClick={async () => {
								// export metaDb.queues, metaDb.images and metaDb.folders
								// to a json file
								const data = {
									copy_the_value_inside_the_quotation_marks_and_paste_it_into_the_image_add_menu:
										(await metaDb.images.toArray())
											.map((image: IImage) => image.url)
											.join(", "),
									queues: await metaDb.queues.toArray(),
									images: await metaDb.images.toArray(),
									folders: await metaDb.folders.toArray(),
								};

								downloadContent(
									"export.json",
									JSON.stringify(data)
								);
							}}
						>
							<DownloadIcon />
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
														EventType.QUEUE_REMOVE_IMAGE,
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
	const [timedQueuesActive, setTimedQueuesActive] = useMeta("should_switch_queue");
	const [defaultQueue, setDefaultQueue] = useMeta("default_queue");
	
	return (
		<>
			<Space h="md" />
			<div
				style={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Stack spacing="xs" style={{width: "100%"}}>
					<Switch
						label="Activate timed queues"
						checked={timedQueuesActive}
						onChange={(event) => setTimedQueuesActive(event.currentTarget.checked)}
					/>
					<div style={{
						display: "flex",
						alignItems: "flex-end",
						justifyContent: "space-between",
						width: "100%"
					}}>
						<NativeSelect
							data={queues ? queues.map(q => ({value: String(q.id), label: q.name})) : []}
							label="Default queue when no other is active"
							value={String(defaultQueue)}
							onChange={(event) => setDefaultQueue(Number(event.currentTarget.value))}
							disabled={!timedQueuesActive}
						/>
					<Button
						leftIcon={<AddIcon />}
						onClick={() => metaDb.addQueue()}
					>
						Create Queue
					</Button>
					</div>
				</Stack>
			</div>
			<Space h="lg" />
			<Stack
				spacing="xs"
				style={{
					overflowY: "auto",
				}}
			>
				{queues &&
					(queues as unknown as IQueue[]).map((queue: IQueue) => (
						<QueueListEntry queue={queue} key={queue.id} />
					))}
				{queues && queues.length === 0 && (
					<Text color="dimmed">
						You don't have any queues yet. Create one by clicking
						the button above.
					</Text>
				)}
			</Stack>
		</>
	);
};

const QueueListEntry = (props: { queue: IQueue }) => {
	const toolbarHovered = useRef<boolean>(false);
	const [currentQid, _1] = useMeta("selected_queue");

	const [editQueue, setEditQueue] = useState<IQueue | null>(null);

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
				{props.queue.timed && (
					<Code color="blue" style={{marginLeft: "1em"}}>
						{props.queue.from} - {props.queue.to}
					</Code>
				)}
				<Group
					position="right"
					spacing="xs"
					onMouseEnter={() => (toolbarHovered.current = true)}
					onMouseLeave={() => (toolbarHovered.current = false)}
					style={{marginLeft: "auto"}}
				>
					<ActionIcon
						onClick={() => {
							setEditQueue(props.queue);
						}}
					>
						<Settings />
					</ActionIcon>
					<ActionIcon
						onClick={() => {
							metaDb.deleteQueue(props.queue.id);
							// get amount of queues from metaDb.queues
							// if 0, set selected_queue to null
							// else, set selected_queue to first queue
							metaDb.queues.count().then((count) => {
								if (count === 0) {
									metaDb.setMeta("selected_queue", null);
									metaDb.setMeta("default_queue", null);
								} else {
									metaDb.queues.toArray().then((queues) => {
										metaDb.setMeta(
											"selected_queue",
											queues[0].id
										);

										metaDb.setMeta(
											"default_queue",
											queues[0].id
										);
									});
								}
							});
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
				<EditQueueDrawer
					editQueue={editQueue}
					setEditQueue={setEditQueue}
				/>
			</Drawer>
		</>
	);
};

const EditQueueDrawer = (props: {
	editQueue: IQueue | null;
	setEditQueue: Function;
}) => {
	const editQueueForm = useForm({
		initialValues: {
			name: props.editQueue?.name || "",
			timed: props.editQueue?.timed || false,
			startHour: props.editQueue?.from || null,
			endHour: props.editQueue?.to || null,
		},
	});

	return (
		<form
			onSubmit={editQueueForm.onSubmit((values, event) => {
				metaDb.editQueue(props.editQueue!.id, {
					name: values.name,
					timed: values.timed,
					from: values.startHour,
					to: values.endHour,
				});
				props.setEditQueue(null);
			})}
		>
			<Stack>
				<TextInput
					placeholder="Enter name of queue"
					label="Name of Queue"
					required
					{...editQueueForm.getInputProps("name", {
						type: "input",
					})}
				/>
				<Switch
					label="Active at certain hours"
					{...editQueueForm.getInputProps("timed", {
						type: "checkbox",
					})}
				/>
				<TimeInput
					label="Start hour"
					min={0}
					max={24}
					disabled={!editQueueForm.values.timed}
					required
					{...editQueueForm.getInputProps("startHour", {
						type: "input",
					})}
				/>
				<TimeInput
					label="End hour"
					min={0}
					max={24}
					disabled={!editQueueForm.values.timed}
					required
					{...editQueueForm.getInputProps("endHour", {
						type: "input",
					})}
				/>
				<Group position="right">
					<Button type="submit">Save</Button>
				</Group>
			</Stack>
		</form>
	);
};

export default Queue;
