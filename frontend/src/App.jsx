import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServerStatusBanner from './components/ServerStatusBanner';
import DemoBanner from './components/DemoBanner';
import AppRouter from './router';

export default function App() {
  const [triggerNewEntry, setTriggerNewEntry] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <ServerStatusBanner />
      <DemoBanner />
      <Navbar onOpenNewEntry={() => setTriggerNewEntry(true)} />
      <main className="flex-1">
        <AppRouter
          triggerNewEntry={triggerNewEntry}
          onResetTrigger={() => setTriggerNewEntry(false)}
        />
      </main>
      <Footer />
    </div>
  );
}
