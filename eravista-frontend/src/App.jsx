import { useEffect, useState } from "react";
import axios from "axios";
import { TimelineContext } from "./context/TimelineContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main";
import Edit from "./pages/Edit/Edit";
import "./App.scss";

axios.defaults.baseURL = "https://eravista-api.onrender.com";

function App() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void retrieveTimeline();
  }, []);

  const retrieveTimeline = async () => {
    setLoading(true);
    const response = await axios.get();
    setTimeline(response.data);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <TimelineContext.Provider value={timeline}>
      {loading && (
        <div className="loading">
          <span class="loader"></span>
          <h1 className="loading__header">EraVista</h1>
          Please wait for the backend service to finish spinning up...
          <span className="loading__sub">
            The application is deployed on the free version of the cloud
            platform. If there are no requests for some time, the service is
            automatically scaled down. It may take some time to spin up the
            environment when the service is reinitiated.
          </span>
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </TimelineContext.Provider>
  );
}

export default App;
