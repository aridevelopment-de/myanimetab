import create from 'zustand'
import { devtools } from 'zustand/middleware'

// Overall settings for the whole widget mover interface
export interface IWidgetMover {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

export const useMoverState = create<IWidgetMover>()(
    devtools((set) => ({
        enabled: true, // TODO: defaults to false
        setEnabled: (enabled) => set({ enabled }),
    })),
)

// General store to get the current widget being moved
export interface IMoverSettings {
    selectedWidget: string | null;
    setSelectedWidget: (widget: string | null) => void;
}

export const useMoverSettings = create<IMoverSettings>()(
    devtools((set) => ({
        selectedWidget: null,
        setSelectedWidget: (widget) => set({ selectedWidget: widget }),
    })),
)

// Snapline glowing (kind of like a semaphore)
export interface ISnapLinesState {
    glown: {id: number, count: number}[];
    exists: (id: number) => boolean;
    add: (id: number) => void;
    remove: (id: number) => boolean;
}

export const useSnapLineState = create<ISnapLinesState>()(
    devtools((set, get) => ({
        glown: [],
        exists: (id) => get().glown.some((g) => g.id === id),
        add: (id) => {
            const glown = get().glown;
            const index = glown.findIndex((g) => g.id === id);
            if (index !== -1) {
                glown[index].count++;
            } else {
                glown.push({id, count: 1});
            }
            set({glown});
        },
        remove: (id) => {
            const glown = get().glown;
            const index = glown.findIndex((g) => g.id === id);
            if (index !== -1) {
                glown[index].count--;
                if (glown[index].count === 0) {
                    glown.splice(index, 1);
                    set({glown});
                    return true;
                }
            }
            return false;
        }
    })),
);