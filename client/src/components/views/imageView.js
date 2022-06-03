import React, { Component } from "react"
import "../../App1.css"
import { Link } from "react-router-dom"
import axios from "axios"
import { Button } from "@mui/material"
import CardItem from "../CardItem"
import "../Cards.css"
/*en specik bild */

export default class ImageView extends Component {
  constructor() {
    super()
    this.state = {
      filename: "",
      serverURL: "http://localhost:5000",
      title: "",
      description: "",
      author: "",
      category: "",
      tags: [],
      price: "",
      datePublish: "",
      automaticMetadata: {},
      model: "",
      gpsLat: "",
      gpsLon: "",
      focalLength: "",
      resolution: "",
    }
    this.addToBasket = this.addToBasket.bind(this)
  }

  async componentDidMount() {
    var editString = window.location.href
    editString = editString.substring(editString.indexOf("?") + 1)
    await this.setState({ filename: editString })

    const res = await axios.get(
      `${this.state.serverURL}/editSearch`,
      { params: { fileName: this.state.filename } },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
          "Access-Control-Allow-Headers":
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control",
        },
      }
    )

    var gpsLat = 0
    var gpsLon = 0
    if (res.data["exif"]["gps"]["GPSLatitude"]) {
      gpsLat = `${res.data["exif"]["gps"]["GPSLatitude"]["0"]}.${res.data["exif"]["gps"]["GPSLatitude"]["1"]} ${res.data["exif"]["gps"]["GPSLatitudeRef"]}`
      gpsLon = `${res.data["exif"]["gps"]["GPSLongitude"]["0"]}.${res.data["exif"]["gps"]["GPSLongitude"]["1"]} ${res.data["exif"]["gps"]["GPSLongitudeRef"]}`
    }

    await this.setState({
      title: res.data["title"],
      description: res.data["description"],
      author: res.data["author"],
      category: res.data["category"],
      tags: res.data["tags"],
      price: res.data["price"],
      datePublish: res.data["datePublish"],
      automaticMetadata: res.data["exif"],
      model: res.data["exif"]["image"]["Model"],
      gpsLat: gpsLat,
      gpsLon: gpsLon,
      resolution: `${res.data["exif"]["exif"]["ExifImageWidth"]}x${res.data["exif"]["exif"]["ExifImageHeight"]}`,
      focalLength: res.data["exif"]["exif"]["FocalLength"],
    })
    //sessionStorage.clear()
  }

  addToBasket() {
    var newBasket = []
    if (sessionStorage.getItem("basket")) {
      newBasket = [sessionStorage.getItem("basket")]
    }
    newBasket.push(
      `${this.state.filename}|${this.state.title}|${this.state.price}`
    )

    newBasket = [...new Set(newBasket)]
    sessionStorage.setItem("basket", newBasket)

    alert("Bilden har lagts i korgen!")
  }

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
      <>
        <div className="cards">
          <h1>KATEGORIER</h1>
          <div className="cards__container">
            <div className="cards__wrapper">
              <ul className="cards__items">
                <CardItem
                  src={`${this.state.serverURL}/image/${this.state.filename}`}
                  text=""
                  label={`${this.state.filename}`}
                  alt=""
                  path="/imageView"
                />

                <div>
                  <div> {`${this.state.title}`} </div>
                  <div> {`# ${this.state.tags}`}</div>
                  <div> {`${this.state.price} kr`}</div>
                </div>
                <div>
                  <div>{`${this.state.description}`}</div>
                  <div> {`Fotograf: ${this.state.author}`}</div>
                </div>
                <div>
                  <div> Datum: {this.state.datePublish}</div>
                  <div> Format: {`jpg/jpeg`}</div>
                  <div> Upplösning: {this.state.resolution}</div>
                  <div> Kamera: {this.state.model}</div>
                  <div> Fokallängd: {this.state.focalLength} mm</div>
                  <div> GPS: {`${this.state.gpsLat} ${this.state.gpsLon}`}</div>
                </div>

                <div>
                  <Button
                    onClick={this.addToBasket}
                    size="large"
                    type="submit"
                    variant="outlined"
                  >
                    KÖP
                  </Button>

                  <Link to={`/edit?${this.state.filename}`}>
                    <Button size="large" type="submit" variant="outlined">
                      REDIGERA
                    </Button>
                  </Link>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }
}
