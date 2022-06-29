import { useLiveQuery } from "dexie-react-hooks";
import { widgetsDb } from "../../../utils/db";
import EventHandler from "../../../utils/eventhandler";
import styles from './widgetelementcomponent.module.css';


function WidgetInstallationComponent(props: {
    name: string,
    description: string,
    author: string,
    id: string
}) {
    const installed = useLiveQuery(() => widgetsDb.getWidget(props.id).then(r => r !== undefined))

    const onAction = () => {
        if (installed) {
            EventHandler.emit("uninstall_widget", {
                id: props.id
            });
        } else {
            EventHandler.emit("install_widget", {
                id: props.id
            });
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <header className={styles.header}>
                    <p>{props.name}</p>
                    <button className={installed ? styles.installed : ''} onClick={onAction}>
                        {installed ? 'Uninstall' : 'Install'}
                    </button>
                </header>
                <main className={styles.main}>
                    <p>{props.description}</p>
                </main>
                <footer className={styles.footer}>
                    <p>by {props.author}</p>
                </footer>
            </div>
        </div>
    )
}

export default WidgetInstallationComponent;