import React from "react";
import "./Footer.scss";
import App from "../../assets/images/App-Store.png";
import Phone from "../../assets/images/Google-Play.png";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div className="top1">
          <h2>Mamays</h2>
          <div className="tagline">
            <p style={{ color: '#4f4f4f', fontSize: '14px' }}>
              Conectando el sabor del hogar con tu comunidad.
            </p>
          </div>
        </div>
        <div className="bottom1">
          <div className="bottomContent">
            <h4>ABOUT MAMAYS</h4>
            <p>who we are</p>
            <p>blog</p>
            <p>work with us</p>
            <p>Investor Relations</p>
            <p>Report Fraud</p>
            <p>Contact Us</p>
          </div>
          <div className="bottomContent">
            <h4>MAMAYSVERSE</h4>
            <p>Mamays</p>
            <p>Blinkit</p>
            <p>Feeding India</p>
            <p>HyperPure</p>
            <p>Mamaysland</p>
          </div>
          <div className="bottomContent">
            <h4>FOR RESTAURANTS</h4>
            <p>Patner with Us</p>
            <p>Apps For you</p>
            <h4>For Enterprises</h4>
            <p>Mamays for work</p>
          </div>
          <div className="bottomContent">
            <h4>LEARN MORE</h4>
            <p>Privecy</p>
            <p>Security</p>
            <p>Terms</p>
            <p>Sitemap</p>
          </div>
          <div className="bottomContent">
            <h4>SOCIAL LINKS</h4>
            <div className="links">
              <a href="https://www.facebook.com/people/Mamays/61565651845073/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                <FacebookIcon />
              </a>
              <LinkedInIcon />
              <TwitterIcon />
              <InstagramIcon />
              <YouTubeIcon />
            </div>
            <img src={App} alt="app" />
            <img src={Phone} alt="app" />
          </div>
        </div>
      </div>
      <hr />
      <div className="bottom">
        <p>
          By continuing past this page, you agree to our Terms of Service,
          Cookie Policy, Privacy Policy and Content Policies. All trademarks are
          properties of their respective owners. 2008-2022 © Mamays™ Ltd. All
          rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
