/*holds all cards */
import React from "react"
import "./Cards.css"
import CardItem from "./CardItem"
/*body in homepage */
function Cards() {
  return (
    <div className="cards">
      <h1>KATEGORIER</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/inrikes/inrikes-kategori-bild.jpg"
              text="Utforska Sverige"
              label="Inrikes"
              path="/category?Inrikes"
            />
            <CardItem
              src="images/utrikes/utrikes-kategori-bild.jpeg"
              text="Utforska Internationella Bilder"
              label="Utrikes"
              path="/category?Utrikes"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="images/img-3.jpg"
              text="Set Sail in the Atlantic Ocean visiting Uncharted Waters"
              label="Sport"
              path="/category?Sport"
            />
            <CardItem
              src="images/img-4.jpg"
              text="Experience Football on Top of the Himilayan Mountains"
              label="Ekonomi"
              path="/category?Ekonomi"
            />
            <CardItem
              src="images/img-4.jpg"
              text="Experience Football on Top of the Himilayan Mountains"
              label="Nöje"
              path="/category?Noje"
            />
            <CardItem
              src="images/img-4.jpg"
              text="Experience Football on Top of the Himilayan Mountains"
              label="Kultur"
              path="/cateogry?Kultur"
            />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Cards
