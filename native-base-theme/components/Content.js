import variable from "./../variables/platform";

export default (variables = variable) => {
  const contentTheme = {
    flex: 1,
    backgroundColor: variable.containerBgColor,
    "NativeBase.Segment": {
      borderWidth: 0,
      backgroundColor: "transparent"
    }
  };

  return contentTheme;
};
