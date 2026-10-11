import Navbar from "../components/Navbar";
import Link from "next/link";
const features = [
  {
    icon: "📄",
    title: "الوثائق الإدارية",
    description: "اكتشف مختلف الوثائق الإدارية التونسية والإجراءات اللازمة للحصول عليها.",
  },
  {
    icon: "📍",
    title: "أين تتوجه؟",
    description: "تعرف على الإدارة أو المؤسسة المعنية بإصدار الوثيقة التي تحتاجها.",
  },
  {
    icon: "⏱️",
    title: "وفّر وقتك",
    description: "استعد لزيارتك إلى الإدارة مسبقاً من خلال معرفة المستندات المطلوبة.",
  },
];

const categories = [
  { icon: "👤", title: "وثائق الهوية", count: "بطاقات ووثائق شخصية" },
  { icon: "🏠", title: "وثائق السكن", count: "الإقامة والوثائق المرتبطة بها" },
  { icon: "🎓", title: "وثائق التعليم", count: "شهادات ووثائق دراسية" },
  { icon: "⚖️", title: "وثائق الحالة المدنية", count: "الولادة والحالة المدنية" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800">
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          {/* Text */}
          <div className="text-center md:text-right">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              دليلك الرقمي للخدمات الإدارية التونسية
            </span>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              وثائقك الإدارية
              <br />
              <span className="text-blue-300">أصبحت أسهل</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base leading-8 text-blue-100/80 md:mx-0 md:text-lg">
              تبحث عن وثيقة إدارية تونسية ولا تعرف من أين تبدأ؟
              نحن نساعدك على معرفة الأوراق المطلوبة، والإجراءات،
              والجهة التي يجب التوجه إليها، بكل سهولة.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <a
                href="/documents"
                className="rounded-xl bg-white px-7 py-3.5 text-center font-bold text-blue-950 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
              >
                اكتشف الوثائق ←
              </a>

              <a
                href="/about"
                className="rounded-xl border border-white/30 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-white/10"
              >
                كيف يعمل الموقع؟
              </a>
            </div>
          </div>

          {/* Search Card */}
          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-2xl md:p-8">
              <div className="mb-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  🔎
                </div>

                <h2 className="mb-2 text-2xl font-bold text-blue-950">
                  ماذا تبحث عنه؟
                </h2>

                <p className="text-sm leading-6 text-gray-500">
                  اكتب اسم الوثيقة التي تريد معرفة إجراءات استخراجها.
                </p>
              </div>

              <form action="/documents" method="GET">
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  اسم الوثيقة
                </label>

                <input
                  id="search"
                  name="q"
                  type="search"
                  placeholder="مثال: مضمون الولادة..."
                  className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-right text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-900 px-6 py-4 font-bold text-white transition hover:bg-blue-800"
                >
                  ابحث عن الوثيقة
                </button>
              </form>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="mb-3 text-xs font-medium text-gray-400">
                  أمثلة على عمليات البحث
                </p>

                <div className="flex flex-wrap gap-2">
                  {["مضمون الولادة", "بطاقة التعريف", "شهادة الإقامة"].map(
                    (item) => (
                      <a
                        key={item}
                        href={`/documents?q=${encodeURIComponent(item)}`}
                        className="rounded-full bg-gray-100 px-3 py-2 text-xs text-gray-600 transition hover:bg-blue-100 hover:text-blue-900"
                      >
                        {item}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold text-blue-700">
            خدماتنا
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
            كل ما تحتاجه في مكان واحد
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-500">
            منصة تساعدك على الوصول إلى المعلومات الإدارية بطريقة
            واضحة ومنظمة، حتى تكون مستعداً قبل التوجه إلى الإدارة.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition group-hover:bg-blue-100">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-xl font-bold text-blue-950">
                {feature.title}
              </h3>

              <p className="leading-7 text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold text-blue-700">
                تصفح حسب التصنيف
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-blue-950">
                ماذا تريد أن تستخرج؟
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                اختر التصنيف المناسب للوصول إلى الوثائق التي تبحث عنها.
              </p>
            </div>

            <a
              href="/documents"
              className="font-bold text-blue-800 transition hover:text-blue-600"
            >
              جميع الوثائق ←
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <a
                key={category.title}
                href={`/documents?category=${encodeURIComponent(category.title)}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition group-hover:bg-blue-100">
                  {category.icon}
                </div>

                <h3 className="mb-2 text-lg font-bold text-blue-950">
                  {category.title}
                </h3>

                <p className="text-sm leading-6 text-gray-500">
                  {category.count}
                </p>

                <div className="mt-5 text-sm font-semibold text-blue-800">
                  اكتشف الوثائق ←
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold text-blue-700">
            خطوات بسيطة
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
            كيف تستعمل منصتنا؟
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "ابحث عن الوثيقة",
              description:
                "اكتب اسم الوثيقة التي تحتاجها أو تصفح التصنيفات المتاحة.",
            },
            {
              number: "02",
              title: "اكتشف الإجراءات",
              description:
                "اطلع على المستندات المطلوبة والشروط والجهة المعنية.",
            },
            {
              number: "03",
              title: "استعد لطلبك",
              description:
                "استعمل المعلومات لتجهيز ملفك قبل التوجه إلى الإدارة المعنية.",
            },
          ].map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-xl font-extrabold text-white shadow-lg shadow-blue-900/20">
                {step.number}
              </div>

              <h3 className="mb-3 text-xl font-bold text-blue-950">
                {step.title}
              </h3>

              <p className="mx-auto max-w-sm leading-7 text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-950 px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            ابدأ البحث عن وثيقتك الآن
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100/80">
            اكتشف المعلومات التي تحتاجها واجعل استعدادك لإجراءاتك
            الإدارية أكثر سهولة وتنظيماً.
          </p>

          <a
            href="/documents"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 font-bold text-blue-950 transition hover:-translate-y-1 hover:bg-blue-50"
          >
            تصفح الوثائق الإدارية ←
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center sm:flex-row">
          <div>
            <p className="font-bold text-blue-950">دليل تونس</p>
            <p className="mt-1 text-sm text-gray-500">
              دليلك للخدمات الإدارية
            </p>
          </div>
<div className="mt-6 text-center">
  <Link
    href="/admin/login"
    className="text-sm text-slate-400 hover:text-blue-900 transition"
  >
    فضاء الإدارة
  </Link>
</div>
          <p className="text-xs leading-6 text-gray-400">
            منصة معلوماتية مستقلة. يرجى التأكد من الإجراءات لدى
            الجهات الرسمية المختصة.
          </p>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Dalil Tounes
          </p>
        </div>
      </footer>
    </main>
  );
}