import { useState } from "react";
import { LazyMotion, domAnimation, m as Motion, useReducedMotion } from "framer-motion";

// ── Floating label input ──────────────────────────────────────────────────────
function FloatField({ id, name, label, type = "text", value, onChange, required, autoComplete }) {
  return (
    <div className="relative pt-5">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer block w-full border-0 border-b-2 border-slate-200 bg-transparent pb-2 pt-1 text-slate-900 placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-0 transition-colors duration-200 text-sm"
      />
      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute left-0 text-slate-400 transition-all duration-200 origin-left",
          "-top-0 scale-75 text-xs text-slate-500",
          "peer-placeholder-shown:top-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400",
          "peer-focus:-top-0 peer-focus:scale-75 peer-focus:text-xs peer-focus:text-blue-600",
        ].join(" ")}
      >
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    </div>
  );
}

// ── Timeline step ─────────────────────────────────────────────────────────────
function Step({ n, title, desc, last }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-slate-300">{n}</span>
        </div>
        {!last && <div className="w-px flex-1 bg-slate-700 mt-1 mb-1" />}
      </div>
      <div className={last ? "pb-0" : "pb-6"}>
        <p className="text-sm font-semibold text-slate-200 leading-snug">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const ASUNTOS = [
  { value: "cotizacion", label: "Cotización empresarial / volumen" },
  { value: "stock",      label: "Consulta de disponibilidad" },
  { value: "soporte",    label: "Soporte técnico postventa" },
  { value: "garantia",   label: "Garantías y devoluciones" },
  { value: "otro",       label: "Otro" },
];

// ── Main component ────────────────────────────────────────────────────────────
function Contact({ onNavigate }) {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState({ nombre: "", empresa: "", email: "", asunto: "", mensaje: "" });
  const [status, setStatus] = useState("idle");
  const MAX_CHARS = 600;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("success");
  };

  const reset = () => {
    setStatus("idle");
    setForm({ nombre: "", empresa: "", email: "", asunto: "", mensaje: "" });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        <div className="grid lg:grid-cols-2 min-h-screen">

          {/* ── LEFT — Panel editorial ── */}
          <div className="bg-slate-900 flex flex-col px-10 py-14 lg:px-16 lg:py-20">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-600 mb-12">
              <button
                onClick={() => onNavigate?.("home")}
                className="hover:text-slate-400 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-slate-600"
              >
                Inicio
              </button>
              <span className="text-slate-700">/</span>
              <span className="text-slate-400">Contacto</span>
            </nav>

            {/* Heading */}
            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.22 } })}
              className="mb-8"
            >
              <h1
                className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "Rubik, sans-serif" }}
              >
                ¿En qué podemos<br />ayudarte?
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Consultás stock, necesitás una cotización para tu empresa o tenés un problema técnico — estamos para resolverlo.
              </p>
            </Motion.div>

            {/* Response badge */}
            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2, delay: 0.08 } })}
              className="inline-flex items-center gap-2.5 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 mb-10 self-start"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
              <span className="text-slate-300 text-xs font-medium">Tiempo de respuesta: menos de 24 h</span>
            </Motion.div>

            {/* Canales de contacto */}
            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.12 } })}
              className="space-y-5 mb-10"
            >
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  ),
                  label: "Email",
                  value: "contacto@ancami.es",
                  note: "Consultas y cotizaciones",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  ),
                  label: "Teléfono",
                  value: "+34 900 123 456",
                  note: "Lun–Vie, 9:00–18:00 CET",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  ),
                  label: "Ubicación",
                  value: "España",
                  note: "Envíos a toda la Península",
                },
              ].map(({ icon, label, value, note }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-slate-500 mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-slate-300 text-sm font-medium leading-snug">{value}</p>
                    <p className="text-slate-600 text-xs">{note}</p>
                  </div>
                </div>
              ))}
            </Motion.div>

            {/* Divider */}
            <div className="border-t border-slate-800 mb-10" />

            {/* Cotización B2B callout */}
            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.14 } })}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-10"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-blue-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Empresas y volumen</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Para pedidos de más de 5 unidades o compras corporativas, incluí el nombre de tu empresa en el formulario y seleccioná <span className="text-white font-medium">Cotización empresarial</span>.
              </p>
            </Motion.div>

            {/* Timeline */}
            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.16 } })}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-5">
                ¿Qué pasa después?
              </p>
              <Step n="1" title="Revisamos tu consulta" desc="Un especialista analiza tu caso en detalle." />
              <Step n="2" title="Verificamos stock y precios" desc="Confirmamos disponibilidad en tiempo real." />
              <Step n="3" title="Te enviamos la respuesta" desc="Con cotización, solución o seguimiento según corresponda." last />
            </Motion.div>

            {/* Logo bottom */}
            <div className="mt-auto pt-12 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm leading-none">A</span>
              </div>
              <span className="text-slate-500 text-sm font-medium" style={{ fontFamily: "Rubik, sans-serif" }}>
                ANCAMI
              </span>
            </div>
          </div>

          {/* ── RIGHT — Form panel ── */}
          <div className="flex flex-col justify-center px-10 py-14 lg:px-16 lg:py-20 bg-white">

            {status === "success" ? (
              <Motion.div
                {...(reduceMotion ? {} : { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.2 } })}
                className="max-w-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: "Rubik, sans-serif" }}>
                  Consulta recibida
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  Un especialista revisará tu consulta y se pondrá en contacto con vos a{" "}
                  <span className="font-medium text-slate-700">{form.email}</span> en menos de 24 horas hábiles.
                </p>
                {form.asunto === "cotizacion" && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6">
                    <p className="text-xs text-blue-700 font-medium">
                      Para cotizaciones empresariales, el tiempo de respuesta puede ser de hasta 4 horas en horario laboral.
                    </p>
                  </div>
                )}
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 mt-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Nueva consulta
                </button>
              </Motion.div>
            ) : (
              <Motion.div
                {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.22 } })}
                className="w-full max-w-md"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
                  Formulario de contacto
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Nombre + Email */}
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
                    <FloatField
                      id="nombre"
                      name="nombre"
                      label="Nombre completo"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                    <FloatField
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>

                  {/* Empresa (opcional) */}
                  <FloatField
                    id="empresa"
                    name="empresa"
                    label="Empresa (opcional)"
                    value={form.empresa}
                    onChange={handleChange}
                    autoComplete="organization"
                  />

                  {/* Asunto */}
                  <div className="relative pt-5">
                    <select
                      id="asunto"
                      name="asunto"
                      value={form.asunto}
                      onChange={handleChange}
                      required
                      className="peer block w-full border-0 border-b-2 border-slate-200 bg-transparent pb-2 pt-1 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-0 transition-colors duration-200 cursor-pointer appearance-none"
                    >
                      <option value="" disabled />
                      {ASUNTOS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                    <label
                      htmlFor="asunto"
                      className={[
                        "pointer-events-none absolute left-0 transition-all duration-200 origin-left",
                        form.asunto
                          ? "-top-0 scale-75 text-xs text-slate-500"
                          : "top-6 scale-100 text-sm text-slate-400",
                        "peer-focus:-top-0 peer-focus:scale-75 peer-focus:text-xs peer-focus:text-blue-600",
                      ].join(" ")}
                    >
                      Motivo de la consulta<span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <svg
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="pointer-events-none absolute right-0 bottom-2.5 w-4 h-4 text-slate-400"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Mensaje + contador */}
                  <div className="relative pt-5">
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={form.mensaje}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_CHARS) handleChange(e);
                      }}
                      required
                      rows={4}
                      placeholder=" "
                      className="peer block w-full border-0 border-b-2 border-slate-200 bg-transparent pb-2 pt-1 text-sm text-slate-900 placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-0 transition-colors duration-200 resize-none"
                    />
                    <label
                      htmlFor="mensaje"
                      className={[
                        "pointer-events-none absolute left-0 transition-all duration-200 origin-left",
                        "-top-0 scale-75 text-xs text-slate-500",
                        "peer-placeholder-shown:top-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400",
                        "peer-focus:-top-0 peer-focus:scale-75 peer-focus:text-xs peer-focus:text-blue-600",
                      ].join(" ")}
                    >
                      {form.asunto === "cotizacion"
                        ? "Detallá los productos y cantidades"
                        : form.asunto === "soporte"
                        ? "Describí el problema técnico"
                        : "Mensaje"}
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <span className={`absolute right-0 bottom-2 text-xs tabular-nums ${form.mensaje.length >= MAX_CHARS ? "text-red-400" : "text-slate-400"}`}>
                      {form.mensaje.length}/{MAX_CHARS}
                    </span>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2.5 text-sm"
                    >
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          {form.asunto === "cotizacion" ? "Solicitar cotización" : "Enviar consulta"}
                          <svg
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-400 text-center mt-3">
                      Al enviar aceptás nuestra{" "}
                      <button
                        type="button"
                        onClick={() => onNavigate?.("politica-privacidad")}
                        className="underline underline-offset-2 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-slate-400"
                      >
                        política de privacidad
                      </button>
                      .
                    </p>
                  </div>

                </form>
              </Motion.div>
            )}

          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

export default Contact;
