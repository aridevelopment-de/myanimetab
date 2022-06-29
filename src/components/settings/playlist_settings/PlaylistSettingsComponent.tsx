import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useLiveQuery } from "dexie-react-hooks";
import { metaDb } from "../../../utils/db";
import EventHandler from '../../../utils/eventhandler';
import image_styles from './imagestyles.module.css';
import styles from './playlistsettingscomponent.module.css';


function Image(props: {
    url: string,
    idx: number, 
    selectedIdx: number, 
    resizeClickCallback: Function,
    deleteClickCallback: Function,
    disabled: boolean
}) {
    const onImageClick = () => {
        if (props.idx !== props.selectedIdx) {
            metaDb.setMeta("selected_image", props.idx);
            EventHandler.emit("select_image", { idx: props.idx });
            EventHandler.emit("playlist_refresh", null);
        }
    }

    return (
        <div className={`${image_styles.image} ${props.idx === props.selectedIdx ? image_styles.selected : ''}`} onClick={onImageClick}>
            <img src={props.url} alt={`${props.idx}`} />
            <div>
                <div className={image_styles.overlay_buttons}>
                    <div 
                        className={image_styles.overlay__button} 
                        onClick={() => props.resizeClickCallback(props.idx)}
                    >
                        <FullscreenIcon />
                    </div>
                    <div 
                        className={`${image_styles.overlay__button} ${props.disabled === true ? image_styles.disabled : ''}`} 
                        onClick={() => {if (props.disabled === false) { props.deleteClickCallback(props.idx) }}}
                    >
                        <DeleteIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlaylistSettingsComponent(props: {}) {
    const images = useLiveQuery(() => metaDb.meta.get("images").then(m => m?.value));
    const selectedIdx = useLiveQuery(() => metaDb.meta.get("selected_image").then(m => m?.value));

    return (
        <div>
            <div className={styles.images}>
                {
                    (images || []).map((image: string, index: number) => {
                        return <Image 
                            url={image} 
                            key={index} 
                            idx={index} 
                            disabled={index === 0 && images.length === 1}
                            selectedIdx={selectedIdx} 
                            resizeClickCallback={() => {
                                EventHandler.emit("full_screen_image_window_state", { url: image });
                            }} 
                            deleteClickCallback={() => {
                                images.splice(index, 1);
                                metaDb.setMeta("images", images);
                                metaDb.setMeta("selected_image", index - 1);
                            }} 
                        />
                    })
                }
                
                <div className={styles.dragdrop__container}>
                    <div 
                        className={styles.dragdrop} 
                        onClick={() => {
                            EventHandler.emit("url_add_window_state", { opened: true });
                        }}>
                        <div className={styles.dragdrop__text}>
                            <p>+</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaylistSettingsComponent;