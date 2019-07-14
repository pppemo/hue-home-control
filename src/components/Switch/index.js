import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import ReactCardFlip from "react-card-flip";
import styles from "./Switch.module.scss";

const Switch = ({ lightId, lightName }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={styles.container} onClick={() => setIsFlipped(!isFlipped)}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="vertical"
        containerStyle={{ width: "100%" }}
      >
        <div className={styles.switch} key="front">
          <div className={styles.label}>{lightName}</div>
        </div>

        <div className={cx(styles.switch, styles.isActive)} key="back">
          <div className={styles.label}>ON</div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

Switch.propTypes = {
  lightId: PropTypes.string.isRequired,
  lightName: PropTypes.string.isRequired
}

export default Switch;
