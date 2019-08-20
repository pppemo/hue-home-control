export const fullyApi = (fnName, ...args) => {
  try {
    return window.fully[fnName](...args);
  } catch (e) {
    console.log(e.name);
    if (e.name === "TypeError") {
      return null;
    } else {
      throw e;
    }
  }
};

export const isRunningOnFully = () => !!window.fully;
