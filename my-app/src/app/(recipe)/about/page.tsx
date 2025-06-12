"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation('about');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-orange-800 mb-6 tracking-tight"
          variants={fadeInUp}
        >
          {t('about.hero.title')}
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          {t('about.hero.description')}
        </motion.p>
        <motion.div
          className="mt-10 relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          variants={fadeInUp}
        >
          <Image
            src="/images/about.jpeg"
            alt={t('about.hero.imageAlt')}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm font-medium">{t('about.hero.imageCaption')}</p>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-orange-800 text-center mb-12"
          variants={fadeInUp}
        >
          {t('about.features.title')}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: '🌍',
              title: t('about.features.globalFlavors.title'),
              description: t('about.features.globalFlavors.description'),
            },
            {
              icon: '🤝',
              title: t('about.features.communityDriven.title'),
              description: t('about.features.communityDriven.description'),
            },
            {
              icon: '💡',
              title: t('about.features.inspiringCreativity.title'),
              description: t('about.features.inspiringCreativity.description'),
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              variants={fadeInUp}
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-orange-800 mb-6"
          variants={fadeInUp}
        >
          {t('about.mission.title')}
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed"
          variants={fadeInUp}
        >
          {t('about.mission.description1')}
        </motion.p>
        <motion.p
          className="text-lg sm:text-xl text-gray-600 leading-relaxed"
          variants={fadeInUp}
        >
          {t('about.mission.description2')}
        </motion.p>
      </motion.section>

      {/* Quote/Testimonial Section */}
      <motion.section
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.blockquote
          className="text-lg sm:text-xl italic text-gray-600 max-w-2xl mx-auto"
          variants={fadeInUp}
        >
          {t('about.testimonial.quote')}
        </motion.blockquote>
        <motion.p
          className="mt-4 text-sm sm:text-base text-gray-500"
          variants={fadeInUp}
        >
          {t('about.testimonial.author')}
        </motion.p>
      </motion.section>
    </main>
  );
}