import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./CarouselIndicator.module.scss";

const CarouselIndicator = ({ numberOfItems, currentItemIndex, className }) => (
  <div className={className}>
    {Array.from(new Array(numberOfItems)).map((_, index) => (
      <div
      key={currentItemIndex + index}
        className={cx(styles.indicator, {
          [styles.active]: index === currentItemIndex
        })}
      />
    ))}
  </div>
);

CarouselIndicator.propTypes = {
  numberOfItems: PropTypes.number.isRequired,
  currentItemIndex: PropTypes.number.isRequired,
  className: PropTypes.string
};

CarouselIndicator.defaultProps = {
  className: undefined
};

export default CarouselIndicator;
