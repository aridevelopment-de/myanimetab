import React, { useEffect } from "react";
import { useState } from "react";
import EventHandler from "../../utils/eventhandler";
import getUserSettings from "../../utils/settings";
import md5 from "md5";


function useSetting(key, identifier, trigger_function) {
    const [getStatus, setStatus] = useState(getUserSettings().get(key));
    const changeStatus = (value) => getUserSettings().set(key, value);

    useEffect(() => {
        EventHandler.listenEvent("set." + key, HashCode.value(key + identifier), (data) => {
            setStatus(data.value);
            (trigger_function || (() => {}))(data);
        });
        
        return () => {
            EventHandler.unlistenEvent("set." + key, HashCode.value(key + identifier));
        }
    });

    return [getStatus, changeStatus];
}

function useEvent(event_name, identifier, default_value, trigger_function) {
    const [getState, setState] = useState(default_value);
    const changeEvent = (value) => EventHandler.triggerEvent(event_name, {value: value, sender: identifier});

    useEffect(() => {
        EventHandler.listenEvent(event_name, identifier, (data) => {
            setState(data.value);
            (trigger_function || (() => {}))(data);
        });

        return () => {
            EventHandler.unlistenEvent(event_name, identifier);
        }
    });

    return [getState, changeEvent];
}


/**
 * Javascript HashCode v1.0.0
 * This function returns a hash code (MD5) based on the argument object.
 * http://pmav.eu/stuff/javascript-hash-code
 *
 * Example:
 *  var s = "my String";
 *  alert(HashCode.value(s));
 *
 * pmav, 2010
 */
 var HashCode = function() {

    var serialize = function(object) {
        // Private
        var type, serializedCode = "";

        type = typeof object;

        if (type === 'object') {
            var element;

            for (element in object) {
                serializedCode += "[" + type + ":" + element + serialize(object[element]) + "]";
            }

        } else if (type === 'function') {
            serializedCode += "[" + type + ":" + object.toString() + "]";
        } else {
            serializedCode += "[" + type + ":" + object+"]";
        }

        return serializedCode.replace(/\s/g, "");
    };

    // Public, API
    return {
        value : function(object) {
            return md5(serialize(object));
        }
    };
}();


const Widget = {
    useSetting,
    useEvent
}

export default Widget;