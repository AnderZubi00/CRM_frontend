import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m as Motion, useReducedMotion } from "framer-motion";

// ── Intersection Observer counter ────────────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnimatedStat({ value, suffix = "", duration = 1200 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Categorías de productos ───────────────────────────────────────────────────
const CATEGORIAS = [
  {
    label: "Portátiles",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
      </svg>
    ),
  },
  {
    label: "Componentes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    label: "Periféricos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    label: "Servidores",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    label: "Redes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
  },
  {
    label: "Gaming",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
    ),
  },
];

const STATS = [
  { label: "Productos en catálogo", value: 50, suffix: "+" },
  { label: "Clientes satisfechos", value: 500, suffix: "+" },
  { label: "Envío en horas", value: 48, suffix: "h" },
  { label: "Garantía oficial", value: 2, suffix: " años" },
];

const FEATURES = [
  {
    title: "Stock actualizado en tiempo real",
    desc: "Cada producto refleja disponibilidad real. Si está en el catálogo, está disponible.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
  {
    title: "Envío en 24 – 48 horas",
    desc: "Pedidos procesados el mismo día hábil. Seguimiento de envío incluido.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Soporte técnico especializado",
    desc: "Equipo técnico disponible para asesorarte antes y después de tu compra.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
];

// ── Trust badges ──────────────────────────────────────────────────────────────
const TRUST = [
  { label: "Garantía oficial" },
  { label: "Envío en 24/48h" },
  { label: "Factura para empresas" },
  { label: "Pago seguro" },
  { label: "Devolución 30 días" },
];

function Home({ onOpenLogin, onNavigate }) {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-slate-50 text-slate-950">

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden bg-white"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M40 0H0v1h40zM0 40h40v-1H0zM0 0v40h1V0zM40 0v40h-1V0z' fill='%230F172A' fill-opacity='0.035'/%3E%3C/svg%3E\")",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-14 items-center">

              {/* Texto */}
              <div>
                <Motion.div
                  {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } })}
                  className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
                  Stock disponible · Envío inmediato
                </Motion.div>

                <Motion.h1
                  {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.05 } })}
                  className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4"
                  style={{ fontFamily: "Rubik, sans-serif" }}
                >
                  Tecnología profesional<br className="hidden sm:block" /> para tu empresa
                </Motion.h1>

                <Motion.p
                  {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.1 } })}
                  className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg"
                >
                  Portátiles, componentes, periféricos y servidores — con garantía oficial, soporte técnico y envío en 24/48 horas.
                </Motion.p>

                <Motion.div
                  {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.15 } })}
                  className="flex flex-wrap gap-3 mb-10"
                >
                  <button
                    onClick={() => onNavigate?.("productos")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    Ver catálogo
                  </button>
                </Motion.div>

                {/* Trust badges inline */}
                <Motion.div
                  {...(reduceMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2, delay: 0.2 } })}
                  className="flex flex-wrap gap-3"
                >
                  {TRUST.map((t) => (
                    <span
                      key={t.label}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-green-500 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {t.label}
                    </span>
                  ))}
                </Motion.div>
              </div>

              {/* Categorías grid */}
              <Motion.div
                {...(reduceMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, delay: 0.18 } })}
                className="hidden lg:block"
              >
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIAS.map((cat, i) => (
                    <button
                      key={cat.label}
                      onClick={() => onNavigate?.("productos")}
                      className="group flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer aspect-square"
                    >
                      <span className="text-slate-500 group-hover:text-blue-600 transition-colors duration-200">
                        {cat.icon}
                      </span>
                      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors duration-200 text-center">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Motion.div>

            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-800">
              {STATS.map(({ label, value, suffix }) => (
                <div key={label} className="text-center px-6 py-4">
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: "Rubik, sans-serif" }}>
                    <AnimatedStat value={value} suffix={suffix} />
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <Motion.h2
                {...(reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.2 } })}
                className="text-3xl font-bold text-slate-900 mb-3"
                style={{ fontFamily: "Rubik, sans-serif" }}
              >
                Por qué elegir ANCAMI
              </Motion.h2>
              <Motion.p
                {...(reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.2, delay: 0.05 } })}
                className="text-slate-600 max-w-xl mx-auto"
              >
                Más que una tienda — un proveedor tecnológico con gestión profesional detrás de cada pedido.
              </Motion.p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {FEATURES.map((feat, idx) => (
                <Motion.div
                  key={feat.title}
                  {...(reduceMotion ? {} : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.3 },
                    transition: { duration: 0.2, delay: idx * 0.06 },
                  })}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: "Rubik, sans-serif" }}>
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA — Empresas ── */}
        <section className="bg-white border-y border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Compras corporativas</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Rubik, sans-serif" }}>
                  ¿Equipás una empresa o múltiples puestos?
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Trabajamos con precios especiales para pedidos corporativos, licitaciones y proyectos de infraestructura IT. Factura para empresas incluida.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <button
                  onClick={() => onNavigate?.("contacto")}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors duration-200 cursor-pointer text-center"
                >
                  Solicitar cotización
                </button>
                <button
                  onClick={() => onNavigate?.("productos")}
                  className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold px-6 py-3.5 rounded-lg transition-colors duration-200 cursor-pointer text-center"
                >
                  Ver catálogo completo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="bg-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <Motion.h2
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.2 } })}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Rubik, sans-serif" }}
            >
              Empezá a equipar tu empresa hoy
            </Motion.h2>
            <Motion.p
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.2, delay: 0.05 } })}
              className="text-slate-400 mb-8 max-w-lg mx-auto"
            >
              Catálogo completo, stock real y soporte técnico especializado. Todo en un solo lugar.
            </Motion.p>
            <Motion.div
              {...(reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.2, delay: 0.1 } })}
              className="flex flex-wrap gap-3 justify-center"
            >
              <button
                onClick={() => onNavigate?.("productos")}
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm"
              >
                Ver catálogo
              </button>
              <button
                onClick={() => onOpenLogin?.()}
                className="border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Crear cuenta
              </button>
            </Motion.div>
          </div>
        </section>

      </div>
    </LazyMotion>
  );
}

export default Home;
