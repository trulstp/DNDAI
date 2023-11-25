import classes from "./Home.module.css";
import React from "react";
import { Link } from "react-router-dom";
import dragon from "../../Images/dragon.png";
import elf from "../../Images/elf.png";
import map from "../../Images/old-map.png";
import treasure from "../../Images/treasure-chest.png";

const Home = () => {
  return (
    <div className={classes.container}>
      <Link to='/encounter'>
        <div className={classes.square}>
          <img src={dragon} alt='monsters' />
          <p>Random Encounter</p>
        </div>
      </Link>
      <Link to='/creator'>
        <div className={classes.square}>
          <img src={elf} alt='Characters' />
          <p>Character Creator</p>
        </div>
      </Link>
      <Link to='/mapmaker'>
        <div className={classes.square}>
          <img src={map} alt='a map' />
          <p>Maps</p>
        </div>
      </Link>
      <Link to='/treasure'>
        <div className={classes.square}>
          <img src={treasure} alt='a treasure chest' />
          <p>Non-Combat Encounter</p>
        </div>
      </Link>
    </div>
  );
};

export default Home;
