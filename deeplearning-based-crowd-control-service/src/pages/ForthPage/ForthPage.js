import Sidebar from "../../components/Sidebar/Sidebar.js";
import GenderAgePieChart_2nd from "../../components/GenderAgePieChart_2nd/GenderAgePieChart_2nd";
import styles from "./ForthPage.module.css";

const ForthPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <GenderAgePieChart_2nd />
      </div>
    </>
  );
};

export default ForthPage;
