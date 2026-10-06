import Link from "next/link";

const pizzas = [
  {
    number: "01",
    name: "DIAVOLA",
    description:
      "Molho de tomate, mozzarella, pepperoni e azeite.",
    price: "R$ 49",
  },
  {
    number: "02",
    name: "MARGHERITA",
    description:
      "Tomate, mozzarella, manjericão fresco e azeite.",
    price: "R$ 44",
  },
  {
    number: "03",
    name: "NAPOLETANA",
    description:
      "Tomate, mozzarella, parmesão, alho e manjericão.",
    price: "R$ 47",
  },
  {
    number: "04",
    name: "PICCANTE",
    description:
      "Tomate, mozzarella, pepperoni picante e mel.",
    price: "R$ 52",
  },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* NAV */}

      <nav className="flex items-center justify-between px-6 py-7 md:px-12">

        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.35em]"
        >
          FORNO.
        </Link>

        <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
          Menu
        </span>

        <Link
          href="/"
          className="rounded-full border border-white/25 px-5 py-2 text-[10px] uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
        >
          Voltar
        </Link>

      </nav>

      {/* HEADER */}

      <section className="px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28">

        <p className="mb-7 text-[10px] uppercase tracking-[0.55em] text-orange-500">
          Nosso menu
        </p>

        <h1 className="text-7xl font-semibold leading-[0.78] tracking-[-0.075em] md:text-[130px]">
          FEITA
          <br />
          NO
          <br />
          FOGO.
        </h1>

        <p className="mt-10 max-w-lg text-sm leading-7 text-white/50">
          Massa de fermentação lenta, ingredientes selecionados e forno em
          alta temperatura.
        </p>

      </section>

      {/* PIZZAS */}

      <section className="px-6 pb-32 md:px-12">

        <div className="border-t border-white/10">

          {pizzas.map((pizza) => (
            <article
              key={pizza.name}
              className="grid border-b border-white/10 py-12 md:grid-cols-[80px_1fr_auto] md:items-center md:gap-12"
            >

              <span className="text-[10px] tracking-[0.3em] text-white/30">
                {pizza.number}
              </span>

              <div>

                <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                  {pizza.name}
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-white/45">
                  {pizza.description}
                </p>

              </div>

              <span className="mt-7 text-lg text-orange-500 md:mt-0">
                {pizza.price}
              </span>

            </article>
          ))}

        </div>

      </section>

      {/* PIZZA */}

      <section className="relative overflow-hidden border-t border-white/10 px-6 py-32 text-center">

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-xl">

          <img
            src="/images/pizza.png"
            alt="Pizza artesanal de pepperoni"
            className="mx-auto w-full max-w-[560px] object-contain drop-shadow-[0_35px_70px_rgba(0,0,0,.8)]"
          />

          <p className="mt-10 text-[10px] uppercase tracking-[0.55em] text-orange-500">
            Feita no fogo
          </p>

          <h2 className="mt-5 text-5xl font-semibold leading-[0.85] tracking-[-0.07em] md:text-7xl">
            O FORNO
            <br />
            ESTÁ ACESO.
          </h2>

        </div>

      </section>

      {/* FOOTER */}

      <section className="border-t border-white/10 px-6 py-24 text-center">

        <p className="text-[10px] uppercase tracking-[0.55em] text-orange-500">
          FORNO.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-white/25 px-8 py-4 text-[10px] uppercase tracking-[0.3em] transition hover:bg-white hover:text-black"
        >
          Voltar para experiência
        </Link>

      </section>

    </main>
  );
}