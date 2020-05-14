import React, { useState } from "react";
import { connect } from "react-redux";
import { dispatch } from "../../store";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Button, Box } from "@material-ui/core";
import { ToggleButtonGroup, TextField } from "./../../components/UI";
import { COOKIES } from "../../constants";
import Cookies from "js-cookie";
import styles from "./Config.module.scss";

const Config = () => {
  const [defaultReturnToPage, setDefaultReturnToPage] = useState(
    Cookies.get(COOKIES.DEFAULT_PAGE_TYPE) || "scenes"
  );
  const [shouldShowAdvancedOptions, setShouldShowAdvancedOptions] = useState(
    false
  );

  const setDefaultPageType = (_, pageType) => {
    Cookies.set(COOKIES.DEFAULT_PAGE_TYPE, pageType);
    setDefaultReturnToPage(pageType);
  };

  const handleShowAdvancedOptionsButton = () =>
    setShouldShowAdvancedOptions(!shouldShowAdvancedOptions);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Configuration</p>

      <div className={styles.configLabel}>Default "return to" page</div>
      <ToggleButtonGroup
        value={defaultReturnToPage}
        exclusive
        onChange={setDefaultPageType}
        aria-label="default return to screen"
      >
        <ToggleButton value="lights" aria-label="lights">
          Lights
        </ToggleButton>
        <ToggleButton value="scenes" aria-label="scenes">
          Scenes
        </ToggleButton>
      </ToggleButtonGroup>

      <Box className={styles.advancedOptionsContainer}>
        <Button variant="contained" onClick={handleShowAdvancedOptionsButton}>
          {shouldShowAdvancedOptions
            ? "Hide advanced options"
            : "Show advanced options"}
        </Button>

        {shouldShowAdvancedOptions && (
          <>
            <div className={styles.configLabel}>
              When any action performed, trigger a flag in a virtual sensor
            </div>
            <TextField label="Sensor name" variant="filled" />
          </>
        )}
      </Box>
    </div>
  );
};

const mapState = (state) => ({
  rooms: state.rooms,
});

export default connect(mapState)(Config);
