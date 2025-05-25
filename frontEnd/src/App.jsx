import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Attendance from "@/pages/Attendance";
import LeaveRequests from "@/pages/LeaveRequests";
import Payroll from "@/pages/Payroll";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="payroll" element={<Payroll />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
