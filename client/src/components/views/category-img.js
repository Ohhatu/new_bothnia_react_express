import React, { Component } from "react"
import axios from "axios"
import "../Cards.css"
import CardItem from "../CardItem"
/*sökvy */

class Category extends Component {
  constructor() {
    super()
    this.state = {
      searchResults: [],
      searchWord: "",
      serverURL: "http://localhost:5000",
    }
  }

  async componentDidMount() {
    //sets searchword
    var searchString = window.location.href
    searchString = searchString.substring(searchString.indexOf("?") + 1)
    await this.setState({ searchWord: searchString }) //await absolutely has an effect on this type of expression

    //searches DB
    const res = await axios.get(
      `${this.state.serverURL}/searchCategory`,
      { params: { searchWord: this.state.searchWord } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    this.setState({ searchResults: res.data })
  }

  render() {
    return (
      <div className="cards">
        <h1>RESULTS</h1>
        <div className="cards__container">
          <div className="cards__wrapper">
            <ul className="cards__items">
              {this.state.searchResults.map((value, index) => {
                return (
                  <CardItem
                    key={index}
                    src={`${this.state.serverURL}/image/${value}`}
                    text={value}
                    label={value} //category ska stå här
                    path={`/imageView?${value}`}
                  />
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default Category
