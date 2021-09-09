
const EventHandler = {
    callbacks: {},

    triggerEvent: function(eventName, data=null) {
        if (this.callbacks[eventName]) {
            Object.keys(this.callbacks[eventName]).forEach((id) => {
                this.callbacks[eventName][id](data);
            });
        }
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
    }
}

export default EventHandler;