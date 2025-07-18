// AppRoutes.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Calendar from "./Calendar";
import Routines from "./Routines";
import Routine from "./Routine";
import NotFound from "./NotFound";

export default function Body() {
  const location = useLocation();
  const isCalendarPage = location.pathname === "/calendar";

  return (
    <div className={`${isCalendarPage ? "max-w-lg" : "max-w-md"} mx-auto px-4 pb-24`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/routines/:id" element={<Routine />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
