import {
	ActionIcon,
	Button,
	Drawer,
	Group,
	Space,
	Stack,
	Text,
} from "@mantine/core";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import FolderOpen from "@mui/icons-material/FolderOpen";
import Settings from "@mui/icons-material/Settings";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { IImage, IQueue, metaDb, useMeta } from "../../../../utils/db";
import styles from "./queue.module.css";
import MinimizeIcon from "@mui/icons-material/Minimize";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const QueueList = () => {
	const queues = useLiveQuery(() => metaDb.queues.toArray() || []);
	const currentQid = useMeta("selected_queue");

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
						<div
							className={styles.list__queue}
							style={{
								border:
									currentQid === queue.id
										? "1px solid var(--mantine-color-blue-5)"
										: "none",
							}}
							key={queue.id}
							onClick={() =>
								metaDb.setMeta("selected_queue", queue.id)
							}
						>
							<span>{queue.name}</span>
							<Group position="right" spacing="xs">
								<ActionIcon>
									{/* TOOD: Open a modal for editing queue information */}
									<Settings />
								</ActionIcon>
								<ActionIcon>
									<ClearIcon />
								</ActionIcon>
							</Group>
						</div>
					))}
			</Stack>
		</>
	);
};

const Queue = () => {
	const qid = useMeta("selected_queue");
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
							? currentQueue.name
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
										>
											<img
												src={image.url}
												alt={"Queue"}
											/>
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

export default Queue;
