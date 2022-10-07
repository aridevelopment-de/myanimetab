import create from 'zustand'
import { devtools } from 'zustand/middleware'

export interface IWidgetMover {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

export interface IMoverSettings {
    selectedWidget: string | null;
    setSelectedWidget: (widget: string | null) => void;
}

export const useMoverState = create<IWidgetMover>()(
    devtools((set) => ({
        enabled: true, // TODO: defaults to false
        setEnabled: (enabled) => set({ enabled }),
    })),
)

export const useMoverSettings = create<IMoverSettings>()(
    devtools((set) => ({
        selectedWidget: null,
        setSelectedWidget: (widget) => set({ selectedWidget: widget }),
    })),
)

export enum GlowPriority {
    None = 0,
    Snap = 1,
    Hover = 2,
    All = 3,
}

export interface ISnapLinesState {
    glownSnapLines: {id: number, align: "horizontal" | "vertical", priority: GlowPriority}[];
    existsGlowSnapLine: (id: number, align: "horizontal" | "vertical") => boolean;
    addGlowSnapLine: (id: number, align: "horizontal" | "vertical", priority: GlowPriority) => void;
    removeGlowSnapLine: (id: number, priority: GlowPriority) => void;
    clearGlowSnapLines: (priority: GlowPriority) => void;
    clearGlowVerticalSnapLines: (priority: GlowPriority) => void;
    clearGlowHorizontalSnapLines: (priority: GlowPriority) => void;
}

export const useSnapLineState = create<ISnapLinesState>()(
    devtools((set, get) => ({
        glownSnapLines: [],
        existsGlowSnapLine: (id, align) => get().glownSnapLines.some((line) => line.id === id && line.align === align),
        addGlowSnapLine: (id, align: "horizontal" | "vertical", priority: GlowPriority) => set((state) => ({ glownSnapLines: [...state.glownSnapLines, {id, align, priority}] })),
        removeGlowSnapLine: (id, priority: GlowPriority) => set((state) => ({ glownSnapLines: state.glownSnapLines.filter((i) => i.id !== id && i.priority <= priority) })),
        clearGlowSnapLines: (priority: GlowPriority) => set((state) => ({ glownSnapLines: state.glownSnapLines.filter((i) => i.priority <= priority) })),
        clearGlowVerticalSnapLines: (priority: GlowPriority) => set((state) => ({ glownSnapLines: state.glownSnapLines.filter((i) => i.align === "vertical" && i.priority <= priority) })),
        clearGlowHorizontalSnapLines: (priority: GlowPriority) => set((state) => ({ glownSnapLines: state.glownSnapLines.filter((i) => i.align === "horizontal" && i.priority <= priority) })),
    })),
);