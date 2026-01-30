"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useTranslations } from "@/components/i18n/LocaleProvider";

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/hero/contact.webp"
          alt="Fondo de contacto"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
        {/* Columna izquierda - Información de contacto */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("contactPage.title")}
          </h1>
          <div className="space-y-6 text-white leading-relaxed">
            <p>{t("contactPage.intro")}</p>

            <div className="pt-4">
              <h2 className="text-lg font-semibold text-white mb-2">
                {t("contactPage.emailTitle")}
              </h2>
              <a
                href="mailto:go.natural.555@gmail.com"
                className="text-white hover:text-white/80 transition-colors duration-200 underline"
              >
                go.natural.555@gmail.com
              </a>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                {t("contactPage.hoursTitle")}
              </h2>
              <p className="text-white">
                {t("contactPage.hoursLine1")}
                <br />
                {t("contactPage.hoursLine2")}
                <br />
                {t("contactPage.hoursLine3")}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-white">
                <strong className="text-white">
                  {t("contactPage.quickTitle")}
                </strong>{" "}
                {t("contactPage.quickText")}
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Formulario */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-2"
              >
                {t("contactPage.form.nameLabel")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-dark-surface text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder={t("contactPage.form.namePlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                {t("contactPage.form.emailLabel")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-dark-surface text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder={t("contactPage.form.emailPlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-white mb-2"
              >
                {t("contactPage.form.messageLabel")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-dark-surface text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 resize-none"
                placeholder={t("contactPage.form.messagePlaceholder")}
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              {t("contactPage.form.submit")}
            </button>
          </form>
        </div>
        </div>
      </main>
    </div>
  );
}

