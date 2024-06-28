import Sidebar from "./components/Sidebar/Sidebar.js";
import { Route, Routes } from "react-router";
import FirstPage from "./pages/FirstPage/FirstPage.js";
import SecondPage from "./pages/SecondPage/SecondPage.js";
import ThirdPage from "./pages/ThirdPage/ThirdPage.js";
import ForthPage from "./pages/ForthPage/ForthPage.js";
import FifthPage from "./pages/FifthPage/FifthPage.js";
import Login from "./pages/Login/Login.js";
import Profile from "./pages/Profile/Profile.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisitorPage from "./pages/VisitorPage/VisitorPage.js";

function App() {
  const notify = () => toast.success("안녕하세요!");

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          exact
          path="/index"
          element={
            <>
              <Sidebar />
              <FirstPage />
            </>
          }
        />
        <Route
          exact
          path="/inside"
          element={
            <>
              <Sidebar />
              <SecondPage />
            </>
          }
        />
        <Route
          exact
          path="/detail"
          element={
            <>
              <Sidebar />
              <ThirdPage />
            </>
          }
        />
        <Route
          exact
          path="/future"
          element={
            <>
              <Sidebar />
              <ForthPage />
            </>
          }
        />
        <Route
          exact
          path="/notification"
          element={
            <>
              <Sidebar />
              <FifthPage />
            </>
          }
        />
        <Route
          exact
          path="/profile"
          element={
            <>
              <Sidebar />
              <Profile />
            </>
          }
        />
        <Route exact path="/login" element={<Login />} />
        <Route path="/visitor" element={<VisitorPage />} />
      </Routes>
    </>
  );
}

export default App;
