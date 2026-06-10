import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import globalStyles from "./styles/globalStyles";
import "./styles/theme";
import App from "./App.jsx";
import { ToastProvider } from "./utils/ToastProvider.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import axios from "axios";

axios.defaults.withCredentials = true;

// Inject global styles string into a <style> tag so the app uses the provided colors only
if (typeof document !== "undefined") {
  const _g = document.createElement("style");
  _g.setAttribute("data-global-styles", "true");
  _g.innerHTML = globalStyles;
  document.head.appendChild(_g);
}

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <ToastProvider />
    <ToastContainer/>
  </StrictMode>
);
