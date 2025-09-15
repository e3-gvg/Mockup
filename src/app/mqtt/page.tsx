'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MqttDashboard from '@/components/MqttDashboard';

const MqttPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('mqtt');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Monitoramento MQTT
            </h1>
            <p className="text-gray-600 mt-2">
              Monitoramento em tempo real dos controladores Beckhoff CX7000 e sensores das máquinas
            </p>
          </div>
          
          <MqttDashboard />
        </div>
      </main>
    </div>
  );
};

export default MqttPage;