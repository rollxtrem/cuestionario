//import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome";
import SurveyStep1 from "./pages/SurveyStep1";
import SurveyStep2 from "./pages/SurveyStep2";
import SurveyStep3 from "./pages/SurveyStep3";
import SurveyStep4 from "./pages/SurveyStep4";
import SurveyStep5 from "./pages/SurveyStep5";
import SurveyStep6 from "./pages/SurveyStep6";
import SurveyStep7 from "./pages/SurveyStep7";
import SurveyStep8 from "./pages/SurveyStep8";
import SurveyStep9 from "./pages/SurveyStep9";
import SurveyStep10 from "./pages/SurveyStep10";
import SurveyCompleted from "./pages/SurveyCompleted";
import SurveyAnalysis from "./pages/SurveyAnalysis";
import ExportExcel from "./pages/ExportExcel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/step1" element={<SurveyStep1 />} />
        <Route path="/step2" element={<SurveyStep2 />} />
        <Route path="/step3" element={<SurveyStep3 />} />
        <Route path="/step4" element={<SurveyStep4 />} />
        <Route path="/step5" element={<SurveyStep5 />} />
        <Route path="/step6" element={<SurveyStep6 />} />
        <Route path="/step7" element={<SurveyStep7 />} />
        <Route path="/step8" element={<SurveyStep8 />} />
        <Route path="/step9" element={<SurveyStep9 />} />
        <Route path="/step10" element={<SurveyStep10 />} />
        <Route path="/surveyCompleted" element={<SurveyCompleted />} />
        <Route path="/analysis" element={<SurveyAnalysis />} />
        <Route path="/export" element={<ExportExcel />} />
        
      </Routes>
    </Router>
  );
}

export default App;
