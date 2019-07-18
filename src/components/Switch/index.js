import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import ReactCardFlip from "react-card-flip";
import styles from "./Switch.module.scss";

const Switch = ({ lightName, isOn, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(isOn);

  useEffect(() => setIsFlipped(isOn), [isOn]);

  const handleToggle = () => {
    const newSwitchState = !isFlipped;
    setIsFlipped(newSwitchState);
    onClick(newSwitchState);
  };

  return (
    <div className={styles.container} onClick={handleToggle}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="vertical"
        containerStyle={{ width: "100%" }}
      >
        <div className={styles.switch} key="front">
          <div className={styles.label}>{lightName}</div>
        </div>

        <div className={cx(styles.switch, styles.isActive)} key="back">
          <div className={styles.label}>{lightName}</div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

Switch.propTypes = {
  lightName: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Switch;
