import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./ThirdPage.module.css";

const ThirdPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>ThirdPage</div>
    </>
  );
};

export default ThirdPage;
