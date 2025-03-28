import { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

const SurveyStep6 = () => {
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const navigate = useNavigate();

  const categories = [
    "Entorno físico, instalaciones y equipamientos",
    "Recursos materiales y técnicos",
    "Prevención de riesgos laborales",
    "Servicios auxiliares (limpieza, seguridad. Etc.)",
  ];

  const [responses, setResponses] = useState(surveyData.materialWorkEnvironment || {});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (surveyData.SujetoId) {
      const fetchUserData = async () => {
        const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setSurveyData(userSnapshot.data());
          setResponses(userSnapshot.data().materialWorkEnvironment || responses);
        }
      };
      fetchUserData();
    }
  }, [surveyData.SujetoId, setSurveyData]);

  const handleChange = (e) => {
    setResponses((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      materialWorkEnvironment: responses,
      lastStep: "step6",
      fechaActualizacion: new Date().toISOString(),
    };
    setSurveyData(updatedSurveyData);

    try {
      const surveyRef = doc(db, "surveys", surveyData.SujetoId.toString());
      await updateDoc(surveyRef, updatedSurveyData);
      navigate("/step7");
    } catch (error) {
      console.error("Error al actualizar la encuesta:", error);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-white py-3 shadow-sm">
          <h2>Condiciones Laborales del Entorno</h2>
          <ProgressBar step={6} totalSteps={10} percentage={60} />
        </div>
        <p>Valores los siguientes aspectos de las condiciones de su trabajo donde 0 indicaría valor pésimo y 10 sería el valor óptimo.</p>
        <p>Valore las siguientes condiciones laborales de su entorno de trabajo:</p>

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
                {Object.entries(categories).map(([key, label]) => (
                  <tr key={key}>
                    <td>{label}</td>
                    {[...Array(11).keys()].map((num) => (
                      <td key={num}>
                        <input
                          type="radio"
                          name={key}
                          value={num}
                          checked={responses[key] === String(num)}
                          onChange={handleChange}
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/step5")}>Atrás</button>
            <button type="submit" className="btn btn-primary">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyStep6;
