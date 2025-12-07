import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Step1Page from "./pages/Step1Page";
import PlanPage from "./pages/PlanPage";
import MeasurePage from "./pages/MeasurePage";
import AnalysePage from './pages/AnalysePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/step1" element={<Step1Page />} />
                <Route path="/plan" element={<PlanPage />} />
                <Route path="/measure" element={<MeasurePage />} />
                <Route path="/analyse" element={<AnalysePage />} />
            </Routes>
        </Router>
    );
}

export default App;
