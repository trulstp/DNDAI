import { useDocumentTitle } from "../util/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("Page not found");

  return (
    <div style={{ textAlign: "center" }}>
      <h1>404 Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
