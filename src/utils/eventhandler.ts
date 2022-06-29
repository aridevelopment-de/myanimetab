interface CallBacks {
    [eventName: string]: {
        [id: string]: Function;
    };
}

const EventHandler = {
    callbacks: {} as CallBacks,

    emit: (eventName: string, data: any=null) => {
        console.debug("[Event] Event published: " + eventName);
        console.debug(data);
        
        if (EventHandler.callbacks[eventName]) {
            Object.keys(EventHandler.callbacks[eventName]).forEach((id) => {
                EventHandler.callbacks[eventName][id](data);
            });
        }
    },

    emits: (eventNames: Array<string>, datas: Array<any>=[]) => {
        console.debug("[Event] Events published: " + eventNames);
        console.debug(datas);
        
        eventNames.forEach((eventName, index) => {
            if (datas === null) {
                EventHandler.emit(eventName);
            } else {
                EventHandler.emit(eventName, datas[index]);
            }
        });
    },

    on: (eventName: string, id: string, callback: Function) => {
        if (!EventHandler.callbacks[eventName]) {
            EventHandler.callbacks[eventName] = {};
        }

        EventHandler.callbacks[eventName][id] = callback;
    },

    off: (eventName: string, id: string) => {
        if (EventHandler.callbacks[eventName]) {
            delete EventHandler.callbacks[eventName][id];
        }
    }
}

export default EventHandler;