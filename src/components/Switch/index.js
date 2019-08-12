import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Switch.module.scss";

const Switch = ({
  lightName,
  isOn: isOnProp,
  isDisabled,
  onClick,
  isTurningOffDisabled
}) => {
  const [isOn, setIsOn] = useState(isOnProp);

  const handleToggle = () => {
    onClick(!isOn);
    !isTurningOffDisabled && !isOn && setIsOn(!isOn);
  };

  useEffect(() => {
    setIsOn(isOnProp);
  }, [isOnProp]);

  return (
    <div className={styles.container} onClick={!isDisabled ? handleToggle : undefined}>
      <div
        className={cx(styles.switch, {
          [styles.isActive]: !isDisabled && isOn,
          [styles.isDisabled]: isDisabled
        })}
      >
        <div className={styles.label}>{lightName}</div>
      </div>
    </div>
  );
};

Switch.propTypes = {
  lightName: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isTurningOffDisabled: PropTypes.bool
};

Switch.defaultProps = {
  isTurningOffDisabled: false,
  isDisabled: false
};

export default Switch;
