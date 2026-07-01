import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Workspace from "../pages/Workspace";
import Datasets from "../pages/Datasets";
import Descriptors from "../pages/Descriptors";
import Similarity from "../pages/Similarity";
import About from "../pages/About";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="datasets" element={<Datasets />} />
        <Route path="descriptors" element={<Descriptors />} />
        <Route path="similarity" element={<Similarity />} />
        <Route path="about" element={<About />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="workspace" element={<Workspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;