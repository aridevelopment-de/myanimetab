import create from 'zustand'
import { devtools } from 'zustand/middleware'

export interface IWidgetMover {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    selectedWidget: string;
    setSelectedWidget: (widget: string) => void;
}


export const useMoverState = create<IWidgetMover>()(
    devtools((set) => ({
        enabled: false,
        setEnabled: (enabled) => set({ enabled }),
        selectedWidget: '',
        setSelectedWidget: (widget) => set({ selectedWidget: widget }),
    })),
)