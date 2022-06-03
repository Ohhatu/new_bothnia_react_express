import React, { Component } from "react"
import axios from "axios"
import "../Cards.css"
import CardItem from "../CardItem"

class Results extends Component {
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
    await this.setState({ searchWord: searchString.split("%20") }) //await absolutely has an effect on this type of expression

    //searches DB
    const res = await axios.get(
      `${this.state.serverURL}/search`,
      { params: { searchWord: this.state.searchWord } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    this.setState({ searchResults: res.data })
  }
  // gör bilden till en knapp så att den kan länkas till imageview
  render() {
    // let easing = [0.6, -0.05, 0.01, 0.99]

    // const animate = {
    //   opacity: 1,
    //   y: 0,
    //   transition: {
    //     duration: 0.6,
    //     ease: easing,
    //     delay: 0.16,
    //   },
    // }
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
                  /*
            return (
              <li key={index}>
                <p>
                  <img src={`${this.state.serverURL}/image/${value}`} />
                </p>
                {value}
              </li>
            )*/
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default Results
