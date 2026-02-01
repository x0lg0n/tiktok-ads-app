import { Routes, Route } from "react-router-dom";

// Import components
import Home from "./components/Home.tsx";
import { OAuthCallback } from "./components/OAuth/OAuthCallback.tsx";
import AdCreationForm from "./components/AdForm/AdCreationForm.tsx";
import ConnectButton from "./components/OAuth/ConnectButton.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oauth/connect" element={<ConnectButton />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/callback" element={<OAuthCallback />} />
      <Route path="/create-ad" element={<AdCreationForm />} />
    </Routes>
  );
}

// Export default App
export default App;
