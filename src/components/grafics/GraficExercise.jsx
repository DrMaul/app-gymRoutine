import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const GraficExercise = ({ nombreEjercicio, datosProgreso }) => {
  console.log(datosProgreso);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">Evolución: {nombreEjercicio}</h2>
      <div className="w-full h-80 bg-gray-900 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosProgreso} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="semana" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            {/* Una barra por ejercicio */}
            {Object.keys(datosProgreso[0])
              .filter((key) => key !== 'semana')
              .map((ejercicio, index) => (
                <Bar key={ejercicio} dataKey={ejercicio} fill={['#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index % 4]} />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficExercise;
