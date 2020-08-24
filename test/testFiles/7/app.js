import React, { Component, memo } from "react";
import { render } from "react-dom";

const Children = memo(({ name, handleClick }) => {
  console.log(`Имя: ${name}`);

  return (
    <h1 onClick={handleClick}>
      {name}
    </h1>
  );
});

export default class App extends Component {
  state = {
    name: "Пупа",
    dummy: false
  };

  toggleMessage = () => {
    const { name } = this.state;

    this.setState({ name: name === "Пупа" ? "Лупа" : "Пупа" });
  };

  toggleDummy = () => {
    this.setState({ dummy: !this.state.dummy });
  };

  showDummy = () => {
    console.log(this.state.dummy);
  };

  render() {
    const { name } = this.state;

    console.log("Рендер App");

    return (
      <React.Fragment>
        <Children name={name} handleClick={this.showDummy} />

        <button onClick={this.toggleMessage}>Изменить сообщение</button>
        <button onClick={this.toggleDummy}>Сделать пустое изменение</button>
      </React.Fragment>
    );
  }
}
