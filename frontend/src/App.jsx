import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddCourse from "./pages/AddCourse";
import MyCourses from "./pages/MyCourses";
import InstructorDashboard from "./pages/InstructorDasboard";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import ManageLessons from "./pages/ManageLessons";
import CourseLearning from "./pages/CourseLearning";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <ScrollToTop />

    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/login"element={<Login/>} />
      <Route path="/register"element={<Register />}/>
      <Route element={<ProtectedRoute allowedRoles={["admin", "instructor"]} />}>
      <Route path="/add-course"element={<AddCourse/>} /></Route>
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
      <Route path="/my-courses"element={<MyCourses/>}/> 
      <Route path="/learn/:courseId" element={<CourseLearning />} /></Route>
      <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}> 
      <Route path="/instructor/lessons/:courseId" element={<ManageLessons />} />
      <Route path="/instructor-dashboard" element={<InstructorDashboard />} /> </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}> 
      <Route path="/admin-dashboard" element={<AdminDashboard />} /></Route>
      </Routes>
      <Footer />
      </BrowserRouter>
  );
}
export default App;