import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ComingSoon from "./components/ComingSoon";
import NavBar from "./components/NavBar";
import "./App.css";
import OverviewTab from "./components/OverviewTab";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <App />
            </Layout>
          }
        />
        <Route
          path="/tools-and-resources"
          element={
            <Layout>
              <OverviewTab />
            </Layout>
          }
        />
        <Route
          path="/opportunities"
          element={
            <Layout>
              <ComingSoon title="Opportunities and Initiatives" />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <ComingSoon title="About" />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
