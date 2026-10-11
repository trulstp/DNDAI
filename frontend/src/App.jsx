import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CharacterCreatorPage from "./pages/CharacterCreatorPage";
import NotFoundPage from "./pages/NotFoundPage";
import RandomEncounterPage from "./pages/RandomEncounterPage";
import "./index.css";

import Root from "./pages/Root";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <HomePage /> },

      // Game related pages
      { path: "/encounter", element: <RandomEncounterPage /> },
      { path: "/creator", element: <CharacterCreatorPage /> },

      // 404 page
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
