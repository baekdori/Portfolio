import styles from "./SecondPage.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.js";

const SecondPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>SecondPage</div>
    </>
  );
};

export default SecondPage;
