import { createContext, useState, useEffect } from "react";

export const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  // Intentar cargar datos previos desde localStorage
  const storedSurveyData = JSON.parse(localStorage.getItem("surveyData")) || {
    id: null,
    personalInfo: {},
    workDetails: {},
    workSatisfaction: {},
  };

  const [surveyData, setSurveyData] = useState(storedSurveyData);

  // Guardar los datos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("surveyData", JSON.stringify(surveyData));
  }, [surveyData]);

  return (
    <SurveyContext.Provider value={{ surveyData, setSurveyData }}>
      {children}
    </SurveyContext.Provider>
  );
};
