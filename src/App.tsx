import { Routes, Route } from "react-router-dom";

// Import components
import Home from "./components/Home.tsx";
import { OAuthCallback } from "./components/OAuth/OAuthCallback.tsx";
import AdCreationForm from "./components/AdForm/AdCreationForm.tsx";
import ConnectButton from "./components/OAuth/ConnectButton.tsx";
import OAuthLoginScreen from "./components/OAuth/OAuthLoginScreen.tsx";
import Success from "./components/AdForm/Success.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oauth/connect" element={<ConnectButton />} />
      <Route path="/oauth/login" element={<OAuthLoginScreen />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/callback" element={<OAuthCallback />} />
      <Route path="/create-ad" element={<AdCreationForm />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

// Export default App
export default App;
