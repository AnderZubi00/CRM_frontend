import { Button } from "@/components/ui/button";
import { LazyMotion, domAnimation, motion, useReducedMotion } from "framer-motion";

function Home({ onOpenLogin, onNavigate }) {
  const reduceMotion = useReducedMotion();
  const MotionLi = motion.li;
  return (
    <div id="home" className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(135deg, hsl(215 90% 42% / 0.92) 0%, hsl(222 47% 11% / 0.88) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
            Operaciones y canal cliente
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            ANCAMI: gestión profesional de tu negocio
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            Accede al panel según tu rol, consulta el catálogo y coordina pedidos con una interfaz clara y coherente.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-primary shadow-md hover:bg-white/95"
              onClick={() => onOpenLogin?.()}
            >
              Iniciar sesión
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              onClick={() => onNavigate?.("productos")}
            >
              Ver catálogo público
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Cómo empezar</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Elige la ruta que corresponda a tu perfil. Los administradores y empleados usan el panel interno; los clientes
          compran desde la tienda tras registrarse.
        </p>
        <LazyMotion features={domAnimation}>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Administración",
                desc: "Usuarios, productos, categorías y proveedores en un solo lugar.",
              },
              {
                title: "Tienda cliente",
                desc: "Catálogo con stock visible y cesta persistente en tu dispositivo.",
              },
              {
                title: "Soporte",
                desc: "Contacto y políticas disponibles desde el pie de página.",
              },
            ].map((item, idx) => (
              <MotionLi
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.22, delay: idx * 0.04, ease: "easeOut" }}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  ✓
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </MotionLi>
            ))}
          </ul>
        </LazyMotion>
      </section>
    </div>
  );
}

export default Home;
