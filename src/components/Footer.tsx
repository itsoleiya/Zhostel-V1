import { site } from "../data/site";
import { useInView } from "./Chrome";
import { AmenityIcon } from "./Icons";
import "./Footer.css";

export default function Footer() {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div ref={ref} className={`help-strip${inView ? " is-active" : ""}`}>
          <AmenityIcon name="reception" size={34} />
          <span className="help-strip__title">
            Need Help. <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].label}</a> |{" "}
            <a href={`tel:${site.phones[1].tel}`}>{site.phones[1].label}</a>
          </span>
          <p>{site.helpText}</p>
        </div>

        <div className="site-footer__grid">
          <div>
            <div className="site-footer__brand title-bar">{site.name}</div>
            <h3>{site.footerTitle}</h3>
            <p>{site.copyright}</p>
          </div>
          <div>
            <h4>Address</h4>
            <p><a href={site.mapLink} target="_blank" rel="noopener noreferrer">{site.address}</a></p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />T / <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].label}</a>
              <br />M/ <a href={`tel:${site.phones[1].tel}`}>{site.phones[1].label}</a>
            </p>
          </div>
          <div>
            <h4>Follow Us</h4>
            <ul>
              <li><a href={site.social.facebookFooter} target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
