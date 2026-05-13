export const handleBackendError = (err, type) => {
  // return JSON.stringify(err);
  let errData = err?.response?.data;
  if (type == "res") errData = err?.data;

  if (errData?.message) return errData?.message?.toString();

  if (err?.code == "ERR_NETWORK") return "Error 604, pls try again later";

  if (typeof errData !== "object") return JSON.stringify(errData);
  const errors = Object.values(errData);
  let errorsToDisplay = "";

  errors.forEach((error) => {
    if (typeof error === "string") {
      errorsToDisplay = `${errorsToDisplay} ${error}`;
    }
    if (Array.isArray(error)) {
      const allErrors = error.join(", ");
      errorsToDisplay = `${errorsToDisplay} ${allErrors}`;
    }
  });

  return errorsToDisplay;
};
