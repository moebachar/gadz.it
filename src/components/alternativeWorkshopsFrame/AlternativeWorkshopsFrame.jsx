import React from "react";
import studying from "../../assets/svg/Coding workshop-amico.svg";
import rocket from "../../assets/logo/rocket.ico";
import row from "../../assets/logo/row.ico";
import html from "../../assets/logo/html.ico";
import css from "../../assets/logo/css3.ico";
import python from "../../assets/logo/python.ico";
import cPlusPlus from "../../assets/logo/c-plus-plus.ico";
import "./alternativeWorkshopsFrame.scss";
import Course from "./Course";
import { useNavigate } from "react-router-dom";

function AlternativeWorkshopsFrame(props) {
  const navigate = useNavigate();
  return (
    <div className="our-courses">
      <div className="our-courses__heading">
        <img src={rocket} />
        Workshops Are Back
      </div>
      <div className="our-courses__main">
        <div className="our-courses__main__img">
          <img src={studying} />
        </div>
        <div className="our-courses__main__description">
          <div className="our-courses__main__description__heading">
            Improve your programming skills through out our courses
          </div>
          <div className="our-courses__main__description__text">
            Our very best members will guide you through a fun learning journey,
            in which you will gain basic knowledge about programming in various
            fields. Amazing interactive courses are available, so don't miss
            your chance to get involved.
          </div>
          <button
            type="button"
            className="our-courses__main__description__registration"
            onClick={() => navigate("/workshops-order")}
          >
            Registration <img src={row} />
          </button>
        </div>
      </div>
      <div className="our-courses__courses">
        <Course
          sources={[html, css]}
          name="Web Development"
          heading="How to build responsive web pages using latest technologies"
          footerText="Friendly beginners HTML/CSS course"
        />
        <Course
          sources={[python]}
          name="Python"
          heading="Take your first step in the Artificial intelligence field by learning Python"
          footerText="Friendly beginners Python course"
        />
        <Course
          sources={[cPlusPlus]}
          name="C++"
          heading="The essential C++ course"
          footerText="Friendly beginners c++ course"
        />
      </div>
      <button
        type="button"
        className="our-courses__registration--sub"
        onClick={() => navigate("/workshops-order")}
      >
        Registration <img src={row} />
      </button>
    </div>
  );
}

export default AlternativeWorkshopsFrame;
