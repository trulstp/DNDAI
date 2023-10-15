import classes from "./Home.module.css";
import React from "react";

const Home = () => {
  return (
    <div>
      <h1>DND AI</h1>
      <div className={classes.container}>
        <div className={classes.square}>
          <img src='image1.jpg' alt='Image 1' />
          <p>Text 1</p>
        </div>
        <div className={classes.square}>
          <img src='image2.jpg' alt='Image 2' />
          <p>Text 2</p>
        </div>
        <div className={classes.square}>
          <img src='image3.jpg' alt='Image 3' />
          <p>Text 3</p>
        </div>
        <div className={classes.square}>
          <img src='image4.jpg' alt='Image 4' />
          <p>Text 4</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
