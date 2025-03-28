import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { SurveyContext } from "../context/SurveyContext";
import ProgressBar from "../components/ProgressBar";

const SurveyStep1 = () => {
  const navigate = useNavigate();
  const { surveyData, setSurveyData } = useContext(SurveyContext);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (surveyData.email && surveyData.SujetoId) {
      const fetchUserData = async () => {
        const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const updatedData = { name: userData.name || "", email: userData.email || "" };
          setFormData(updatedData);
          setSurveyData((prev) => ({ ...prev, ...userData }));
        }
      };
      fetchUserData();
    }
  }, [surveyData.email, surveyData.SujetoId, setSurveyData]);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El name es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setSurveyData((prev) => ({ ...prev, [name]: value }));

    if (surveyData.SujetoId) {
      const userRef = doc(db, "surveys", surveyData.SujetoId.toString());
      try {
        await updateDoc(userRef, { name: value, fechaActualizacion: new Date().toISOString() });
      } catch (error) {
        console.error("Error al actualizar en Firebase:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    navigate("/step2");
    setLoading(false);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <div className="container p-4 rounded shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-white py-3 shadow-sm">
          <h2>Paso 1: Información Personal</h2>
          <ProgressBar step={1} totalSteps={10} percentage={10} />  
        </div>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              disabled
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Siguiente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyStep1;
