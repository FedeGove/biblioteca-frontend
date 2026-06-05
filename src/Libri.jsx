import { useEffect, useState } from "react";

function Libri({ ruolo }) {
  const [form, setForm] = useState({
    titolo: "",
    autore: "",
    anno: "",
    genere: "",
  });
  const [libri, setLibri] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
  const controller = new AbortController()

  fetch('https://bibliotecaapi-production-b3e3.up.railway.app/api/libri', {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal
  })
  .then(r => r.json())
  .then(data => setLibri(data))
  .catch(err => {
    if (err.name !== 'AbortError') console.error(err)
  })

  return () => controller.abort()
}, [token])

  function handleAggiungi() {
    fetch("https://bibliotecaapi-production-b3e3.up.railway.app/api/libri", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titolo: form.titolo,
        autore: form.autore,
        anno: parseInt(form.anno),
        genere: form.genere,
        disponibile: true,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setLibri([...libri, data]);
        setForm({
          titolo: "",
          autore: "",
          anno: "",
          genere: "",
        });
      })
      .catch(console.error);
  }

  function handleRimuovi(id) {
    fetch(
      `https://bibliotecaapi-production-b3e3.up.railway.app/api/libri/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then(() => setLibri(libri.filter((l) => l.id !== id)))
      .catch(console.error);
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">
              📚
            </div>
            <span className="text-white font-semibold">Biblioteca</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              {libri.length} libri
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Totale libri
            </p>
            <p className="text-2xl font-bold text-white">{libri.length}</p>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Disponibili
            </p>
            <p className="text-2xl font-bold text-green-400">
              {libri.filter((l) => l.disponibile).length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              In prestito
            </p>
            <p className="text-2xl font-bold text-amber-400">
              {libri.filter((l) => !l.disponibile).length}
            </p>
          </div>
        </div>

        <div
          className={`grid gap-6 ${ruolo === "admin" ? "grid-cols-3" : "grid-cols-1"}`}
        >
          {/* Lista libri */}
          <div className="col-span-2">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
              Catalogo
            </h2>
            <div className="flex flex-col gap-2">
              {libri.length === 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
                  <p className="text-slate-500 text-sm">
                    Nessun libro nel catalogo
                  </p>
                </div>
              )}
              {libri.map((libro) => (
                <div
                  key={libro.id}
                  className="bg-slate-800 rounded-xl border border-slate-700 px-4 py-3 flex items-center justify-between hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 bg-blue-600/20 rounded border border-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold flex-shrink-0">
                      {libro.titolo.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">
                        {libro.titolo}
                      </p>
                      <p className="text-xs text-slate-400">
                        {libro.autore} · {libro.anno} · {libro.genere}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${libro.disponibile ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"}`}
                    >
                      {libro.disponibile ? "Disponibile" : "In prestito"}
                    </span>
                    {ruolo === "admin" && (
                      <button
                        type="button"
                        onClick={() => handleRimuovi(libro.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors text-xs"
                      >
                        Rimuovi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form aggiunta */}
          {ruolo === "admin" && (
            <div>
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                Aggiungi libro
              </h2>
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <div className="flex flex-col gap-3">
                  {[
                    {
                      key: "titolo",
                      placeholder: "Titolo",
                    },
                    {
                      key: "autore",
                      placeholder: "Autore",
                    },
                    {
                      key: "anno",
                      placeholder: "Anno",
                    },
                    {
                      key: "genere",
                      placeholder: "Genere",
                    },
                  ].map((field) => (
                    <input
                      key={field.key}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={handleAggiungi}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors mt-1"
                  >
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Libri;
