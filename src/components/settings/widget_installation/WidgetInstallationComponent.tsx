import React from "react";


const WidgetInstallationComponent = () => {
    return (
        <React.Fragment>
            <p>hi</p>
            {/* {CustomComponentRegistry.getAllStorePage().map(id => {
                const component = CustomComponentRegistry.get(id);
                const storeInformation = component.storeRegisterInformation;
                
                return <WidgetElementComponent 
                    name={component.settings.name}
                    description={storeInformation.description}
                    author={storeInformation.author}
                    key={id}
                    id={id}
                />;
            })} */}
        </React.Fragment>
    )
}

export default WidgetInstallationComponent;