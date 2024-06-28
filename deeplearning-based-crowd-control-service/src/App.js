import Sidebar from "./components/Sidebar/Sidebar.js";
import "./App.css";
import { Route, Routes } from "react-router";
import FirstPage from "./pages/FirstPage/FirstPage.js";
import SecondPage from "./pages/SecondPage/SecondPage.js";
import ThirdPage from "./pages/ThirdPage/ThirdPage.js";
import ForthPage from "./pages/ForthPage/ForthPage.js";
import FifthPage from "./pages/FifthPage/FifthPage.js";
import IndexPage from "./pages/IndexPage/IndexPage.js";
import Login from "./pages/Login/Login.js";
import Profile from "./pages/Profile/Profile.js";

function App() {
  return (
    <>
      {/* <Sidebar /> */}
      <div>
        <Routes>
          <Route exact path="/" element={<IndexPage />} />
          <Route exact path="/index" element={<FirstPage />} />
          <Route exact path="/inside" element={<SecondPage />} />
          <Route exact path="/detail" element={<ThirdPage />} />
          <Route exact path="/future" element={<ForthPage />} />
          <Route exact path="/notification" element={<FifthPage />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
