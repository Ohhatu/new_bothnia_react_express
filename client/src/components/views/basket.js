import React, { Component } from "react"
import "../../App1.css"

export default class Basket extends Component {
  constructor() {
    super()
    this.state = {
      filename: [],
      title: [],
      price: [],
      total: "",
      serverURL: "http://localhost:5000",
    }
  }

  async removeItem(filename, title, price) {
    var valueToRemove = `${filename}|${title}|${price}`
    var newBasket = await sessionStorage.getItem("basket")
    newBasket = newBasket.split(",")
    var index = newBasket.indexOf(valueToRemove)
    newBasket.splice(index, 1)

    await sessionStorage.setItem("basket", newBasket)

    window.location.reload()
  }

  async componentDidMount() {
    /*sessionStorage.setItem("basket", [
      "Canon_40D.jpg|test123|400",
      "Canon_PowerShot_S40.jpg|test432|900",
    ])*/

    var basket = sessionStorage.getItem("basket")

    var newStateFilename = this.state.filename
    var newStateTitle = this.state.title
    var newStatePrice = this.state.price
    var newStateTotal = 0

    if (basket) {
      basket = basket.split(",")
      await basket.forEach((item, index) => {
        var basketItem = item.split("|")

        var filename = basketItem[0]
        var title = basketItem[1]
        var price = basketItem[2]
        var total = newStateTotal + parseInt(price)

        newStateFilename.push(filename)
        newStateTitle.push(title)
        newStatePrice.push(price)
        newStateTotal = total
      })
    }

    await this.setState({
      filename: newStateFilename,
      title: newStateTitle,
      price: newStatePrice,
      total: newStateTotal,
    })
  }

  emptyBasket() {
    sessionStorage.clear()
    window.location.reload()
  }

  render() {
    return (
      <div className="cards__container">
        <div className="cards__wrapper">
          {this.state.filename.map((value, index) => {
            if (value) {
              return (
                <div className="cards__items">
                  <li key={index}>
                    <ul>
                      <img
                        src={`${this.state.serverURL}/image/${value}`}
                        alt="chosen"
                      />
                      {` Titel: ${this.state.title[index]}`}
                      {` Pris: ${this.state.price[index]} sek `}
                      <button
                        onClick={() =>
                          this.removeItem(
                            this.state.filename[index],
                            this.state.title[index],
                            this.state.price[index]
                          )
                        }
                      >
                        Delete
                      </button>
                    </ul>
                  </li>
                </div>
              )
            } else {
              return <div className="cards__items"> Korgen är tom </div>
            }
          })}
          <div className="cards__items">{`Total summa: ${this.state.total} sek`}</div>
          <div className="cards__items">
            <button onClick={this.emptyBasket}> Till kassan </button>
          </div>
        </div>
      </div>
    )
  }
}
