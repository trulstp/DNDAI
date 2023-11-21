// useCharacterForm.js
import { useState } from "react";
import { raceOptions, classTypeOptions, levelOptions } from "../Arrays/options";

const useCharacterForm = () => {
  const [selections, setSelections] = useState({
    name: "",
    race: raceOptions[0].value,
    classType: classTypeOptions[0].value,
    level: levelOptions[0].value,
  });

  const handleChange = (field, value) => {
    setSelections({ ...selections, [field]: value });
  };

  return { selections, handleChange };
};

export default useCharacterForm;
