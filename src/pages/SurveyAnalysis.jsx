import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Container, Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [totalSurveys, setTotalSurveys] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "surveys"));
        const data = snapshot.docs.map((doc) => doc.data());
        setSurveys(data);
        setTotalSurveys(data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const calculateAverage = (field) => {
    const total = surveys.reduce(
      (sum, s) => sum + (s[field] ? Object.values(s[field]).reduce((a, b) => a + Number(b), 0) : 0),
      0
    );
    return total / (surveys.length || 1);
  };

  const barData = {
    labels: [
      "Regulación",
      "Desarrollo",
      "Entorno Material",
      "Entorno Social",
      "Ajuste Organización-Persona",
      "Adaptación Persona-Organización",
    ],
    datasets: [
      {
        label: "Promedio de respuestas",
        data: [
          calculateAverage("workConditionsRegulations"),
          calculateAverage("workConditionsDeveloper"),
          calculateAverage("materialWorkEnvironment"),
          calculateAverage("socialWorkEnvironment"),
          calculateAverage("adjustmentPeopleOrganization"),
          calculateAverage("adaptionPeopleOrganization"),
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF", "#FF4500"],
      },
    ],
  };

  // Análisis de Burnout
  const burnoutLevels = {
    bajo: 0,
    moderado: 0,
    alto: 0,
  };

  surveys.forEach((s) => {
    if (s.workFeelings) {
      const CE = [1, 2, 3, 6, 8, 13, 14, 20].reduce((sum, index) => sum + (parseInt(s.workFeelings[index]) || 0), 0);
      const DP = [5, 10, 11, 15, 16, 22].reduce((sum, index) => sum + (parseInt(s.workFeelings[index]) || 0), 0);
      const RP = [4, 7, 9, 12, 17, 18, 19, 21].reduce((sum, index) => sum + (parseInt(s.workFeelings[index]) || 0), 0);

      if (CE >= 27 || DP >= 10 || RP <= 33) {
        burnoutLevels.alto++;
      } else if ((CE >= 17 && CE <= 26) || (DP >= 6 && DP <= 9) || (RP >= 34 && RP <= 39)) {
        burnoutLevels.moderado++;
      } else {
        burnoutLevels.bajo++;
      }
    }
  });

  const pieData = {
    labels: ["Bajo Burnout", "Moderado Burnout", "Alto Burnout"],
    datasets: [
      {
        data: [burnoutLevels.bajo, burnoutLevels.moderado, burnoutLevels.alto],
        backgroundColor: ["#4CAF50", "#FFCE56", "#FF5733"],
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📊 Tablero de Control</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center p-4 shadow">
            <h4>Total de Encuestas</h4>
            <h2>{totalSurveys}</h2>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="p-4 shadow">
            <h4>Condiciones Laborales (Escala de Blanch)</h4>
            <Bar data={barData} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="p-4 shadow">
            <h4>Distribución de Burnout</h4>
            <Pie data={pieData} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
