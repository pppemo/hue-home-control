import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LongPress from "react-long";
import cx from "classnames";
import styles from "./Switch.module.scss";

const Switch = ({
  lightName,
  isOn: isOnProp,
  isDisabled,
  isFavourite,
  onPress,
  onLongPress,
  isTurningOffDisabled
}) => {
  const [isOn, setIsOn] = useState(isOnProp);

  const handleToggle = () => {
    onPress(!isOn);
    !isTurningOffDisabled && !isOn && setIsOn(!isOn);
  };

  useEffect(() => {
    setIsOn(isOnProp);
  }, [isOnProp]);

  return (
    <LongPress
      time={1000}
      onLongPress={onLongPress}
      onPress={!isDisabled ? handleToggle : undefined}
    >
      <div className={styles.container}>
        <div
          className={cx(styles.switch, {
            [styles.isActive]: !isDisabled && isOn,
            [styles.isDisabled]: isDisabled
          })}
        >
          <div className={styles.label}>
            {isFavourite && (
              <span className={styles.favourite} role="img" aria-label="*">
                ⭐️
              </span>
            )}
            {lightName}
          </div>
        </div>
      </div>
    </LongPress>
  );
};

Switch.propTypes = {
  lightName: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  isFavourite: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
  isTurningOffDisabled: PropTypes.bool
};

Switch.defaultProps = {
  isTurningOffDisabled: false,
  isDisabled: false,
  onLongPress: undefined,
  isFavourite: false
};

export default Switch;
