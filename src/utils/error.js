/**
 * Checks if `obj` has a field `message` of type `string`.
 *
 * @param obj - Any unknown object.
 * @returns Whether `obj` has a field `message` of type `string`.
 */
export function hasMessage(obj) {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "message" in obj &&
    typeof obj.message === "string"
  );
}

/**
 * Extracts error message from errors.
 *
 * @param err - Error from catch block.
 * @returns Error message.
 */
export function getErrMessage(err) {
  return hasMessage(err) ? err.message : "Unknown error occurred";
}
