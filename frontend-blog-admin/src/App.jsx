// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

import { Outlet, Link, NavLink } from "react-router-dom";
// import styles from "./styles/App.module.css"
import Navbar from "./components/Navbar";

//try to make app smaller than my last react project. https://github.com/magic-doggo/Project-Shopping-Cart/blob/main/src/App.jsx
//move logic into the smaller pages that need it. use context api, learned after the shopping cart https://www.theodinproject.com/lessons/node-path-react-new-managing-state-with-the-context-api
export default function App() {
  return (
    <div className="admin-layout">
      <Navbar/>

      <main>
        <Outlet/>
      </main>
    </div>
  )
}
