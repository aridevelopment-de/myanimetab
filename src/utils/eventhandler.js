
const EventHandler = {
    callbacks: {},
    callbacksForAll: {},

    triggerEvent: function(eventName, data=null) {
        console.debug("[Event] Event published: " + eventName);
        console.debug(data);
        
        if (this.callbacks[eventName]) {
            Object.keys(this.callbacks[eventName]).forEach((id) => {
                this.callbacks[eventName][id](data);
            });
        }

        if (eventName.startsWith("set.")) {
            // The eventname looks like "set.cc.clock.state"
            Object.keys(this.callbacksForAll).forEach((id) => {
                this.callbacksForAll[id](eventName.substring(4), data);
            })
        }
    },

    triggerEvents: function(eventNames, datas=null) {
        console.debug("[Event] Events published: " + eventNames);
        console.debug(datas);
        
        eventNames.forEach((eventName, index) => {
            if (datas === null) {
                this.triggerEvent(eventName);
            } else {
                this.triggerEvent(eventName, datas[index]);
            }
        });
    },

    listenEvent: function(eventName, id, callback) {
        if (!this.callbacks[eventName]) {
            this.callbacks[eventName] = {};
        }

        this.callbacks[eventName][id] = callback;
    },

    unlistenEvent: function(eventName, id) {
        if (this.callbacks[eventName]) {
            delete this.callbacks[eventName][id];
        }
    },

    listenAll: function(id, callback) {
        if (!this.callbacksForAll[id]) {
            this.callbacksForAll[id] = callback;
        }
    },

    unlistenAll: function(id) {
        if (this.callbacksForAll[id]) {
            delete this.callbacksForAll[id];
        }
    }
}

export default EventHandler;