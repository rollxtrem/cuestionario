import { useState, useContext, useEffect } from "react";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

const SurveyStep2 = () => {
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [customDocument, setCustomDocument] = useState("");
  const [customGender, setCustomGender] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDepartments = async () => {
      const deptCollection = collection(db, "departamentos");
      const snapshot = await getDocs(deptCollection);
      const deptList = snapshot.docs.map(doc => doc.data().nombre);
      setDepartments(deptList.length ? deptList : []);
    };

    const fetchUserData = async () => {
      if (surveyData.email && surveyData.SujetoId) {
        const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setSurveyData(userSnapshot.data());
        }
      }
    };

    fetchDepartments();
    fetchUserData();
  }, [surveyData.email, surveyData.SujetoId, setSurveyData]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedData = { ...surveyData, [name]: value, lastStep: "step2", fechaActualizacion: new Date().toISOString() };
    setSurveyData(updatedData);
    
    if (surveyData.SujetoId) {
      const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
      try {
        await updateDoc(userRef, updatedData);
      } catch (error) {
        console.error("Error al actualizar en Firebase", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/step3");
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-white py-3 shadow-sm">
          <h2>Datos Personales</h2>
          <ProgressBar step={2} totalSteps={10} percentage={20} />  
        </div>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Tipo de Documento:</label>
            <select className="form-control" name="documentType" value={surveyData.documentType || ""} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              <option value="Cedula de Ciudadanía">Cédula de Ciudadanía</option>
              <option value="Cédula de Extranjería">Cédula de Extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          {surveyData.documentType === "Otro" && (
            <div className="mb-3">
              <label className="form-label">Especifique otro tipo de documento:</label>
              <input type="text" className="form-control" value={customDocument} onChange={(e) => setCustomDocument(e.target.value)} required />
            </div>
          )}
          {/* Número de Documento */}
          <div className="mb-3">
            <label className="form-label">Número de Documento:</label>
            <input
              type="text"
              className="form-control"
              name="documentNumber"
              value={surveyData.documentNumber || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Edad */}
          <div className="mb-3">
            <label className="form-label">Edad:</label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={surveyData.age || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Género */}
          <div className="mb-3">
            <label className="form-label">Género:</label>
            <select
              className="form-control"
              name="gender"
              value={surveyData.gender || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Campo adicional si selecciona "Otro" en género */}
          {surveyData.gender === "Otro" && (
            <div className="mb-3">
              <label className="form-label">Especifique otro género:</label>
              <input
                type="text"
                className="form-control"
                value={customGender}
                onChange={(e) => setCustomGender(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Departamento:</label>
            <select className="form-control" name="department" value={surveyData.department || ""} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {/* Ciudad / Municipio */}
          <div className="mb-3">
            <label className="form-label">Ciudad / Municipio:</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={surveyData.city || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/step1")}>Atrás</button>
            <button type="submit" className="btn btn-primary">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyStep2;