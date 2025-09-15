'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, XCircle, Activity, Thermometer, Zap, Gauge } from 'lucide-react';
import mqttService, { useMqttData, SensorData, MqttAlert } from '@/services/mqttService';
import { getAssetsFromStorage } from '@/services/assetsService';

interface MqttDashboardProps {
  selectedMachineId?: string;
}

const MqttDashboard: React.FC<MqttDashboardProps> = ({ selectedMachineId }) => {
  const { sensorData, alerts, isConnected, acknowledgeAlert, sendCommand } = useMqttData(selectedMachineId);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    const assets = getAssetsFromStorage();
    setMachines(assets.filter(asset => asset.status === 'ativo'));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType.toLowerCase()) {
      case 'temperatura':
        return <Thermometer className="h-4 w-4" />;
      case 'pressão':
        return <Gauge className="h-4 w-4" />;
      case 'energia':
        return <Zap className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatChartData = (data: SensorData[]) => {
    return data.slice(-20).map(item => ({
      time: item.timestamp.toLocaleTimeString(),
      value: item.value,
      status: item.status
    }));
  };

  const groupedSensorData = sensorData.reduce((acc, data) => {
    if (!acc[data.machineId]) {
      acc[data.machineId] = {};
    }
    if (!acc[data.machineId][data.sensorId]) {
      acc[data.machineId][data.sensorId] = [];
    }
    acc[data.machineId][data.sensorId].push(data);
    return acc;
  }, {} as Record<string, Record<string, SensorData[]>>);

  const latestSensorData = sensorData.reduce((acc, data) => {
    const key = `${data.machineId}-${data.sensorId}`;
    if (!acc[key] || data.timestamp > acc[key].timestamp) {
      acc[key] = data;
    }
    return acc;
  }, {} as Record<string, SensorData>);

  const machineStatusData = machines.map(machine => {
    const machineAlerts = alerts.filter(alert => alert.machineId === machine.id && !alert.acknowledged);
    const machineSensors = Object.values(latestSensorData).filter(data => data.machineId === machine.id);
    
    return {
      id: machine.id,
      name: machine.apelido,
      status: machine.controller?.status || 'offline',
      alertCount: machineAlerts.length,
      sensorCount: machineSensors.length,
      criticalSensors: machineSensors.filter(s => s.status === 'critical').length,
      warningSensors: machineSensors.filter(s => s.status === 'warning').length
    };
  });

  return (
    <div className="space-y-6">
      {/* Header com status de conexão */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Conectado ao MQTT</span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-600">Desconectado</span>
            </>
          )}
        </div>
        <Badge variant="outline">
          {machines.length} Máquinas Monitoradas
        </Badge>
      </div>

      {/* Alertas ativos */}
      {alerts.filter(alert => !alert.acknowledged).length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                {alerts.filter(alert => !alert.acknowledged).length} alertas ativos
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTab('alerts')}
              >
                Ver Alertas
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sensors">Sensores</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="machines">Máquinas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Máquinas Online</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {machineStatusData.filter(m => m.status === 'online').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  de {machines.length} máquinas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sensores Ativos</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(latestSensorData).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  enviando dados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  requerem atenção
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sensores em Alerta</CardTitle>
                <XCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.values(latestSensorData).filter(s => s.status !== 'normal').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  fora dos limites
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status das máquinas */}
          <Card>
            <CardHeader>
              <CardTitle>Status das Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {machineStatusData.map(machine => (
                  <div key={machine.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{machine.name}</h4>
                      {getStatusIcon(machine.status)}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Sensores: {machine.sensorCount}</div>
                      {machine.criticalSensors > 0 && (
                        <div className="text-red-600">
                          Críticos: {machine.criticalSensors}
                        </div>
                      )}
                      {machine.warningSensors > 0 && (
                        <div className="text-yellow-600">
                          Avisos: {machine.warningSensors}
                        </div>
                      )}
                      {machine.alertCount > 0 && (
                        <div className="text-red-600">
                          Alertas: {machine.alertCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors" className="space-y-4">
          {Object.entries(groupedSensorData).map(([machineId, machineSensors]) => {
            const machine = machines.find(m => m.id === machineId);
            if (!machine) return null;

            return (
              <Card key={machineId}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{machine.apelido}</span>
                    {getStatusIcon(machine.controller?.status || 'offline')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(machineSensors).map(([sensorId, sensorHistory]) => {
                      const latestData = sensorHistory[sensorHistory.length - 1];
                      const chartData = formatChartData(sensorHistory);

                      return (
                        <div key={sensorId} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getSensorIcon(latestData.sensorName)}
                              <span className="font-medium">{latestData.sensorName}</span>
                            </div>
                            <Badge className={getStatusColor(latestData.status)}>
                              {latestData.status}
                            </Badge>
                          </div>
                          
                          <div className="text-2xl font-bold">
                            {latestData.value} {latestData.unit}
                          </div>
                          
                          <div className="h-32">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" fontSize={10} />
                                <YAxis fontSize={10} />
                                <Tooltip />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke={latestData.status === 'critical' ? '#ef4444' : 
                                         latestData.status === 'warning' ? '#f59e0b' : '#10b981'}
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.filter(alert => !alert.acknowledged).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum alerta ativo
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts
                    .filter(alert => !alert.acknowledged)
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map(alert => (
                      <div key={alert.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className={`h-4 w-4 ${
                              alert.severity === 'critical' ? 'text-red-500' :
                              alert.severity === 'high' ? 'text-orange-500' :
                              alert.severity === 'medium' ? 'text-yellow-500' :
                              'text-blue-500'
                            }`} />
                            <span className="font-medium">{alert.machineName}</span>
                            <Badge variant="outline">{alert.severity}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Reconhecer
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {alert.sensorName}
                        </div>
                        <div className="text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {alert.timestamp.toLocaleString()}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="machines" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {machines.map(machine => {
              const machineData = Object.values(latestSensorData).filter(data => data.machineId === machine.id);
              const machineAlerts = alerts.filter(alert => alert.machineId === machine.id && !alert.acknowledged);

              return (
                <Card key={machine.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{machine.apelido}</span>
                      {getStatusIcon(machine.controller?.status || 'offline')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Modelo</div>
                          <div className="font-medium">{machine.modelo}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Controlador</div>
                          <div className="font-medium">
                            {machine.controller?.model || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">IP</div>
                          <div className="font-medium">
                            {machine.controller?.ipAddress || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Sensores</div>
                          <div className="font-medium">{machineData.length}</div>
                        </div>
                      </div>

                      {machineAlerts.length > 0 && (
                        <div className="border-t pt-4">
                          <div className="text-sm font-medium mb-2">Alertas Ativos</div>
                          <div className="space-y-2">
                            {machineAlerts.slice(0, 3).map(alert => (
                              <div key={alert.id} className="text-sm p-2 bg-red-50 rounded">
                                <div className="font-medium">{alert.sensorName}</div>
                                <div className="text-muted-foreground">{alert.message}</div>
                              </div>
                            ))}
                            {machineAlerts.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{machineAlerts.length - 3} mais alertas
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {machineData.length > 0 && (
                        <div className="border-t pt-4">
                          <div className="text-sm font-medium mb-2">Últimas Leituras</div>
                          <div className="space-y-2">
                            {machineData.slice(0, 3).map(data => (
                              <div key={data.sensorId} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  {getSensorIcon(data.sensorName)}
                                  <span>{data.sensorName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {data.value} {data.unit}
                                  </span>
                                  <Badge className={getStatusColor(data.status)}>
                                    {data.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MqttDashboard;