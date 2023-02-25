import logo from "./logo.svg";
import "./App.css";
import MapView from "./Pages/MapView";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Utilities/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <MapView />
      </div>
    </ThemeProvider>
  );
}

export default App;
