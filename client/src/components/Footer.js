import React from "react"
import "./Footer.css"
import { Button } from "./Button"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <div className="footer-container">
      <section className="footer-subscription">
        <p className="footer-subscription-heading">
          Prenumerera Bothniabyrån och få direkt uppdateringar från vårt
          bildarkivet.
        </p>
        <p className="footer-subscription-text">
          Du kan säga upp ditt konto när du vill.
        </p>
        <div className="input-areas">
          <form>
            <input
              className="footer-input"
              name="email"
              type="email"
              placeholder="Din Email"
            />
            <Button buttonStyle="btn--outline">Prenumerera</Button>
          </form>
        </div>
      </section>
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Om Oss</h2>
            <Link to="/">Hur de funkar</Link>
            <Link to="/">Rekommendationer</Link>
            <Link to="/">Karriärer</Link>
            <Link to="/">Investerare</Link>
            <Link to="/">Användarvillkor</Link>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Kontakta Oss</h2>
            <Link to="/tips">Kontakt</Link>
            <Link to="/tips">Support</Link>
            <Link to="/tips">Sponsorskap</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              BB
              <i className="fab fa-typo3" />
            </Link>
          </div>
          <small className="website-rights">BB © 2022</small>
          <div className="social-icons">
            <Link
              className="social-icon-link facebook"
              to="/"
              target="_blank"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </Link>
            <Link
              className="social-icon-link instagram"
              to="/"
              target="_blank"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </Link>
            <Link
              className="social-icon-link youtube"
              to="/"
              target="_blank"
              aria-label="Youtube"
            >
              <i className="fab fa-youtube" />
            </Link>
            <Link
              className="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter" />
            </Link>
            <Link
              className="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Footer
