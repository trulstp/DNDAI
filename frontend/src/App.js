import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import RandomItemPage from "./pages/RandomItemPage";
import MapsPage from "./pages/MapsPage";
import CharacterCreatorPage from "./pages/CharacterCreatorPage";
import RandomEncounterPage from "./pages/RandomEncounterPage";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },

  // Game related pages
  { path: "/encounter", element: <RandomEncounterPage /> },
  { path: "/treasure", element: <RandomItemPage /> },
  { path: "/mapmaker", element: <MapsPage /> },
  { path: "/creator", element: <CharacterCreatorPage /> },

  // User authentication and account management
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgotpassword", element: <ForgotPasswordPage /> },
  { path: "/resetpassword", element: <ResetPasswordPage /> },

  // User profile related
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/edit", element: <EditProfilePage /> },
]);

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
