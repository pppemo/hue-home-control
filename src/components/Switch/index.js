import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LongPress from "react-long";
import { ButtonBase } from "@material-ui/core";
import Sound from "react-sound";
import cx from "classnames";
import styles from "./Switch.module.scss";

const Switch = ({
  lightName,
  aboveLabel,
  isOn: isOnProp,
  isDisabled,
  isFavourite,
  isStateless,
  isSoundOn,
  onPress,
  onLongPress,
}) => {
  const [isOn, setIsOn] = useState(isOnProp);
  const [isConfirmationSoundPlaying, setIsConfirmationSoundPlaying] = useState(
    false
  );

  const handleToggle = () => {
    isSoundOn && setIsConfirmationSoundPlaying(true);
    onPress(!isOn);
  };

  useEffect(() => {
    setIsOn(isOnProp);
  }, [isOnProp]);

  return (
    <>
      <Sound
        url="/sounds/click-sound.mp3"
        playStatus={
          isConfirmationSoundPlaying
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        onFinishedPlaying={() => setIsConfirmationSoundPlaying(false)}
      />
      <LongPress
        time={1000}
        onLongPress={!isStateless && onLongPress}
        onPress={!isDisabled ? handleToggle : undefined}
      >
        <div className={styles.container}>
          <ButtonBase
            className={cx(styles.switch, {
              [styles.isActive]: !isDisabled && !isStateless && isOn,
              [styles.isDisabled]: !isStateless && isDisabled,
              [styles.isStateless]: isStateless,
            })}
          >
            <div className={styles.label}>
              {isFavourite && (
                <span className={styles.favourite} role="img" aria-label="*">
                  ⭐️
                </span>
              )}
              {aboveLabel && (
                <div className={styles.aboveLabel}>{aboveLabel}</div>
              )}
              {lightName}
            </div>
          </ButtonBase>
        </div>
      </LongPress>
    </>
  );
};

Switch.propTypes = {
  lightName: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  aboveLabel: PropTypes.string,
  isOn: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  isFavourite: PropTypes.bool,
  isStateless: PropTypes.bool,
  isSoundOn: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
};

Switch.defaultProps = {
  aboveLabel: undefined,
  isDisabled: false,
  onLongPress: undefined,
  isFavourite: false,
  isStateless: false,
  isSoundOn: false,
};

export default Switch;
