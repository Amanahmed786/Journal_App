import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CONFIG } from '../config';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Database,
  Cpu,
  Mail,
  CheckCircle,
  Clock,
  Heart,
  Flame,
  CloudRain,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const { startDemo, isAuthenticating } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-600/20 via-violet-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Stack Spring Boot 4 + MongoDB + Kafka Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          Engineered for Reflection.{' '}
          <span className="bg-gradient-to-r from-brand-600 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Powered by Modern Java.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A high-performance journaling platform crafted by <strong>Aman Ahmed</strong>. Featuring stateless JWT
          authentication, Redis caching, and Kafka-backed weekly emotional sentiment streaming.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={startDemo}
            disabled={isAuthenticating}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {isAuthenticating ? 'Preparing Demo...' : 'Try Interactive Demo'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm"
          >
            Create Free Account
          </a>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          * Demo creates a guest account & pre-populates sample data in 1 click. Zero signup required.
        </p>

        {/* Product Preview Mockup */}
        <div className="mt-16 sm:mt-20 relative max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-slate-200/60 dark:from-slate-800/60 to-transparent border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-sm">
          <div className="rounded-2xl bg-slate-900 text-slate-100 p-6 sm:p-8 text-left border border-slate-800 overflow-hidden shadow-inner">
            {/* Top bar mockup */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-3 text-xs font-mono text-slate-400">GET /Journal (Protected API)</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                200 OK • 14ms (Redis Hit)
              </span>
            </div>

            {/* Simulated Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    HAPPY 😊
                  </span>
                  <span className="text-slate-400">Today</span>
                </div>
                <h4 className="font-semibold text-sm text-white">Kafka Event-Driven Architecture</h4>
                <p className="text-xs text-slate-400 line-clamp-3">
                  Decoupled weekly sentiment analytics using Spring Kafka. Scheduled workers emit messages to
                  weekly_sentiments topic asynchronously.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    ANXIOUS ⚡
                  </span>
                  <span className="text-slate-400">Yesterday</span>
                </div>
                <h4 className="font-semibold text-sm text-white">Redis Lettuce Connection Caching</h4>
                <p className="text-xs text-slate-400 line-clamp-3">
                  Configured OpenWeatherMap external API response caching in Redis Cloud, eliminating duplicate API calls.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-blue-400 font-medium">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                    SAD 😔
                  </span>
                  <span className="text-slate-400">Oct 26</span>
                </div>
                <h4 className="font-semibold text-sm text-white">Jackson ObjectId Serialization</h4>
                <p className="text-xs text-slate-400 line-clamp-3">
                  Fixed ObjectId {`{date, timestamp}`} payload formatting by registering ToStringSerializer in Jackson 3.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Breakdown Section */}
      <section className="py-16 sm:py-24 border-y border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Verified Backend Stack
            </h2>
            <h3 className="mt-2 text-3xl font-display font-bold text-slate-900 dark:text-white">
              Every badge corresponds to real code in this repository.
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              No generic boilerplate: inspect the controllers, services, schedulers, and configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONFIG.TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tech.category}
                  </span>
                  <CheckCircle className="w-4 h-4 text-brand-500" />
                </div>
                <h4 className="mt-3 font-display font-bold text-lg text-slate-900 dark:text-white">
                  {tech.name}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Authentication Flow */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            System Design & Security Flow
          </h2>
          <h3 className="mt-2 text-3xl font-display font-bold text-slate-900 dark:text-white">
            Stateless JWT & Asynchronous Pipeline
          </h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            How requests travel from the client through Spring Security, Mongo, and Kafka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-semibold text-base text-slate-900 dark:text-white">POST /public/login</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              DaoAuthenticationProvider verifies credentials against BCrypt hashed records in MongoDB.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-semibold text-base text-slate-900 dark:text-white">JWT Handshake</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              JwtUtil generates a cryptographically signed HMAC-SHA token with a 5-minute expiry claim.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-semibold text-base text-slate-900 dark:text-white">OncePerRequestFilter</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every request to /Journal or /user validates the Authorization: Bearer header statelessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="font-semibold text-base text-slate-900 dark:text-white">Kafka & Scheduler</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Weekly cron batch aggregates sentiment trends, produces to Kafka topic, and triggers email summaries.
            </p>
          </div>
        </div>

        {/* Ready to start CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={startDemo}
            disabled={isAuthenticating}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Launch Live Demo Session Now
          </button>
        </div>
      </section>
    </div>
  );
}
