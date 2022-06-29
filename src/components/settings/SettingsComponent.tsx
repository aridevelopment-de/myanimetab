import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useEvent } from '../../utils/eventhooks';
import PlaylistSettingsComponent from './playlist_settings/PlaylistSettingsComponent';
import styles from './settingscomponent.module.css';
import WidgetInstallationComponent from './widget_installation/WidgetInstallationComponent';
import WidgetSettingsComponent from './widget_settings/WidgetSettingsComponent';

const pages = {
    "Settings": <WidgetSettingsComponent />,
    "Playlists": <PlaylistSettingsComponent />,
    "Widgets": <WidgetInstallationComponent />
};

function SettingsComponent(_props: any) {
    const [ opened, setOpened ] = useEvent(
        "settings_window_state", 
        "settings_component", 
        false, 
        (data: {opened: boolean}) => data.opened
    );
    const [ page, setPage ] = useState("Settings");

    return (
        <div className={`${styles.wrapper} ${opened ? '' : styles.closed}`}>
            <div 
                className={`${styles.settings_menu} abs_fit`}
                style={{
                    transform: opened ? '' : 'translateX(0%)'
                }}>
                <div className={styles.settings_header}>
                    <div className={styles.icon__wrapper}>
                        <CloseIcon onClick={() => setOpened(false) } />
                    </div>
                    <header className={styles.settings_labels}>
                        {Object.keys(pages).map(e =>
                            <p 
                                onClick={() => setPage(e)} 
                                className={page === e ? styles.active : ''} key={e}>
                                {e}
                            </p>
                        )}
                    </header>
                    <hr style={{opacity: 0.5}} />
                </div>
                <div className={styles.settings_body}>
                    <div className="abs_fit">
                        <div className={styles.scroller_viewport}>
                            <div className={styles.scroller}>
                                <div className={styles.scroller_content}>
                                    <div className={styles.settings_list}>
                                        {opened ? pages[page as keyof typeof pages] : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsComponent;