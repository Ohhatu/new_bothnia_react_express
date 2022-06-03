import React, { useState } from "react"
import "../App1.css"
import "./HeroSection.css"
import { Link } from "react-router-dom"
// import { TextField } from "@mui/material"

function HeroSection() {
  const [searchWord, setSearchWord] = useState("")

  const changeSearch = (e) => {
    setSearchWord(e.target.value)
  }

  return (
    <div className="hero-container">
      <h1>BOTHNIABYRÅN</h1>
      <div className="hero-btns"></div>

      <span>
        <input
          type="text"
          id="imagesearchbar"
          placeholder="Sök bilder..."
          title="imagesearchbar"
          onChange={changeSearch}
        />
        {/* <TextField
          fullWidth
          type="text"
          id="imagesearchbar"
          onChange={changeSearch}
        /> */}
        <button>
          <Link to={`/results?${searchWord}`} className="fa fa-search" />
        </button>
        {/*  <a href="/signup"><i className="fas fa-user fa_custom fa-2x" /></a>*/}
      </span>
    </div>
  )
}

export default HeroSection
