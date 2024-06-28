import styles from "./SecondPage.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import HeatMap from "../../components/HeatMap/HeatMap.js";

const SecondPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <HeatMap />
      </div>
    </>
  );
};

export default SecondPage;
