import React, { Fragment, Component } from "react"
import axios from "axios"
import "../../App1.css"

import {
  Stack,
  Select,
  MenuItem,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material"

import { motion } from "framer-motion"

class Edit extends Component {
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
      externalImage: "false",
      externalCount: "",
      ifTip: "false", //not necessary, but am leaving it here for future funcitonality and ensuring that no 'undefined' issues occur
      datePublish: "",
      automaticMetadata: {},
    }
    // Necessary to make async onChange functions work properly. Apparently an archaic solution, but works
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeAuthor = this.onChangeAuthor.bind(this)
    this.onChangeCategory = this.onChangeCategory.bind(this)
    this.onChangeTags = this.onChangeTags.bind(this)
    this.onChangePrice = this.onChangePrice.bind(this)
    this.onChangeExternalImage = this.onChangeExternalImage.bind(this)
    this.onChangeExternalCount = this.onChangeExternalCount.bind(this)
    this.onChangeDatePublish = this.onChangeDatePublish.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  async componentDidMount() {
    //Sets the filename based off of the route
    var editString = window.location.href
    editString = editString.substring(editString.indexOf("?") + 1)
    await this.setState({ filename: editString })

    //Retrieves the image metadata that is being edited
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

    this.setState({
      title: res.data["title"],
      description: res.data["description"],
      author: res.data["author"],
      category: res.data["category"],
      tags: res.data["tags"],
      price: res.data["price"],
      externalImage: res.data["externalImage"],
      externalCount: res.data["externalCount"],
      ifTip: res.data["ifTip"],
      datePublish: res.data["datePublish"],
      automaticMetadata: res.data["exif"],
    })
  }

  // Submits the finalized changes to backend
  async onSubmit(e) {
    e.preventDefault()

    var newEdit = {
      filename: this.state.filename,
      newFilename: this.state.newFilename,
      title: this.state.title,
      description: this.state.description,
      author: this.state.author,
      category: this.state.category,
      tags: this.state.tags,
      price: this.state.price,
      externalImage: this.state.externalImage,
      externalCount: this.state.externalCount,
      ifTip: this.state.ifTip,
      datePublish: this.state.datePublish,
      automaticMetadata: this.state.automaticMetadata,
    }

    axios.post(`${this.state.serverURL}/submitEdit`, newEdit, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
        "Access-Control-Allow-Headers":
          "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control",
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("Redigering är sparad!")
  }

  // Sets this.state variables to whatever is handled by input
  // There probably is a way to combine the following onChange functions, I am not putting down any time on figuring it out right now
  async onChangeTitle(e) {
    e.preventDefault()

    await this.setState({ title: document.getElementById("title").value })
  }

  async onChangeDescription(e) {
    e.preventDefault()

    await this.setState({
      description: document.getElementById("description").value,
    })
  }

  async onChangeAuthor(e) {
    e.preventDefault()

    await this.setState({ author: document.getElementById("author").value })
  }

  async onChangeCategory(e) {
    e.preventDefault()

    await this.setState({ category: document.getElementById("category").value })
  }

  async onChangeTags(e) {
    e.preventDefault()

    var tagsBeforeSplit = document.getElementById("tags").value
    await this.setState({ tags: tagsBeforeSplit.split(",") })
  }

  async onChangePrice(e) {
    e.preventDefault()

    await this.setState({ price: document.getElementById("price").value })
  }

  async onChangeExternalImage(e) {
    e.preventDefault()

    await this.setState({
      externalImage: document.getElementById("title").checked,
    })
  }

  async onChangeExternalCount(e) {
    e.preventDefault()

    await this.setState({
      externalCount: document.getElementById("externalCount").value,
    })
  }

  async onChangeDatePublish(e) {
    e.preventDefault()

    await this.setState({
      datePublish: document.getElementById("datePublish").value,
    })
    console.log(this.state.datePublish)
  }

  render() {
    let easing = [0.6, -0.05, 0.01, 0.99]

    const animate = {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easing,
        delay: 0.16,
      },
    }

    return (
      <Fragment>
        <div className="cards">
          <div className="cards__container">
            <div className="cards__wrapper">
              <div className="cards__items">
                {/*https://mui.com/material-ui/react-checkbox/#main-content*/}
                <form onSubmit={this.onSubmit}>
                  <Stack spacing={3}>
                    <label htmlFor="image">
                      {" "}
                      Filnamn: {this.state.filename}{" "}
                    </label>
                    <img
                      id="image"
                      style={{ width: "100%" }}
                      src={`${this.state.serverURL}/image/${this.state.filename}`}
                      alt=""
                    />
                    <Stack
                      component={motion.div}
                      initial={{ opacity: 0, y: 60 }}
                      animate={animate}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <TextField
                        fullWidth
                        label={`Titel: ${this.state.title}`}
                        id="title"
                        defaultValue={this.state.title}
                        onChange={this.onChangeTitle}
                      />

                      <TextField
                        fullWidth
                        label={`Beskrivning: ${this.state.description}`}
                        htmlFor="description"
                        id="description"
                        defaultValue={this.state.description}
                        onChange={this.onChangeDescription}
                      />
                    </Stack>

                    <Stack
                      component={motion.div}
                      initial={{ opacity: 0, y: 60 }}
                      animate={animate}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <TextField
                        fullWidth
                        label={`Fotograf: ${this.state.author}`}
                        htmlFor="author"
                        id="author"
                        defaultValue={this.state.author}
                        onChange={this.onChangeTitle}
                      />
                      <Select
                        labelId="category"
                        id="select"
                        value=""
                        onChange={this.onChangeCategory}
                        fullWidth
                      >
                        <MenuItem value={this.state.category}>
                          {this.state.category}
                        </MenuItem>
                        <MenuItem value="Inrikes"> Inrikes</MenuItem>
                        <MenuItem value="Utrikes"> Utrikes</MenuItem>
                        <MenuItem value="Nöje"> Nöje </MenuItem>
                        <MenuItem value="Sport"> Sport</MenuItem>
                        <MenuItem value="Kultur"> Kultur</MenuItem>
                        <MenuItem value="Ekonomi"> Ekonomi</MenuItem>
                      </Select>
                    </Stack>
                    <Stack
                      component={motion.div}
                      initial={{ opacity: 0, y: 60 }}
                      animate={animate}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <TextField
                        fullWidth
                        label={`Taggar, med komma: ${this.state.tags}`}
                        htmlFor="tags"
                        id="tags"
                        defaultValue={this.state.tags}
                        onChange={this.onChangeTags}
                      />
                      {/*
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        
                          <MobileDatePicker
                          label="datePublish"
                            value={value}
                            onChange={(newValue) => {
                              setValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                      </LocalizationProvider>*/}

                      <TextField
                        fullWidth
                        htmlFor="datePublish"
                        type="date"
                        id="datePublish"
                        defaultValue={this.state.datePublish}
                        onChange={this.onChangeDatePublish}
                      />
                    </Stack>
                    <Stack
                      component={motion.div}
                      initial={{ opacity: 0, y: 60 }}
                      animate={animate}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <TextField
                        fullWidth
                        label={`Pris: ${this.state.price}`}
                        htmlFor="price"
                        id="price"
                        defaultValue={this.state.price}
                        onChange={this.onChangePrice}
                      />

                      <TextField
                        fullWidth
                        label={`Tillåtna nedladdningar: ${this.state.externalCount}`}
                        htmlFor="externalCount"
                        id="externalCount"
                        defaultValue={this.state.externalCount}
                        onChange={this.onChangeExternalCount}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="success"
                            id="externalImage"
                            name="yes"
                            onChange={this.onChangeExternalImage}
                          />
                        }
                        label="Är bilden extern?"
                      />
                    </Stack>
                    <Box>
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        SPARA REDIGERING
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}
export default Edit
