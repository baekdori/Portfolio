import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./Profile.module.css";

const Profile = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>Profile Page</div>
    </>
  );
};

export default Profile;
