import React from 'react';
import { CONFIG } from '../config';
import { Github, Linkedin, ExternalLink, Heart, Shield, Database, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <span className="font-display font-bold text-xl bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
              Aura Journal
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              A high-concurrency Spring Boot journaling application with stateless JWT authentication,
              asynchronous Kafka sentiment processing, and Redis-powered low-latency caching.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={CONFIG.DEVELOPER.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-105 transition-all"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={CONFIG.DEVELOPER.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-105 transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Core Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-brand-500" />
                <span>Stateless JWT & BCrypt Security</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-brand-500" />
                <span>MongoDB Replica Cluster</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-brand-500" />
                <span>Redis Cloud Caching Layer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 flex items-center justify-center font-mono font-bold text-[10px] text-brand-500">K</span>
                <span>Apache Kafka Sentiment Stream</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Developer & Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-500">Engineer:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{CONFIG.DEVELOPER.name}</strong>
              </li>
              <li>
                <span className="text-slate-500">Role:</span> {CONFIG.DEVELOPER.role}
              </li>
              {CONFIG.SWAGGER_ENABLED && (
                <li>
                  <a
                    href={CONFIG.SWAGGER_URL}
                    className="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                  >
                    OpenAPI / Swagger Spec
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Aura Journal. Crafted for engineering excellence.</p>
          <p className="flex items-center gap-1">
            Built by <span className="font-semibold text-slate-700 dark:text-slate-300">{CONFIG.DEVELOPER.name}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
