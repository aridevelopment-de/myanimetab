import { Menu, Stack, Switch } from "@mantine/core";
import { useSetting, useWidget } from "../../../utils/eventhooks";
import { Component } from "../../../utils/registry/types";
import styles from "./settingselement.module.css";
import SettingsFormItem, { SettingsItemLabel } from "./SettingsFormItem";
import EventHandler, { EventType } from "../../../utils/eventhandler";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import { registry } from "../../../utils/registry/customcomponentregistry";
import { useEffect, useRef, useState } from "react";
import { widgetsDb } from "../../../utils/db";
import { useLiveQuery } from "dexie-react-hooks";

const MAX_HEIGHT = 1200; // about 6 dropdowns

function SettingsElement(props: { data: Component; searchValue: string }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const widget = useWidget(props.data.fullId);
	const minimized = useLiveQuery(async () => {
		const widget = (await widgetsDb.widgets.where("id").equals(props.data.fullId).toArray())[0];

		if (widget === undefined) {
			return false;
		}

		return widget.menuHidden;
	}, [props.data.fullId], false);
	const contentRef = useRef<HTMLDivElement>();
	const toolbarHovered = useRef<boolean>(false);
	const initialHeight = useRef<number>();

	useEffect(() => {
		// This may be a dirty fix to skip the initial transition
		// But it's too late and I couldn't think of a better one
		if (contentRef.current) {
			setTimeout(() => {
				contentRef.current!.style.transitionProperty = "all";
				contentRef.current!.style.transitionDuration = "750ms";
				contentRef.current!.style.transitionTimingFunction = "ease";
			}, 150);
		}
	}, [contentRef]);

	useEffect(() => {
		if (
			!minimized &&
			contentRef.current &&
			initialHeight.current === null
		) {
			initialHeight.current = Math.min(
				MAX_HEIGHT,
				contentRef.current.clientHeight
			);
		}
	}, [contentRef, contentRef.current, minimized]);

	return (
		<div className={`${styles.item} ${!widget.state ? "disabled" : ""}`}>
			{/* Header */}
			<div
				className={styles.title}
				onClick={() =>
					!toolbarHovered.current
						? widgetsDb.setMenuHidden(props.data.fullId, !minimized)
						: void 0
				}
			>
				<SettingsItemLabel
					className={styles.title_text}
					name={props.data.headerSettings.name}
					searchValue={props.searchValue || undefined}
				/>
				{/* Toolbar */}
				<div
					style={{
						display: "flex",
						gap: "7px",
					}}
					/* @ts-ignore */
					onMouseEnter={() => (toolbarHovered.current = true)}
					onMouseLeave={() => (toolbarHovered.current = false)}
				>
					{/* As deleting is currently the only option, the settings button will only available when the component is deletable */}
					{props.data.metadata.removeableComponent ? (
						<Menu shadow="md" width={200} position="left-start">
							<Menu.Target>
								<SettingsIcon
									style={{
										opacity: 0.5,
									}}
								/>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Actions</Menu.Label>
								<Menu.Item
									color="red"
									icon={
										<DeleteIcon sx={{ fontSize: "23px" }} />
									}
									onClick={() => {
										EventHandler.emit(
											EventType.SETTINGS_WINDOW_STATE,
											{
												opened: false,
											}
										);
										registry.uninstallComponent(props.data);

										setTimeout(
											() =>
												EventHandler.emit(
													EventType.RERENDER_ALL
												),
											50
										);
									}}
								>
									Delete Widget
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					) : null}
					{widget.state !== undefined ? (
						<Switch
							checked={widget.state}
							onChange={(e) => {
								widgetsDb.setSetting(
									props.data.fullId,
									"state",
									e.currentTarget.checked
								);
								EventHandler.emit(EventType.RERENDER_ALL);
							}}
						/>
					) : null}
				</div>
			</div>

			{/* Body */}
			<Stack
				spacing="xs"
				className={`${styles.content} ${
					minimized ? styles.content__minimized : undefined
				}`}
				style={{
					maxHeight: minimized
						? undefined
						: `${initialHeight.current || MAX_HEIGHT}px`,
					overflowY: minimized
						? "hidden"
						: contentRef.current &&
						  contentRef.current?.clientHeight >= MAX_HEIGHT
						? "auto"
						: undefined,
				}}
				/* @ts-ignore */
				ref={contentRef}
			>
				{props.data.contentSettings?.map(
					(componentSetting, index: number) => {
						if (props.searchValue == null) {
							return (
								<SettingsFormItem
									componentSetting={componentSetting}
									componentId={props.data.fullId}
									disabled={widget.state === false}
									key={index}
								/>
							);
						}

						if (
							componentSetting.name
								.toLowerCase()
								.includes(props.searchValue.toLowerCase())
						) {
							return (
								<SettingsFormItem
									componentSetting={componentSetting}
									componentId={props.data.fullId}
									searchValue={props.searchValue}
									disabled={widget.state === false}
									key={index}
								/>
							);
						} else if (
							props.data.headerSettings.name
								.toLowerCase()
								.includes(props.searchValue.toLowerCase())
						) {
							return (
								<SettingsFormItem
									componentSetting={componentSetting}
									componentId={props.data.fullId}
									disabled={widget.state === false}
									key={index}
								/>
							);
						}

						return null;
					}
				)}
			</Stack>
		</div>
	);
}

export default SettingsElement;
