import { ActionIcon, NumberInput } from "@mantine/core";
import { GlowPriority, useMoverState, useSnapLineState } from "../../../hooks/widgetmover";
import styles from './styles.module.css'
import snapstyles from './snaplinelist.module.css'
import LogoutIcon from '@mui/icons-material/Logout';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import DeblurIcon from '@mui/icons-material/Deblur';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useLiveQuery } from "dexie-react-hooks";
import { metaDb, ISnapLine, IHorizontalSnapLine, IVerticalSnapLine } from '../../../utils/db';
import Delete from "@mui/icons-material/Delete";
import { useHover } from "@mantine/hooks";

const MoverControlbar = () => {
    const [moverEnabled, setMoverEnabled] = useMoverState((state) => [state.enabled, state.setEnabled]);
    const { hovered, ref } = useHover();

    /*
    - Exitting mover mode
    - Dim Background / undim background
    - Creating horizontal snap line
    - Creating vertical snap line
    - Dropdown snapline list
    */

    return (
        <div className={`${styles.container} ${hovered ? styles.container_hover : ""}`} ref={ref}>
            <div className={styles.actionbar}>
                <ActionIcon onClick={() => setMoverEnabled(false)}>
                    <LogoutIcon />
                </ActionIcon>
                <div className={styles.seperator} />
                <ActionIcon>
                    <DeblurIcon />
                </ActionIcon>
                <div className={styles.seperator} />
                <ActionIcon onClick={() => {
                    metaDb.addSnapLine({
                        axis: "horizontal",
                        top: 50,
                    } as IHorizontalSnapLine)
                }}>
                    <VerticalAlignCenterIcon sx={{ rotate: "90deg" }} />
                </ActionIcon>
                <ActionIcon onClick={() => {
                    metaDb.addSnapLine({
                        axis: "vertical",
                        left: 50,
                    } as IVerticalSnapLine)
                }}>
                    <VerticalAlignCenterIcon />
                </ActionIcon>
                <ActionIcon>
                    <ArrowDropDownIcon />
                </ActionIcon>
            </div>
            <SnapLineList />
        </div>
    )
}

const SnapLineList = () => {
    const snapLines = useLiveQuery(() => metaDb.snapLines.toArray());
    const [addSnapLineGlowing, removeSnapLineGlowing] = useSnapLineState((state) => [state.addGlowSnapLine, state.removeGlowSnapLine]);

    const onMouseHover = (snapLine: ISnapLine) => {
        addSnapLineGlowing(snapLine.id, snapLine.axis, GlowPriority.Hover);
    }

    const onMouseLeave = (snapLine: ISnapLine) => {
        removeSnapLineGlowing(snapLine.id, GlowPriority.Hover);
    }

    return (
        <div className={snapstyles.container}>
            {snapLines?.map((snapLine, index) => (
                <div className={snapstyles.snapline} key={snapLine.id} onMouseEnter={() => onMouseHover(snapLine)} onMouseLeave={() => onMouseLeave(snapLine)}>
                    <VerticalAlignCenterIcon sx={{ rotate: snapLine.axis === "vertical" ? "90deg" : "0deg" }} />
                    <div style={{ marginLeft: 'auto' }}>
                        <ActionIcon onClick={() => metaDb.snapLines.delete(snapLine.id)}>
                            <Delete />
                        </ActionIcon>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default MoverControlbar;