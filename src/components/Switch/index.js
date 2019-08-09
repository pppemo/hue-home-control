import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Switch.module.scss";

const Switch = ({ lightName, isOn: isOnProp, onClick, isStateless }) => {
  const [isOn, setIsOn] = useState(isOnProp);

  const handleToggle = () => {
    onClick(!isOn);
    !isStateless && setIsOn(!isOn);
  };

  useEffect(() => {
    !isStateless && setIsOn(isOnProp);
  }, [isOnProp]);

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
  onClick: PropTypes.func.isRequired,
  isStateless: PropTypes.bool
};

Switch.propTypes = {
  isStateless: false
};

export default Switch;
