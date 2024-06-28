import styles from "./FirstPage.module.css";
import DangerPlaceBar_2nd from "../../components/DangerPlaceBar_2nd/DangerPlaceBar_2nd";
import Sidebar from "../../components/Sidebar/Sidebar.js";

const FirstPage = () => {
  return (
    <>
      <Sidebar />

      <div className={styles.content}>
        <DangerPlaceBar_2nd />
      </div>
    </>
  );
};

export default FirstPage;
