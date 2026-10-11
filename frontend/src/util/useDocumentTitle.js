import { useEffect } from "react";

const APP_NAME = "Support Roll";

// Sets the browser tab title to "<title> · Support Roll" (or just the app name), so tabs and
// browser history can be told apart; restores the app name when the page goes away
export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);

  useEffect(
    () => () => {
      document.title = APP_NAME;
    },
    [],
  );
};
