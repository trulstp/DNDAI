import { noteServerResponse, wakeServer } from "./api";

// fetch that throws an Error with a message suitable for showing to the user

// Responses the backend marks with a code have their own message
const messageForCode = {
  AI_HOURLY_LIMIT:
    "You've reached the hourly limit for AI generations. Try again in a while.",
  AI_DAILY_LIMIT:
    "Support Roll has reached its daily limit for AI generations. Try again tomorrow.",
  AI_UNAVAILABLE:
    "The AI part of this demo has used up its budget for now. Try again later.",
  UNSIGNED_IMAGE_PROMPT:
    "Artwork can't be made for this one. Generate a new one to get artwork.",
};

const messageForStatus = (status) => {
  if (status === 429) return "Too many requests. Wait a moment and try again.";
  if (status === 503) return "The monster database isn't available right now.";
  if (status >= 500)
    return "Something went wrong while generating. The AI service may be busy, so try again.";
  return "The request wasn't accepted. Check your choices and try again.";
};

const codeOf = async (response) => {
  try {
    return (await response.json())?.code;
  } catch {
    return undefined;
  }
};

export const fetchOk = async (url, options) => {
  // If the server may have gone to sleep, loading screens can say why this takes longer
  wakeServer();
  let response;
  try {
    response = await fetch(url, options);
    noteServerResponse();
  } catch {
    throw new Error(
      "Couldn't reach the server. Check that the backend is running."
    );
  }
  if (!response.ok) {
    const code = await codeOf(response);
    throw new Error(messageForCode[code] || messageForStatus(response.status));
  }
  return response;
};
