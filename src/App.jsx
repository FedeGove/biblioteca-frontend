import { useState } from "react";
import Libri from "./Libri";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errore, setErrore] = useState("");

  function handleLogin() {
    fetch(
      "https://bibliotecaapi-production-b3e3.up.railway.app/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error("Credenziali errate");
        return response.json();
      })
      .then((data) => {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const ruolo = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem("ruolo", ruolo);
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
      })
      .catch((error) => setErrore(error.message));
  }

  if (isLoggedIn) return <Libri ruolo={localStorage.getItem('ruolo')} />;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4">
            <span className="text-white text-xl">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Biblioteca</h1>
          <p className="text-slate-400 text-sm mt-1">
            Accedi al pannello di gestione
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Username
              </label>
              <input
                id="username"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                placeholder="Il tuo username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                id="password"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="password"
                placeholder="La tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errore && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <p className="text-sm text-red-400">{errore}</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-1"
            >
              Accedi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
