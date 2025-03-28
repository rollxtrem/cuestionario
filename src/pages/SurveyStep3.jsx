import { useState, useContext, useEffect, useRef  } from "react";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

const SurveyStep3 = () => {
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const navigate = useNavigate();
  const [customTitle, setCustomTitle] = useState("");
  const [customContract, setCustomContract] = useState("");
  const titleRef = useRef(null);

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
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }, 100);
  }, [surveyData.SujetoId, setSurveyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyData((prev) => ({ ...prev, [name]: value, lastStep: "step3", fechaActualizacion: new Date().toISOString() }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSurveyData((prev) => {
      const updatedSocialSecurity = checked
        ? [...(prev.socialSecurity || []), value]
        : (prev.socialSecurity || []).filter((item) => item !== value);
      return { ...prev, socialSecurity: updatedSocialSecurity, lastStep: "step3", fechaActualizacion: new Date().toISOString() };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (surveyData.SujetoId) {
      const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
      try {
        await updateDoc(userRef, { ...surveyData, lastStep: "step3", fechaActualizacion: new Date().toISOString() });
        navigate("/step4");
      } catch (error) {
        console.error("Error al actualizar en Firebase:", error);
      }
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-white py-3 shadow-sm">
          <h2>Información Laboral</h2>
          <ProgressBar step={3} totalSteps={10} percentage={30} />
        </div>

        <form onSubmit={handleSubmit} className="mt-3">      
          <div className="mb-3">
            <label className="form-label">Título Obtenido:</label>
            <select className="form-control" name="titleObtained" value={surveyData.titleObtained || ""} onChange={handleChange} required 
              ref={titleRef}>
              <option value="">Seleccione...</option>
              <option value="Bacteriologo">Bacteriólogo</option>
              <option value="Bacteriologo y laboratorista clinico">Bacteriólogo y laboratorista clínico</option>
              <option value="Microbiologo y Bioanalista">Microbiólogo y Bioanalista</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {surveyData.titleObtained === "Otro" && (
            <div className="mb-3">
              <label className="form-label">Especifique otro título:</label>
              <input type="text" className="form-control" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} required />
            </div>
          )}

          {/* Nivel de Formación */}
          <div className="mb-3">
            <label className="form-label">Nivel de Formación:</label>
            <select
              className="form-control"
              name="educationLevel"
              value={surveyData.educationLevel || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Pregrado">Pregrado</option>
              <option value="Especialización">Especialización</option>
              <option value="Maestría">Maestría</option>
              <option value="Doctorado">Doctorado</option>
            </select>
          </div>

          {/* Salario */}
          <div className="mb-3">
            <label className="form-label">Salario:</label>
            <select
              className="form-control"
              name="salary"
              value={surveyData.salary || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="$1.000.000 a $2.000.000">$1.000.000 a $2.000.000</option>
              <option value="$2.000.050 a $3.000.000">$2.000.050 a $3.000.000</option>
              <option value="$3.000.050 a $4.000.000">$3.000.050 a $4.000.000</option>
              <option value="$4.000.050 a $6.000.000">$4.000.050 a $6.000.000</option>
              <option value="más de $6.000.000">Más de $6.000.000</option>
            </select>
          </div>

          {/* Afiliación al Sistema de Seguridad Social */}
          <div className="mb-3">
            <label className="form-label">Afiliación al Sistema de Seguridad Social (Marcar varías):</label>
            {["Salud", "Pensión", "ARL", "Caja de compensación familiar", "Medicina prepagada", "Ninguna"].map((option) => (
              <div key={option} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="socialSecurity"
                  value={option}
                  checked={surveyData.socialSecurity?.includes(option) || false}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de Vinculación:</label>
            <select className="form-control" name="contractType" value={surveyData.contractType || ""} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              <option value="Contrato a término fijo">Contrato a término fijo</option>
              <option value="Contrato a término indefinido">Contrato a término indefinido</option>
              <option value="Contrato de obra o labor">Contrato de obra o labor</option>
              <option value="Contrato civil por prestación de servicios">Contrato civil por prestación de servicios</option>
              <option value="Contrato de aprendizaje">Contrato de aprendizaje</option>
              <option value="Contrato ocasional de trabajo">Contrato ocasional de trabajo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {surveyData.contractType === "Otro" && (
            <div className="mb-3">
              <label className="form-label">Especifique otro tipo de contrato:</label>
              <input type="text" className="form-control" value={customContract} onChange={(e) => setCustomContract(e.target.value)} required />
            </div>
          )}


          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/step2")}>Atrás</button>
            <button type="submit" className="btn btn-primary">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyStep3;
