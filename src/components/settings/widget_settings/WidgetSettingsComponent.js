import React from 'react';
import SETTINGS_DESCRIPTOR from '../../../utils/settingsdescriptor';
import SettingsElement from './SettingsElement';


class WidgetSettingsComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                {
                    SETTINGS_DESCRIPTOR.SETTINGS_DESCRIPTOR.map(descriptor => 
                        <SettingsElement descriptor={ descriptor } descriptorId = { descriptor.id } key={ descriptor.id } />
                    )
                }
            </React.Fragment>
        )
    }
}

export default WidgetSettingsComponent;