import React, { useEffect, useState, useRef } from 'react';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getMediciones, deleteMedicion, filtrarPorTipo } from '../services/MedicionService';

const MedicionesExistentes = () => {
  const [mediciones, setMediciones] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    setMediciones(getMediciones());
  }, []);

  const handleDelete = (id) => {
    deleteMedicion(id);
    setMediciones(getMediciones());
    toast.current.show({ severity: 'info', summary: 'Lectura descartada', life: 3000 });
  };

  const handleFiltrar = () => {
    if (tipoFiltro) {
      const filtradas = getMediciones().filter(m => m.tipo === tipoFiltro);
      setMediciones(filtradas);
    } else {
      setMediciones(getMediciones());
    }
  };

  const unidad = (tipo) => {
    if (tipo === 'Kilowatts') return 'kW';
    if (tipo === 'Watts') return 'W';
    if (tipo === 'Temperatura') return 'C';
    return '';
  };

  const valorTemplate = (row) => `${row.valor} ${unidad(row.tipo)}`;

  const accionesTemplate = (row) => (
    <Button
      icon="pi pi-trash"
      severity="danger"
      text
      onClick={() => handleDelete(row.id)}
      tooltip="Descartar Lectura"
    />
  );

  const tipos = ['Kilowatts', 'Watts', 'Temperatura'];

  return (
    <div className="container mt-4">
      <Toast ref={toast} />
      <Panel header="Mediciones Existentes">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Dropdown
            value={tipoFiltro}
            options={tipos}
            onChange={(e) => setTipoFiltro(e.value)}
            placeholder="Filtrar por tipo"
          />
          <Button label="Filtrar" icon="pi pi-filter" onClick={handleFiltrar} />
        </div>

        <DataTable value={mediciones} paginator rows={5} sortField="fecha" sortOrder={-1}>
          <Column field="fecha" header="Fecha" sortable />
          <Column field="hora" header="Hora" />
          <Column field="medidor" header="Medidor" />
          <Column header="Valor" body={valorTemplate} />
          <Column header="Acciones" body={accionesTemplate} />
        </DataTable>
      </Panel>
    </div>
  );
};

export default MedicionesExistentes;