const STORAGE_KEY = 'mediciones_sanquinta';

const shouldSeed = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length === 0;
  } catch {
    return true;
  }
};

if (shouldSeed()) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([
    { id: 201, fecha: '2025-12-01', hora: '09:20', medidor: 'X10', direccion: 'Calle Aurora 12, Quilpué', valor: 245.7, tipo: 'Kilowatts', observacion: 'Lectura inicial' },
    { id: 202, fecha: '2025-12-02', hora: '13:05', medidor: 'Y22', direccion: 'Av. El Sol 45, Viña del Mar', valor: 102.4, tipo: 'Watts', observacion: 'Prueba sensor' },
    { id: 203, fecha: '2025-12-03', hora: '18:40', medidor: 'Z03', direccion: 'Pasaje Lirio 9, Valparaíso', valor: 19.8, tipo: 'Temperatura', observacion: 'Exterior' },
    { id: 204, fecha: '2025-12-04', hora: '07:10', medidor: 'W11', direccion: 'Camino Verde 200, Quilpué', valor: 510.2, tipo: 'Kilowatts', observacion: 'Consumo alto' },
    { id: 205, fecha: '2025-12-05', hora: '20:30', medidor: 'V08', direccion: 'Calle Larga 77, Villa Alemana', valor: 64.6, tipo: 'Watts', observacion: 'Baja demanda' }
  ]));
}

export const getMediciones = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteMedicion = (id) => {
  const data = getMediciones();
  const filtradas = data.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
};

export const filtrarPorTipo = (tipo) => {
  return getMediciones().filter(m => m.tipo === tipo);
};