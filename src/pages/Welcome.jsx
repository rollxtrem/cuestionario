import React, { useState, useContext } from "react";
import { Container, Button, Card, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SurveyContext } from "../context/SurveyContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, setDoc, doc, getCountFromServer } from "firebase/firestore";

const Welcome = () => {
  const navigate = useNavigate();
  const { setSurveyData } = useContext(SurveyContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const handleStart = async () => {
    if (!email || !name || !acceptedTerms || !acceptedConsent) {
      alert("Debes ingresar tu nombre, un correo y aceptar ambos términos.");
      return;
    }

    try {
      const q = query(collection(db, "surveys"), where("email", "==", email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const surveyDoc = snapshot.docs[0];
        const survey = surveyDoc.data();
        setSurveyData(survey);
        
        if (survey.completed) {
          navigate("/surveyCompleted");
        } else {
          navigate(survey.lastStep || "/step2");
        }
      } else {
        const countSnapshot = await getCountFromServer(collection(db, "surveys"));
        const newSubjectId = countSnapshot.data().count + 1;
        const now = new Date().toISOString();

        const newSurvey = { 
          SujetoId: newSubjectId,
          email, 
          name,
          lastStep: "/step2", 
          completed: false, 
          fechaInicio: now,
          fechaActualizacion: now
        };
        const newDocRef = doc(collection(db, "surveys"), newSubjectId.toString());
        await setDoc(newDocRef, newSurvey);
        setSurveyData(newSurvey);
        navigate("/step2");
      }
    } catch (error) {
      console.error("Error al verificar el correo:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(5px)" }}>
      <Card className="text-center p-4 shadow-lg" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        <Card.Body>
          <Card.Title className="mb-3">CONDICIONES DE TRABAJO Y BURNOUT EN BACTERIOLOGOS Y SUS HOMOLOGOS EN COLOMBIA I SEMESTRE DE 2025</Card.Title>
          <Card.Text>Bienvenido al cuestionario. Gracias por tu participación.</Card.Text>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3 p-2 border rounded bg-light">
              <Form.Check
                type="checkbox"
                label={<span className="fw-bold text-primary">Acepto la <a href="#" onClick={() => setShowModal(true)}>Política de Tratamiento de Datos</a></span>}
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3 p-2 border rounded bg-light">
              <Form.Check
                type="checkbox"
                label={<span className="fw-bold text-primary">Acepto el <a href="#" onClick={() => setShowConsentModal(true)}>Consentimiento Informado</a></span>}
                checked={acceptedConsent}
                onChange={(e) => setAcceptedConsent(e.target.checked)}
                required
              />
            </Form.Group>
          </Form>

          <Button variant="primary" onClick={handleStart}>Comenzar Cuestionario</Button>
        </Card.Body>
      </Card>

      {/* Modal Política de Tratamiento de Datos */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Política de Tratamiento de Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4>POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h4>
            <h5>1. IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO</h5>
            <p><strong>Nombre del responsable:</strong> Ivonne Maritza Romero Álvarez</p>
            <p><strong>Correo electrónico:</strong> <a href="mailto:ivonne.romero-a@uniminuto.edu.co">ivonne.romero-a@uniminuto.edu.co</a></p>

            <h5>2. FINALIDAD DEL TRATAMIENTO</h5>
            <p>Los datos recopilados serán utilizados exclusivamente para la investigación "CONDICIONES DE TRABAJO Y BURNOUT EN BACTERIÓLOGOS Y SUS HOMÓLOGOS EN COLOMBIA I SEMESTRE DE 2025".</p>

            <h5>3. DATOS PERSONALES SOLICITADOS</h5>
            <ul>
              <li>Nombre</li>
              <li>Correo electrónico</li>
              <li>Datos sociodemográficos (edad, género, ubicación)</li>
              <li>Respuestas al cuestionario</li>
            </ul>

            <h5>4. DERECHOS DEL TITULAR</h5>
            <p>De acuerdo con la Ley 1581 de 2012, los titulares pueden:</p>
            <ul>
              <li>Conocer, actualizar y rectificar sus datos.</li>
              <li>Solicitar prueba del consentimiento otorgado.</li>
              <li>Ser informados sobre el uso de sus datos.</li>
              <li>Revocar la autorización y/o solicitar la eliminación de sus datos.</li>
            </ul>

            <h5>5. MEDIDAS DE SEGURIDAD</h5>
            <p>Se implementarán medidas técnicas y administrativas para proteger los datos personales.</p>

            <h5>6. TRANSFERENCIA Y TRANSMISIÓN DE DATOS</h5>
            <p>Los datos no serán compartidos con terceros sin consentimiento del titular, salvo en los casos estipulados por la ley.</p>

            <h5>7. CONSERVACIÓN DE LA INFORMACIÓN</h5>
            <p>Los datos serán conservados durante el tiempo necesario para cumplir con la finalidad del estudio y posteriormente serán eliminados según la normatividad vigente.</p>

            <h5>8. CONTACTO PARA CONSULTAS Y RECLAMOS</h5>
            <p>Los titulares de la información pueden ejercer sus derechos enviando una solicitud al correo <a href="mailto:ivonne.romero-a@uniminuto.edu.co">ivonne.romero-a@uniminuto.edu.co</a>.</p>

            <h5>9. ACEPTACIÓN DEL TRATAMIENTO DE DATOS</h5>
            <p>Al aceptar esta política y diligenciar el cuestionario, el titular otorga su consentimiento para el tratamiento de sus datos personales conforme a los términos establecidos.</p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Consentimiento Informado */}
      <Modal show={showConsentModal} onHide={() => setShowConsentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Consentimiento Informado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h3 className="text-center">TESIS DE GRADO PARA OPCIÓN MAESTRÍA EN GERENCIA EN SALUD</h3>
            <h4>Consentimiento Informado:</h4>
            <p><strong>CONDICIONES DE TRABAJO Y BURNOUT EN BACTERIÓLOGOS Y SUS HOMÓLOGOS EN COLOMBIA I SEMESTRE DE 2025</strong></p>
            <p><strong>Investigadora:</strong> Ivonne Maritza Romero Álvarez</p>
            <p>Lea cuidadosamente este documento de consentimiento informado. Para dudas, escriba a <a href="mailto:ivonne.romero-a@uniminuto.edu.co">ivonne.romero-a@uniminuto.edu.co</a>.</p>
            
            <h5>Introducción:</h5>
            <p>Este trabajo analiza las condiciones laborales y socioeconómicas de los bacteriólogos y sus homólogos en Colombia en 2025, así como la presencia del síndrome de burnout en trabajadores activos. Se abordan aspectos como jornadas y tipo de contrato, salarios, descansos, vacaciones, seguridad social, oportunidades de ascenso y capacitación, pagos oportunos, perfil profesional, enfermedades laborales, carga y clima laboral, bioseguridad, incentivos y nivel socioeconómico, además de las implicaciones del burnout.</p>
            
            <h5>Justificación:</h5>
            <p>Este estudio es necesario para comprender las condiciones laborales y socioeconómicas de los bacteriólogos en Colombia en 2025 y su relación con el síndrome de burnout. Analizar estos factores permitirá identificar problemáticas y proponer mejoras que contribuyan al bienestar de los profesionales y a la calidad del servicio en el sector salud.</p>
            
            <h5>Objetivo del estudio:</h5>
            <p>Analizar las condiciones de trabajo y Burnout en bacteriólogos y sus homólogos en Colombia I semestre de 2025.</p>
            
            <h5>¿Quiénes participan en el estudio?</h5>
            <p>Está dirigido a Bacteriólogos y sus homólogos en Colombia.</p>
            
            <h5>Uso de la información recolectada:</h5>
            <p>La información recolectada será utilizada para fines netamente investigativos con el fin de determinar las condiciones laborales y el síndrome de Burnout en bacteriólogos y sus homólogos en Colombia.</p>
            
            <h5>Preguntas y contacto:</h5>
            <p>Para preguntas adicionales, contacte a la investigadora Ivonne Maritza Romero Álvarez al teléfono 3163388742.</p>
            
            <h5>¿En qué consistirá mi participación?</h5>
            <p>Su participación en el proyecto consistirá en responder las preguntas del instrumento denominado “Cuestionario de condiciones laborales y síndrome de Burnout en Bacteriólogos en Colombia 1 semestre 2025” a través de un cuestionario digital. Este proceso tendrá una duración aproximada de 15 minutos.</p>
            
            <h5>Riesgos o incomodidades:</h5>
            <p>No implica ningún riesgo para usted. Si alguna de las preguntas le hiciera sentir un poco incómodo(a), usted tiene el derecho a no contestar. Usted no recibirá pago alguno por su participación en este estudio, ni implica gasto alguno para usted.</p>
            
            <h5>Beneficios:</h5>
            <p>No existe un beneficio directo por su participación en el estudio, sin embargo, si acepta participar, está aportando en la evaluación de estrategias y recomendaciones para dar respuesta al fenómeno de la segunda.</p>
            
            <h5>Confidencialidad:</h5>
            <p>Los datos serán estrictamente confidenciales y utilizados únicamente por los investigadores del proyecto, asegurando el anonimato de los participantes.</p>
            
            <h5>Acceso a los resultados:</h5>
            <p>Los resultados serán socializados con los participantes mediante un mecanismo concertado y publicados como productos de investigación, garantizando el anonimato de los participantes.</p>
            
            <h5>Retiro del estudio:</h5>
            <p>Usted puede retirarse en cualquier momento sin generar consecuencias de ningún tipo.</p>
            
            <h5>Autorización:</h5>
            <p>Autorizo que los datos suministrados puedan ser utilizados para esta investigación, próximas investigaciones del grupo y publicaciones, siempre garantizando la confidencialidad de los datos.</p>
            <ul>
              <li>No recibiré beneficio económico ni personal por participar.</li>
              <li>Los resultados serán anónimos y confidenciales.</li>
              <li>Los investigadores han explicado a satisfacción todos los aspectos del proyecto.</li>
            </ul>
            <p><strong>Investigadora:</strong> Ivonne Maritza Romero Álvarez</p>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConsentModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Welcome;