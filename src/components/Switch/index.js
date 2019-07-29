import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Switch.module.scss";

const Switch = ({ lightName, isOn: isOnWhenLoading, onClick }) => {
  const [isOn, setIsOn] = useState(isOnWhenLoading);

  const handleToggle = () => {
    onClick(!isOn);
    setIsOn(!isOn);
  };

  return (
    <div className={styles.container} onClick={handleToggle}>
      <div className={cx(styles.switch, { [styles.isActive]: isOn })}>
        <div className={styles.label}>{lightName}</div>
      </div>
    </div>
  );
};

Switch.propTypes = {
  lightName: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Switch;
