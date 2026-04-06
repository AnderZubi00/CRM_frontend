import { LazyMotion, domAnimation, m as Motion, useReducedMotion } from "framer-motion";

const STATS_PANEL = [
  { value: "2024", label: "Año de fundación" },
  { value: "50+",  label: "Productos en catálogo" },
  { value: "500+", label: "Clientes atendidos" },
  { value: "24/48h", label: "Tiempo de envío" },
];

const VALORES = [
  {
    title: "Producto de calidad",
    desc: "Solo trabajamos con marcas y distribuidores oficiales. Garantía real, no promesas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Servicio ágil",
    desc: "Gestión de pedidos automatizada. Desde que comprás hasta que recibís, con trazabilidad total.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Soporte real",
    desc: "Técnicos disponibles para asesorarte. Sin bots, sin respuestas genéricas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
];

function SobreNosotros({ onNavigate }) {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-slate-50 text-slate-950">

        {/* ── PAGE HERO ── */}
        <section className="bg-slate-900 py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <Motion.nav
              {...(reduceMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } })}
              className="flex items-center gap-2 text-sm text-slate-500 mb-8"
            >
              <button
                onClick={() => onNavigate?.("home")}
                className="hover:text-slate-300 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-slate-500"
              >
                Inicio
              </button>
              <span>/</span>
              <span className="text-slate-300">Sobre nosotros</span>
            </Motion.nav>

            <Motion.h1
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.05 } })}
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "Rubik, sans-serif" }}
            >
              Tu proveedor tecnológico<br className="hidden sm:block" /> de confianza
            </Motion.h1>
            <Motion.p
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.1 } })}
              className="text-lg text-slate-400 max-w-xl"
            >
              Equipamos empresas y particulares con tecnología de calidad desde 2024.
            </Motion.p>
          </div>
        </section>

        {/* ── QUIÉNES SOMOS ── */}
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-start">

            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, x: -16 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.2 } })}
              className="lg:col-span-3"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Quiénes somos</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-6" style={{ fontFamily: "Rubik, sans-serif" }}>
                Nació para solucionar un problema real
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  ANCAMI surgió de la necesidad de tener un proveedor IT que no solo vendiera tecnología, sino que entendiera el negocio detrás de cada compra. Empresas que necesitan equipar oficinas, autónomos que buscan rendimiento real, o particulares que quieren asesoramiento honesto.
                </p>
                <p>
                  No somos una tienda genérica con miles de referencias sin criterio. Seleccionamos cada producto por su relación calidad-precio, su garantía oficial y la capacidad de dar soporte técnico real cuando algo falla.
                </p>
                <p>
                  Por detrás de cada pedido funciona nuestro sistema de gestión propio, que garantiza que el stock que ves es el stock que hay, y que tu pedido se procesa y se envía el mismo día hábil.
                </p>
              </div>
            </Motion.div>

            {/* Stats panel */}
            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, x: 16 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.2, delay: 0.05 } })}
              className="lg:col-span-2"
            >
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">En números</p>
                {STATS_PANEL.map(({ value, label }, idx) => (
                  <Motion.div
                    key={label}
                    {...(reduceMotion ? {} : {
                      initial: { opacity: 0, x: 12 },
                      whileInView: { opacity: 1, x: 0 },
                      viewport: { once: true },
                      transition: { duration: 0.18, delay: idx * 0.06 },
                    })}
                    className="flex items-center justify-between py-3.5 border-b border-slate-200 last:border-0"
                  >
                    <span className="text-slate-600 text-sm">{label}</span>
                    <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "Rubik, sans-serif" }}>
                      {value}
                    </span>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>

          </div>
        </section>

        {/* ── VENTAJA OPERATIVA — el CRM como diferenciador ── */}
        <section className="bg-slate-900 py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.2 } })}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Nuestra ventaja operativa</p>
              <h2 className="text-3xl font-bold text-white mb-5" style={{ fontFamily: "Rubik, sans-serif" }}>
                Un CRM propio que trabaja para vos, sin que te des cuenta
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                El sistema que gestiona ANCAMI no es un SaaS genérico. Es una plataforma desarrollada a medida que conecta inventario, pedidos, clientes y empleados en tiempo real.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Eso se traduce en stock fiable, pedidos procesados el mismo día y un historial de tus compras siempre disponible desde tu cuenta.
              </p>
            </Motion.div>

            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.2, delay: 0.06 } })}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { label: "Stock en tiempo real",    icon: "📦" },
                { label: "Trazabilidad de pedidos", icon: "🔍" },
                { label: "Historial de compras",    icon: "📋" },
                { label: "Soporte centralizado",    icon: "🛠" },
              ].map(({ label, icon }) => (
                <div
                  key={label}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5"
                >
                  <span className="text-2xl mb-3 block">{icon}</span>
                  <p className="text-sm font-medium text-slate-300 leading-snug">{label}</p>
                </div>
              ))}
            </Motion.div>

          </div>
        </section>

        {/* ── VALORES ── */}
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "Rubik, sans-serif" }}>
                Cómo trabajamos
              </h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Los principios que rigen cada producto que listamos y cada pedido que procesamos.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {VALORES.map((val, idx) => (
                <Motion.div
                  key={val.title}
                  {...(reduceMotion ? {} : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.3 },
                    transition: { duration: 0.2, delay: idx * 0.06 },
                  })}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                    {val.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: "Rubik, sans-serif" }}>
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{val.desc}</p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-slate-50 border-t border-slate-200 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "Rubik, sans-serif" }}>
                ¿Listo para tu próxima compra?
              </h2>
              <p className="text-slate-600">Revisá el catálogo o contactanos para una cotización a medida.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => onNavigate?.("productos")}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Ver catálogo
              </button>
              <button
                onClick={() => onNavigate?.("contacto")}
                className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Contactar
              </button>
            </div>
          </div>
        </section>

      </div>
    </LazyMotion>
  );
}

export default SobreNosotros;
