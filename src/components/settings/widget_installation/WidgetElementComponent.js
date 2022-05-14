import React from "react";
import EventHandler from "../../../utils/eventhandler";
import getUserSettings from "../../../utils/settings";
import styles from './widgetelementcomponent.module.css'


class WidgetInstallationComponent extends React.Component {
    constructor(props) {
        super(props);

        // name
        // description
        // author
        // installed: bool

        this.state = {
            installed: getUserSettings().get("installed_components").includes(this.props.id)
        }

        this.onAction = this.onAction.bind(this);
    }

    onAction() {
        if (this.state.installed) {
            EventHandler.triggerEvent("uninstall_widget", {
                id: this.props.id
            });
        } else {
            EventHandler.triggerEvent("install_widget", {
                id: this.props.id
            });
        }

        this.setState({
            installed: getUserSettings().get("installed_components").includes(this.props.id)
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.inner}>
                    <header class={styles.header}>
                        <p>{this.props.name}</p>
                        <button className={this.state.installed ? styles.installed : ''} onClick={this.onAction}>
                            {this.state.installed ? 'Uninstall' : 'Install'}
                        </button>
                    </header>
                    <main class={styles.main}>
                        <p>{this.props.description}</p>
                    </main>
                    <footer class={styles.footer}>
                        <p>by {this.props.author}</p>
                    </footer>
                </div>
            </div>
        )
    }
}

export default WidgetInstallationComponent;