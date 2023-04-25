import React, { useState } from 'react'
import "../css/Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import { NavigateFunction, useNavigate } from 'react-router-dom';
import DeviceFinder from '../apis/DeviceFinder';


interface NavigationProps{
  source: string,
  title?: string
}

const Navigation = ({source, title} : NavigationProps) => {
  const [input, setInput] = useState<string>("");
  let navigation: NavigateFunction = useNavigate();

  const handleSearch = async () => {
    if(input.trim() !== ""){
      try{
        const response = await DeviceFinder(`/?query=${input}`);
        console.log(response.data.data);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <section id="navigation-section">
      <nav className="navigation-panel">
        <img id="logo" src="/star-tech-logo.png" alt="Logo." onClick={() => navigation("/")}/>
        <form onSubmit={e => e.preventDefault()} className="search-bar-form">
          <button type="button" className="button-icon search" onClick={handleSearch}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          <input className="item-search" placeholder="Item name" type="text" onKeyUp={e => e.key === "Enter" ? handleSearch() : null} onChange={e => setInput(e.target.value)} value={input}/>
          <button type="button" className="button-icon delete" onClick={() => setInput("")} ><FontAwesomeIcon icon={faXmark} /></button>
        </form>
        <div className="icons">
          <button type="button" className="button-icon cart"><FontAwesomeIcon icon={faCartShopping} /></button>
          <button type="button" className="button-icon profile"><FontAwesomeIcon icon={faUser} /></button>
        </div>
      </nav>
      {title?<h1 id="title">{title}</h1> : null}
      {/* <video id="background-video" autoPlay muted loop playsInline>
        <source src={source}></source>
      </video> */}
    </section>
  )
}

export default Navigation
