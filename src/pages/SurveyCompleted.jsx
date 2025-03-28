import { useState, useEffect, useContext } from "react";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const SurveyCompleted = () => {
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const navigate = useNavigate();
  const [blanchScore, setBlanchScore] = useState(null);
  const [burnoutScores, setBurnoutScores] = useState(null);
  const [description, setDescription] = useState("");
  const [burnoutDiagnosis, setBurnoutDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (surveyData.SujetoId) {
        const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setSurveyData(data);
          calculateBlanchScale(data);
          calculateBurnout(data.workFeelings || {});
        }
      }
    };
    fetchUserData();
  }, [surveyData.SujetoId, setSurveyData]);

  const calculateBlanchScale = (data) => {
    const getAverage = (category) => {
      const values = Object.values(data[category] || {}).map(Number);
      return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    };

    const scores = {
      "Regulación": getAverage("workConditionsRegulations"),
      "Desarrollo": getAverage("workConditionsDeveloper"),
      "Entorno Material": getAverage("materialWorkEnvironment"),
      "Entorno Social": getAverage("socialWorkEnvironment"),
      "Ajuste Organización-Persona": getAverage("adjustmentPeopleOrganization"),
      "Adaptación Persona-Organización": getAverage("adaptionPeopleOrganization"),
    };

    const allResponses = Object.values(scores);
    const totalScore = allResponses.length ? allResponses.reduce((a, b) => a + b, 0) / allResponses.length : 0;

    let desc = "";
    if (totalScore <= 2.9) desc = "🔥🔥 Condiciones de trabajo pésimas: Según este cuestionario (Blanch), su ambiente laboral es altamente negativo, tiene riesgos físicos, emocionales o psicológicos severos, sobrecarga laboral y falta de control sobre las tareas; las relaciones laborales son conflictivas y hay falta de apoyo por parte de los superiores o compañeros, con escasa o nula estabilidad laboral y bajos salarios.";
    else if (totalScore <= 5.9) desc = "🔥 Condiciones de trabajo malas: Según este cuestionario (Blanch), en su trabajo existen problemas laborales significativos, aunque no extremos. Puede haber sobrecarga laboral o falta de recursos para realizar las tareas, el clima laboral es tenso o con poco apoyo, existe inseguridad laboral o los salarios son insuficientes en relación con el esfuerzo y hay estrés laboral frecuente.";
    else if (totalScore <= 8.9) desc = "⚠ Condiciones de trabajo buenas: Según este cuestionario (Blanch), el trabajador percibe un entorno laboral adecuado y funcional. Hay buen equilibrio entre las exigencias y los recursos disponibles, el clima laboral es mayormente positivo con apoyo de compañeros y superiores, la remuneración es aceptable y hay estabilidad. Los niveles de estrés son moderados o bajos.";
    else desc = "✅ Condiciones de trabajo óptimas: Según este cuestionario (Blanch), el trabajador percibe su entorno como ideal. Hay recursos suficientes para desempeñar las tareas sin sobrecarga, el clima laboral es excelente, las relaciones interpersonales son positivas, hay buena estabilidad y condiciones contractuales favorables, con alta satisfacción y bienestar en el trabajo.";

    setBlanchScore(scores);
    setDescription(desc);
  };

  const calculateBurnout = (responses) => {
    const sumValues = (indexes) =>
      indexes.reduce((sum, index) => sum + (parseInt(responses[index]) || 0), 0);

    const CE = sumValues([1, 2, 3, 6, 8, 13, 14, 20]);
    const DP = sumValues([5, 10, 11, 15, 16, 22]);
    const RP = sumValues([4, 7, 9, 12, 17, 18, 19, 21]);

    setBurnoutScores({ CE, DP, RP });

    let diagnosis = "";
    let recommendationsList = [];

    if (CE >= 27 || DP >= 10 || RP <= 33) {
      diagnosis = "🔥 Alto riesgo de Burnout: Presentas altos niveles de cansancio emocional y despersonalización, lo que indica una gran fatiga y distanciamiento del trabajo.";
      recommendationsList = ["Es importante buscar apoyo, delegar tareas y considerar estrategias para manejar el estrés", "Consultar con un especialista podría ser beneficioso."];
    } else if ((CE >= 17 && CE <= 26) || (DP >= 6 && DP <= 9) || (RP >= 34 && RP <= 39)) {
      diagnosis = "⚠ Riesgo moderado de Burnout: Experimentas un nivel bajo de realización personal, lo que puede afectar la motivación y satisfacción en el trabajo.";
      recommendationsList = ["Practica técnicas de relajación", "Establece pausas activas", "Identificar aspectos positivos del trabajo, establecer metas claras y fomentar el reconocimiento de logros puede ayudar a mejorar la percepción laboral.", ];
    } else {
      diagnosis = "✅ Bajo riesgo de Burnout: Tus niveles de estrés y satisfacción laboral están equilibrados.";
      recommendationsList = ["Mantén hábitos saludables y estrategias de autocuidado para prevenir el desgaste laboral.", "Mantén un equilibrio vida-trabajo."];
    }

    setBurnoutDiagnosis(diagnosis);
    setRecommendations(recommendationsList);
  };

  return (
    <div 
    className="container-fluid d-flex justify-content-center align-items-center" 
    style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg text-center" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
      <h2>📊 ¡Gracias por completar el cuestionario!</h2>
      <p>Tu opinión es muy valiosa y nos ayudará a mejorar las condiciones laborales de nuestros profesionales.</p>
      {blanchScore && (
        <>
          <h3>Resultados de las Condiciones Laborales</h3>
          <p>{description}</p>
          <div className="d-flex justify-content-center">
          <RadarChart outerRadius={120} width={500} height={400} data={Object.entries(blanchScore).map(([key, value]) => ({ name: key, score: value }))}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar name="Escala de Blanch" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
          </div>
        </>
      )}
      {burnoutScores && (
        <>
          <h3>📊 Resultados de la Evaluación de Burnout</h3>
          <p>{burnoutDiagnosis}</p>
          <ul className="text-start">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
          <div className="d-flex justify-content-center">

          <RadarChart outerRadius={120} width={500} height={400} data={[
            { name: "Cansancio Emocional", score: burnoutScores.CE },
            { name: "Despersonalización", score: burnoutScores.DP },
            { name: "Realización Personal", score: burnoutScores.RP }
          ]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 40]} />
            <Radar name="Burnout" dataKey="score" stroke="#FF5733" fill="#FF5733" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
          </div>

        </>
        
      )}
      <h2>La información aquí mostrada es basada en un análisis algorítmico pero no representa un diagnóstico clínico.</h2>
      </div>
    </div>
  );
};

export default SurveyCompleted;
