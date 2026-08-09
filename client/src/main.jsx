import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import App from "./App.jsx";
import AppGroup from "./AppGroup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditorsRecommendation from "./pages/EditorsRecommendation.jsx";
import "./index.css";
import "./output.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/venues" element={<AppGroup />} />
          <Route path="/venues-2person" element={<App />} />
          <Route path="/venues-group" element={<AppGroup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editors-recommendation" element={<EditorsRecommendation />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
