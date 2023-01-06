export enum EventType {
    QUEUE_REMOVE_IMAGE = "QUEUE_REMOVE_IMAGE",
    SETTINGS_WINDOW_STATE = "SETTINGS_WINDOW_STATE",
    RERENDER_ALL = "RERENDER_ALL",
    SKIP_IMAGE = "SKIP_IMAGE",
    PLAYLIST_REFRESH = "PLAYLIST_REFRESH",
    REFRESH_SNAPLINES = "snaplines:refresh",
    INITIAL_LAYOUT_SELECT = "initialLayoutSelect",
    WIDGETMOVER_SAVE = "widgetmover:save",
    WIDGETMOVER_DISABLED = "widgetmover:disabled",
    UPDATE_SNAPLINE = "snapline:update",
    DELETE_SNAPLINE = "snapline:delete",
}

const EventHandler = {
    callbacks: {} as { [key in EventType]: { [id: string]: Function } },

    emit: (eventName: EventType, data: any=null) => {
        console.debug("[Event] Event published: " + eventName);
        console.debug(data);
        
        if (EventHandler.callbacks[eventName]) {
            Object.keys(EventHandler.callbacks[eventName]).forEach((id) => {
                EventHandler.callbacks[eventName][id](data);
            });
        }
    },

    emits: (eventNames: Array<EventType>, datas: Array<any>=[]) => {
        eventNames.forEach((eventName, index) => {
            if (datas === null) {
                EventHandler.emit(eventName);
            } else {
                EventHandler.emit(eventName, datas[index]);
            }
        });
    },

    on: (eventName: EventType, id: string, callback: Function) => {
        if (!EventHandler.callbacks[eventName]) {
            EventHandler.callbacks[eventName] = {};
        }

        EventHandler.callbacks[eventName][id] = callback;
    },

    off: (eventName: EventType, id: string) => {
        if (EventHandler.callbacks[eventName]) {
            delete EventHandler.callbacks[eventName][id];
        }
    }
}

export default EventHandler;