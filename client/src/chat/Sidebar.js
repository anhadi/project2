import React, { Component } from 'react';

import { slide as Menu } from "react-burger-menu";

export default class Sidebar extends Component {
  constructor(props){
    super(props)

    this.state={}
  }

  render(){
    const {userList, secret} = this.props
    const user = userList.map((user) => {
      return <li key={user.id}>{user.username}</li>
    })

    return (
      <Menu>
        <a className="menu-item" href="/burgers">
        <ul>
          {user}
        </ul>

          Burgers
          {secret}
        </a>

        <a className="menu-item" href="/pizzas">
          Pizzas
        </a>

        <a className="menu-item" href="/desserts">
          Desserts
        </a>
      </Menu>
    );
  }
};