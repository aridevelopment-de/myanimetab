import WidgetMoverWrapper from "../../widgetmover/wrapper/WidgetMoverWrapper";
import { KnownComponent } from "../../../utils/registry/types";
import styles from "./texteditor.module.css";
import { useWidget } from "../../../utils/eventhooks";

const TextEditor = (props: { blur: boolean, id: string }) => {
	const widget = useWidget(props.id);

	return (
		<WidgetMoverWrapper id={props.id}>
			<div className={styles.wrapper}>
				<div className={styles.handle} style={{
					backgroundColor: widget.color,
				}}>
					<span>Notes</span>
				</div>
				<textarea></textarea>
			</div>
		</WidgetMoverWrapper>
	)
}

export default {
	type: "text_editor",
	element: TextEditor as unknown as JSX.Element,
	metadata: {
		name: "Notes",
		author: "aridevelopment.de",
		defaultComponent: false,
		removeableComponent: true,
		installableComponent: true,
	},
	headerSettings: {
		name: "Notes",
		type: "text_editor",
		option: {
			type: "toggle",
			default: true,
		}
	},
	contentSettings: [
		{
			name: "Handle Color",
			key: "color",
			type: "color",
			options: {
				default: "#ecec1d"
			}
		}
	]
} as KnownComponent;