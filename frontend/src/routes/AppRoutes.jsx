import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import Workspace from "../pages/Workspace";
import Datasets from "../pages/Datasets";
import Descriptors from "../pages/Descriptors";
import Similarity from "../pages/Similarity";
import Clustering from "../pages/Clustering";
import About from "../pages/About";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* Workspace */}
          <Route path="workspace" element={<Workspace />} />

          {/* Dataset */}
          <Route path="datasets" element={<Datasets />} />

          {/* Descriptors */}
          <Route path="descriptors" element={<Descriptors />} />

          {/* Similarity */}
          <Route path="similarity" element={<Similarity />} />

          {/* Clustering */}
          <Route path="clustering" element={<Clustering />} />

          {/* About */}
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;