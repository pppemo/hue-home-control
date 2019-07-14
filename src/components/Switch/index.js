import React, { useState } from "react";
import cx from "classnames";
import ReactCardFlip from "react-card-flip";
import styles from "./Switch.module.scss";

const Switch = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={styles.container} onClick={() => setIsFlipped(!isFlipped)}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="vertical"
        containerStyle={{ width: "100%" }}
      >
        <div className={styles.switch} key="front">
          <div className={styles.label}>Test</div>
        </div>

        <div className={cx(styles.switch, styles.isActive)} key="back">
          <div className={styles.label}>Test</div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default Switch;
