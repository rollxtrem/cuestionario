import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "react-bootstrap";

const ExportExcel = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "surveys"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSurveys(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    if (surveys.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Convertir datos en una matriz de objetos (filas)
    const worksheet = XLSX.utils.json_to_sheet(surveys);

    // Crear un libro de Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Encuestas");

    // Guardar archivo
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "cuestionario.xlsx");
  };

  return (
    <Button onClick={exportToExcel} className="btn btn-success mt-3">
      📥 Exportar Cuestionario a Excel
    </Button>
  );
};

export default ExportExcel;
