import React, { useState } from "react";

function Example01() {
  const [state, setState] = useState({ text: "" });

  const handleChange = (e) => {
    setState({ [e.target.name]: e.target.value });
  };

  const onClick = () => {
    const textbox = {
      inText: state.text,
    }; 

    fetch("http://localhost:4000/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(textbox),
    })
      .then((res) => {
        return res.json(); // res.json()을 반환해야 합니다.
      })
      .then((json) => {
        console.log(json);
        // 클래스형 컴포넌트에서는 this.setState(...)를 사용하지만,
        // 함수형 컴포넌트에서는 setState(...)를 사용합니다.
        setState({
          text: json.text,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div>
      <input name="text" onChange={handleChange}></input>
      <button onClick={onClick}>전송</button>
      <h3>{state.text}</h3>
    </div>
  );
}

export default Example01;
