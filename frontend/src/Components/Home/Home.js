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
      <div className={classes.square}>
        <Link to='/encounter'>
          <img src={dragon} alt='monsters' />
          <p>Random Encounter</p>
        </Link>
      </div>

      <div className={classes.square}>
        <Link to='/creator'>
          <img src={elf} alt='Characters' />
          <p>Character</p>
        </Link>
      </div>
      <div className={classes.square}>
        <Link to='/mapmaker'>
          <img src={map} alt='a map' />
          <p>Maps</p>
        </Link>
      </div>
      <div className={classes.square}>
        <Link to='/treasure'>
          <img src={treasure} alt='a treasure chest' />
          <p>Treasure</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
