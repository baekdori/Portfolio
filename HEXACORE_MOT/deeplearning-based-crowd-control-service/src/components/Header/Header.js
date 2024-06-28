import React from "react";
import styles from "./Header.module.css";

const Header = (props) => {
  const { paddingRight = "0px", width = "auto", style } = props;
  const headerStyle = {
    paddingRight: paddingRight,

    width: width,
    ...style
  };
  return <h1 className={`${styles.subject} firstRow`} style={headerStyle} >{props.children} </h1>;
};

export default Header;
