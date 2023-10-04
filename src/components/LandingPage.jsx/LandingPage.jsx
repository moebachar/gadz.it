import React from "react";
import NavBar from "../navbar/NavBar";
import Calendar from "../calendar/Calendar";
import WorkshopsFram from "../workshopsFram/WorkshopsFram";
import Members from "../members.jsx/Members";
import Footer from "../footer/Footer";
import JoinUs from "../joinUs/JoinUs";
import "./landingPage.css";

//Firebase
import { useAuth } from "../../utils/authContext";
import AlternativeCarousel from "../alternativeCarousel/AlternativeCarousel";
import AlternativeWorkshopsFrame from "../alternativeWorkshopsFrame/AlternativeWorkshopsFrame";

function LandingPage(props) {
  const { user } = useAuth();

  return (
    <>
      <NavBar />
      <AlternativeWorkshopsFrame />
      <JoinUs endDate={new Date(2023, 9, 5, 19, 27)} />
      <main>
        <AlternativeCarousel />
        {user && <Calendar />}
        {/* <WorkshopsFram /> */}
        {/* <div className="devider">Know About Us</div> */}
        <Members />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
