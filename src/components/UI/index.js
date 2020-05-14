import { default as UIToggleButtonGroup } from "@material-ui/lab/ToggleButtonGroup";
import { default as UITextField } from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";

const BASIC_STYLES = {
  backgroundColor: "white",
  zoom: 1.25,
};

export const ToggleButtonGroup = styled(UIToggleButtonGroup)({
  ...BASIC_STYLES,
});

export const TextField = styled(UITextField)({
  ...BASIC_STYLES,
});
