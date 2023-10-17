import React, { useState } from "react";
import classes from "./ImageTester.module.css";

const ImageTester = () => {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState("");

  const surpriseOptions = [
    "A painting of a sunflower in a purple vase",
    "A painting of a sunflower in a blue vase",
    "a man with a hat",
    "a pineapple sunbathing on an island",
  ];

  const getImages = async () => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:4000/app/images", options);
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(value);

  return (
    <div>
      <section className={classes.searchSection}>
        <p>
          Start with a detailed description
          <span className={classes.surprise} onClick>
            Surprise me
          </span>
        </p>
        <div className={classes.inputContainer}>
          <input
            value={value}
            placeholder='An impressionist oil painting 
                          of a sunflower in a purple vase'
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={getImages}>Generate</button>
        </div>
      </section>
      <section className={classes.imageContainer}>
        {images?.map((image, index) => (
          <img key={index} src={image.url} alt={`generated ${value}`} />
        ))}
      </section>
    </div>
  );
};

export default ImageTester;
