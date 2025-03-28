import { useState, useContext, useEffect } from "react";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

const SurveyStep8 = () => {
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const navigate = useNavigate();

  const categories = [
    "Satisface mis intereses",
    "Me exige según mis capacidades",
    "Responde a mis necesidades",
    "Encaja con mis expectativas",
    "Se ajusta a mis aspiraciones",
    "Concuerda con mis valores",
    "Facilita que mis méritos sean valorados con justicia",
    "Estimula mi compromiso laboral",
    "Me permite trabajar a gusto",
    "Me motiva a trabajar",
    "Me da sensación de libertad",
    "Me hace crecer personalmente",
    "Me permite desarrollar mis competencias profesionales",
    "Me proporciona identidad",
    "Me hace sentir útil"
  ];

  const [responses, setResponses] = useState(surveyData.adjustmentPeopleOrganization || {});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (surveyData.SujetoId) {
      const fetchUserData = async () => {
        const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setSurveyData(userSnapshot.data());
          setResponses(userSnapshot.data().adjustmentPeopleOrganization || {});
        }
      };
      fetchUserData();
    }
  }, [surveyData.SujetoId, setSurveyData]);

  const handleChange = (e, category) => {
    setResponses((prev) => ({
      ...prev,
      [category]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!surveyData.SujetoId) {
      console.error("Error: No se encontró el ID de la encuesta");
      return;
    }

    const updatedSurveyData = {
      ...surveyData,
      adjustmentPeopleOrganization: responses,
      lastStep: "step8",
      fechaActualizacion: new Date().toISOString(),
    };
    setSurveyData(updatedSurveyData);

    try {
      const surveyRef = doc(db, "surveys", surveyData.SujetoId.toString());
      await updateDoc(surveyRef, updatedSurveyData);
      navigate("/step9");
    } catch (error) {
      console.error("Error al actualizar la encuesta:", error);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-white py-3 shadow-sm">
          <h2>Organización del Trabajo</h2>
          <ProgressBar step={8} totalSteps={10} percentage={80} />
        </div>
        <p>Valores los siguientes aspectos de las condiciones de su trabajo donde 0 indicaría valor pésimo y 10 sería el valor óptimo</p>
        <p>La actual organización del trabajo de mi centro:</p>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table table-bordered">
              <thead className="sticky-top bg-white" style={{ position: "sticky", top: "0", backgroundColor: "white", zIndex: "1020" }}>
                <tr>
                  <th>Aspecto</th>
                  {[...Array(11).keys()].map((num) => (
                    <th key={num}>{num}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category}>
                    <td>{category}</td>
                    {[...Array(11).keys()].map((num) => (
                      <td key={num}>
                        <input
                          type="radio"
                          name={category}
                          value={num}
                          checked={responses[category] == num}
                          onChange={(e) => handleChange(e, category)}
                          required
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/step7")}>Atrás</button>
            <button type="submit" className="btn btn-primary">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyStep8;
