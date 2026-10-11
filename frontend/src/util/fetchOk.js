// fetch that throws an Error with a message suitable for showing to the user
const messageForStatus = (status) => {
  if (status === 429) return "Too many requests. Wait a moment and try again.";
  if (status === 503) return "The monster database isn't available right now.";
  if (status >= 500)
    return "Something went wrong while generating. The AI service may be busy, so try again.";
  return "The request wasn't accepted. Check your choices and try again.";
};

export const fetchOk = async (url, options) => {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(
      "Couldn't reach the server. Check that the backend is running."
    );
  }
  if (!response.ok) throw new Error(messageForStatus(response.status));
  return response;
};
