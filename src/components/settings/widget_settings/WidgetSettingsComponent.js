import React from 'react';
import './widgetsettingscomponent.css';
import CustomComponentRegistry from '../../../utils/customcomponentregistry';
import SettingsElement from './SettingsElement';
import IS_DEV from '../../../utils/devutils';


class WidgetSettingsComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                {
                    Object.keys(CustomComponentRegistry.getAll()).map(dataKey => {
                        if (IS_DEV) {
                            console.log("Settings Page registered: " + dataKey);
                        }
                        return <SettingsElement data={CustomComponentRegistry.get(dataKey)} key={CustomComponentRegistry.get(dataKey).name} />
                    })
                }
                <div class="widget_settings__import_export">
                    <button class="widget_settings__import_btn">Import</button>
                    <button class="widget_settings__export_btn">Export</button>
                </div>
                <footer id="widget_settings__footer">
                    <div className="widget_settings__footer_urls">
                        <a href="https://github.com/aridevelopment-de/myanimetab">
                            <img src="/icons/github.svg" alt="GitHub" />
                        </a>
                        <a href="https://aridevelopment.de/">
                            <img src="/icons/website.png" alt="Website" />
                        </a>
                        <a href="https://twitter.com/AriOnIce">
                            <img src="/icons/twitter.svg" alt="Twitter" />
                        </a>
                        <a href="https://aridevelopment.de/discord">
                            <img src="/icons/discord.svg" alt="Discord" />
                        </a>
                        <a href="mailto:ari.publicmail@gmail.com">
                            <img src="/icons/email.svg" alt="Mail" />
                        </a>
                    </div>
                    <p id="copyright_infrigement">Copyright © 2022 aridevelopment.de</p>
                </footer>
            </React.Fragment>
        )
    }
}

export default WidgetSettingsComponent;