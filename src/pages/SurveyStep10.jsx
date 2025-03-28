import { useState, useContext, useEffect } from "react";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

const SurveyStep10 = () => {
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const navigate = useNavigate();

  // Mapeo de preguntas con números
  const categories = [
    "1. Me siento emocionalmente agotado por mi trabajo",
    "2. Me siento cansado al final de la jornada de trabajo",
    "3. Me siento fatigado cuando me levanto por la mañana y tengo que enfrentarme a otro día de trabajo",
    "4. Fácilmente comprendo cómo se sienten las personas que tengo que atender",
    "5. Creo que trato a algunas personas como si fueran objetos impersonales",
    "6. Trabajar todo el día con personas es realmente estresante para mí",
    "7. Trato con mucha efectividad los problemas de las personas",
    "8. Siento que mi trabajo me está desgastando",
    "9. Siento que estoy influyendo positivamente en la vida de los demás con mi trabajo",
    "10. Me he vuelto insensible con la gente desde que ejerzo esta ocupación",
    "11. Me preocupa el hecho de que este trabajo me esté endureciendo emocionalmente",
    "12. Me siento muy energético",
    "13. Me siento frustrado por mi trabajo",
    "14. Siento que estoy trabajando demasiado",
    "15. No me preocupa realmente lo que ocurra a algunas personas a las que doy servicio",
    "16. Trabajar directamente con personas me da estrés",
    "17. Fácilmente puedo crear un clima agradable en mi trabajo",
    "18. Me siento estimulado después de trabajar en contacto con personas",
    "19. He conseguido muchas cosas valiosas en este trabajo",
    "20. Me siento como si estuviera al límite de mis posibilidades",
    "21. En mi trabajo trato los problemas emocionales con mucha calma",
    "22. Creo que las personas a las que atiendo me culpan de sus problemas"
  ];

  const [responses, setResponses] = useState(surveyData.workFeelings || {});

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

  // Guardar la respuesta con un índice numérico en Firebase
  const handleChange = (e, index) => {
    setResponses((prev) => ({
      ...prev,
      [index + 1]: e.target.value, // Guardamos el índice en lugar del texto completo
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
      workFeelings: responses, // Ahora almacena los datos con claves numéricas
      lastStep: "step10",
      fechaActualizacion: new Date().toISOString(),
    };
    setSurveyData(updatedSurveyData);

    try {
      const surveyRef = doc(db, "surveys", surveyData.SujetoId.toString());
      await updateDoc(surveyRef, updatedSurveyData);
      navigate("/surveyCompleted");
    } catch (error) {
      console.error("Error al actualizar la encuesta:", error);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-white py-3 shadow-sm">
          <h2>Sentimientos sobre el Trabajo</h2>
          <ProgressBar step={10} totalSteps={10} percentage={100} />
        </div>

        <p>Lea cuidadosamente cada enunciado y marque la casilla correspondiente a la frecuencia de sus sentimientos acerca del trabajo donde labora, las opciones a marcar son:</p>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table table-bordered">
              <thead className="sticky-top bg-white" style={{ position: "sticky", top: "0", backgroundColor: "white", zIndex: "1020" }}>
                <tr>
                  <th>Aspecto</th>
                  <th>0 (Nunca)</th>
                  <th>1 (Casi nunca)</th>
                  <th>2 (Algunas veces)</th>
                  <th>3 (Regularmente)</th>
                  <th>4 (Bastantes veces)</th>
                  <th>5 (Casi siempre)</th>
                  <th>6 (Siempre)</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <td>{category}</td>
                    {[...Array(7).keys()].map((num) => (
                      <td key={num}>
                        <input
                          type="radio"
                          name={`question-${index + 1}`} // Nombre único para cada pregunta
                          value={num}
                          checked={responses[index + 1] == num}
                          onChange={(e) => handleChange(e, index)}
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/step9")}>Atrás</button>
            <button type="submit" className="btn btn-success">Finalizar Encuesta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyStep10;
