import { Button } from "@mantine/core";
import { useState } from "react";
import { initialLayouts } from "../../utils/db";
import EventHandler from "../../utils/eventhandler";
import styles from "./styles.module.css";

const WelcomeScreen = () => {
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span style={{ fontSize: "2.7em", color: "white" }}>Welcome new user!</span>
        <span>MyAnimeTab is a highly customizable start page designed for weebs.<br />Please be aware of potential bugs as <a href="https://github.com/Ari24-cb24" target="_blank" rel="noreferrer">I'm</a> the only developer actively working on it. To get started, choose a basic layout first.</span>
			</div>
			<div className={styles.content}>
        {Object.keys(initialLayouts).map((url, idx_) => (
          <div key={idx_} className={styles.layout} onClick={() => selected === url ? setSelected(null) : setSelected(url)} data-selected={selected === url}>
            <img
              src={url}
              alt={`layout ${idx_}`}
              width="200"
              height="133"
            />
          </div>
        ))}
			</div>
      <div className={styles.footer}>
        <span id={styles["skip"]}>Skip</span>
        <Button color="green" disabled={selected === null} onClick={() => {
          EventHandler.emit("initialLayoutSelect", selected);
        }}>Okay</Button>
      </div>
		</div>
	);
};

export default WelcomeScreen;
