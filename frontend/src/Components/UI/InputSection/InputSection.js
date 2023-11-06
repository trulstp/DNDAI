import classes from "./InputSection.module.css";

import FormSelect from "../Select/FormSelect";
import Button from "../Buttons/Button";

const InputSection = (props) => {
  const locations = [
    "abandoned buildings",
    "alien dimension",
    "ambush sites",
    "battlegrounds",
    "caves",
    "caverns",
    "coastal caves",
    "coastal cliffs",
    "cold caves",
    "deep caves",
    "desert sandy caverns",
    "drow cities",
    "duergar fortresses",
    "dungeons",
    "dungeons sewers",
    "dwarven halls",
    "elven cities",
    "forests",
    "fortresses",
    "glades",
    "graveyards",
    "haunted places",
    "icy mountains",
    "jungles",
    "lair",
    "magma caverns",
    "marshes",
    "mountain caverns",
    "mountain fortresses",
    "mountains",
    "oceans",
    "patrol routes",
    "plains",
    "ritual sites",
    "rocky terrains",
    "ruins",
    "strongholds",
    "swamps",
    "temples",
    "tombs",
    "tundras",
    "underground",
    "underground cities",
    "underdark",
    "volcanoes",
    "wastelands",
    "war camps",
    "warm caves",
  ];

  const numbersArray = Array.from({ length: 24 }, (_, index) => index + 1);

  const options = locations.map((location) => ({
    value: location,
    label: location,
  }));

  const SecondOptions = numbersArray.map((numbers) => ({
    value: numbers,
    label: numbers,
  }));

  const handleChange = (selectedOption) => {
    // Check if selectedOption is an array, and convert to an array if needed
    const selectedValues = Array.isArray(selectedOption)
      ? selectedOption.map((option) => option.value)
      : [selectedOption.value];
    props.setValue1(selectedValues.toString());
  };

  const handleChange2 = (selectedOption) => {
    props.setValue2(selectedOption.value.toString());
  };

  return (
    <div className={classes["bottom-section"]}>
      <div className={classes["select-section"]}>
        <FormSelect
          width='200px'
          options={options}
          placeholder={"Locations"}
          isMulti={false}
          name={"Locations"}
          onChange={handleChange}
        />
        <FormSelect
          width='200px'
          options={SecondOptions}
          placeholder={"Challenge Rating"}
          isMulti={false}
          name={"CR"}
          onChange={handleChange2}
        />
      </div>
      <Button className={classes.submit} onClick={props.getMessages}>
        Roll an Encounter
      </Button>
    </div>
  );
};

export default InputSection;

/* <input
          value={props.value1}
          onChange={(e) => props.setValue(e.target.value)}
        />
        <Button className={classes.submit} onClick={props.getMessages}>
          ➢
        </Button> */

/* <div className="container" onClick={}></div>
        <div className="container" onClick={}></div>
        <Button className={classes.submit} onClick={props.getMessages} /> */
