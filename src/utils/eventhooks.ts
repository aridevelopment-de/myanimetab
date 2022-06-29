import md5 from "md5";
import { useEffect, useState } from "react";
import { widgetsDb } from "./db";
import EventHandler from "./eventhandler";


export const useSetting = (id: string, key: string, trigger_function?: Function): [any, Function] => {
    const [status, setStatus] = useState(null);
    useEffect(() => { widgetsDb.getSetting(id, key).then(result => setStatus(result)) }, [id, key]);

    const changeStatus = (value: any) => {
        widgetsDb.setSetting(id, key, value);
        setStatus(value);
    }

    useEffect(() => {
        EventHandler.on(`widget.${id}.${key}`, HashCode.value(id + key), (data: any) => {            
            setStatus(data);
            (trigger_function || (() => {}))(data);
        });
        
        return () => {
            EventHandler.off(`widget.${id}.${key}`, HashCode.value(id + key));
        }
    }, [id, key, trigger_function]);

    return [status, changeStatus];
}

export const useEvent = (event_name: string, identifier: string, default_value?: any, trigger_function?: Function): [any, Function] => {
    const [state, setState] = useState(default_value);
    const changeEvent = (value: any) => EventHandler.emit(event_name, {value: value, sender: identifier});

    useEffect(() => {
        EventHandler.on(event_name, identifier, (data: any) => {
            const value = (trigger_function || (() => {}))(data) || data.value;
            setState(value);
        });

        return () => {
            EventHandler.off(event_name, identifier);
        }
    }, [event_name, identifier, trigger_function]);

    return [state, changeEvent];
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
    var serialize = function(object: any) {
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
        value : function(object: any) {
            return md5(serialize(object));
        }
    };
}();
