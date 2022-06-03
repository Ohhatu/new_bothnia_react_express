import React, { Component } from "react"
import axios from "axios"
import "../Cards.css"

import { InputLabel } from "@mui/material"

class Tips extends Component {
  constructor() {
    super()
    this.state = {
      file: "",
      filename: "Välj fil",
      uploadedFile: {},
      serverURL: "http://localhost:5000",
    }
    // Necessary to make functions work properly. Apparently an archaic solution, but works
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onUpload = this.onUpload.bind(this)
  }

  async onChange(e) {
    this.setState({ file: e.target.files[0], filename: e.target.files[0].name })
  }

  async onSubmit(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append("file", this.state.file)

    const res = await axios.post(`${this.state.serverURL}/tmp`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    const { fileName, filePath } = res.data //leaving exifdata just in case, even though it isn't used here

    await this.setState({ uploadedFile: { fileName, filePath } })
  }

  async onUpload(e) {
    e.preventDefault()

    // Leaving full metadata just in case
    var title = ""
    var description = document.getElementById("description").value
    var author = ""
    var category = ""
    var tags = ""
    var price = ""
    var externalImage = false
    var externalCount = ""
    var ifTip = true
    var datePublish = ""

    var finalMeta = {
      filename: this.state.filename,
      title: title,
      description: description,
      author: author,
      category: category,
      tags: tags,
      price: price,
      externalImage: externalImage,
      externalCount: externalCount,
      ifTip: ifTip,
      datePublish: datePublish,
    }

    // Manages manual metadata

    axios.post(`${this.state.serverURL}/meta`, finalMeta, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const formData = new FormData()
    formData.append("file", this.state.file)

    // Primary upload method and cleanup from tmp

    await axios.post(`${this.state.serverURL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("Bilden har laddats upp!")
  }

  render() {
    return (
      <>
        <div className="cards">
          <h1>TIPSA</h1>
          <div className="cards__container">
            <div className="cards__wrapper">
              <div className="cards__items">
                <form onSubmit={this.onSubmit}>
                  <div className="custom-file mb-4">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      onChange={this.onChange}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {this.state.filename}
                    </label>
                  </div>

                  <input
                    type="submit"
                    value="Upload"
                    className="btn btn-primary btn-block mt-4"
                  />

                  {this.uploadedFile ? (
                    <div className="row mt-5">
                      <div className="col-md-6 m-auto">
                        <h3 className="text-center">
                          {this.state.uploadedFile.fileName}
                        </h3>
                        <img
                          style={{ width: "100%" }}
                          src={this.state.uploadedFile.filePath}
                          alt=""
                        />
                      </div>
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>

          <div className="cards__container">
            <div className="cards__wrapper">
              <div className="cards__items">
                <form onSubmit={this.onUpload}>
                  <label htmlFor="meddelande"></label>
                  <textarea
                    id="description"
                    title="Meddelande"
                    placeholder="Skriv meddelande..."
                    style={{ height: 200 + "px" }}
                  ></textarea>
                  <InputLabel className="custom-file-label" size="large">
                    <input type="submit" id="customFile" />
                    Lämna tips
                  </InputLabel>
                </form>
                <div className="cards__item__info"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Tips
