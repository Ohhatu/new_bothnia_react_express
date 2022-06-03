import React, { useState } from "react"
import "./App1.css"
import Basket from "./components/views/basket"
import Home from "./components/views/Home"
import ImageView from "./components/views/imageView"
import Edit from "./components/views/edit"
import Results from "./components/views/results"
import Tips from "./components/views/tips"
import Upload from "./components/views/upload"
import SignUp from "./components/views/SignUp"
import Loggedin from "./components/views/Loggedin" //page when logged in
import Login from "./components/views/Login" //page when logged in
//import { useLocation } from "react-router-dom"
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  //Redirect,
} from "react-router-dom"
//import IndexHeader from "./components/indexHeader"
import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import Footer from "./components/Footer"
import Category from "./components/views/category-img"

function App() {
  const [auth, setAuth] = useState(false)
  const location = useLocation()
  //the state that will be holding your cart object for the entire app.
  //const [cart, setCart] = useState()

  /**
   * There is some logic to make sure the user selects a variant
   *  (it's required to select a variant in order to add it to the cart). 
   * Note that the quantity has been hard-code to 1 because the cart page 
   * is where a customer can change the quantity. Lastly, upon a successful 
   * response you'll want to add the cart object to the global cart state.
   * @param {*} productId 
   * @param {*} variantInfo 
 
    const addToCart = (productId, variantInfo) => {

      if (variantInfo) {
        commerce.cart.add(productId, 1, variantInfo)
          .then(res => {
            setCart(res.cart)
          })
      } else {
        window.alert('Please Select a Shirt Size')
      }
    }
  */
  return (
    <div className="App">
      <header>
        <Navbar />
        <HeroSection />
      </header>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/basket" element={<Basket setAuth={setAuth} />} />
        <Route exact path="/imageView" element={<ImageView />} />
        <Route exact path="/tips" element={<Tips />} />
        <Route exact path="/edit" element={<Edit />} />
        <Route exact path="/results" element={<Results />} />
        <Route exact path="/category" element={<Category />} />
        <Route exact path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/Loggedin" element={<Loggedin setAuth={setAuth} />} />
        <Route path="/signup" element={<SignUp setAuth={setAuth} />} />
        <Route
          exact
          path="/"
          element={
            auth ? (
              <Home setAuth={setAuth} />
            ) : (
              <Navigate to="/login" state={{ from: location }} replace />
            )
          }
        />
      </Routes>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
export default App
