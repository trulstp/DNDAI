import classes from "./InputSection.module.css";
import FormSelect from "../Select/FormSelect";
import Button from "../Buttons/Button";
import { locations, numbersArray } from "../../Arrays/options";

const InputSection = (props) => {
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
      <h1 className={classes.title}>Create a Random Encounter</h1>
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
        <Button className={classes.submit} onClick={props.getMessages}>
          Roll an Encounter
        </Button>
      </div>
    </div>
  );
};

export default InputSection;
