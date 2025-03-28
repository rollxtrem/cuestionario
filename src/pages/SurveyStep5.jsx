import { useContext, useEffect } from "react";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig"; 
import { doc, updateDoc, getDoc } from "firebase/firestore"; 
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

const SurveyStep5 = () => {
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const navigate = useNavigate();

  const categories = [
    "Autonomía en la toma de decisiones profesionales",
    "Justicia en la contratación, remuneración y la promoción",
    "Oportunidades para la formación continua",
    "Vías de promoción laboral",
    "Participación en las decisiones organizacionales",
    "Relaciones con la dirección",
    "Evaluación del rendimiento profesional por la institución",
    "Apoyo recibido del personal directivo",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (surveyData.SujetoId) {
      const fetchUserData = async () => {
        const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setSurveyData(userSnapshot.data());
        }
      };
      fetchUserData();
    }
  }, [surveyData.SujetoId, setSurveyData]);

  const handleChange = (e, category) => {
    const { value } = e.target;
    setSurveyData((prev) => ({
      ...prev,
      workConditionsDeveloper: {
        ...prev.workConditionsDeveloper, 
        [category]: String(value),
      },
      lastStep: "step5",
      fechaActualizacion: new Date().toISOString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!surveyData.SujetoId) {
      console.error("Error: No se encontró el ID de la encuesta");
      return;
    }

    try {
      const surveyRef = doc(db, "surveys", surveyData.SujetoId.toString());
      await updateDoc(surveyRef, {
        workConditionsDeveloper: surveyData.workConditionsDeveloper,
        lastStep: "step5",
        fechaActualizacion: new Date().toISOString(),
      });

      console.log("Encuesta actualizada en Firebase");
      navigate("/step6");
    } catch (error) {
      console.error("Error al actualizar la encuesta:", error);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-white py-3 shadow-sm">
          <h2>Condiciones Laborales</h2>
          <ProgressBar step={5} totalSteps={10} percentage={50} />
        </div>
        <p>Valores los siguientes aspectos de las condiciones de su trabajo donde 0 indicaría valor pésimo y 10 sería el valor óptimo</p>
        <p>Valore los siguientes aspectos de las condiciones laborales de su centro:</p>

        <form onSubmit={handleSubmit} className="mt-3">
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
                          checked={surveyData.workConditionsDeveloper?.[category] === String(num)}
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/step4")}>Atrás</button>
            <button type="submit" className="btn btn-primary">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyStep5;
