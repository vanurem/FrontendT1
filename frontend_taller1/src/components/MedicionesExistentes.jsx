import React, { useEffect, useState, useRef } from 'react';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getMediciones, deleteMedicion } from '../services/MedicionService';

const opcionesTipoMedida = [
    { label: 'Kilowatts', value: 'Kilowatts' },
    { label: 'Watts', value: 'Watts' },
    { label: 'Temperatura', value: 'Temperatura' }
];

function obtenerUnidad(tipo) {
    if (tipo === 'Kilowatts') return 'kW';
    if (tipo === 'Watts') return 'W';
    if (tipo === 'Temperatura') return 'C';
    return '';
}

function formatearValor(fila) {
    return `${fila.valor} ${obtenerUnidad(fila.tipo)}`;
}

function plantillaAcciones(fila, descartarMedicion) {
    return (
        <Button
            icon="pi pi-trash"
            severity="danger"
            text
            onClick={() => descartarMedicion(fila.id)}
            tooltip="Descartar Lectura"
        />
    );
}

export default function MedicionesExistentes() {
    const [listaMediciones, setListaMediciones] = useState([]);
    const [tipoFiltro, setTipoFiltro] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        setListaMediciones(getMediciones());
        const actualizarMediciones = () => setListaMediciones(getMediciones());
        window.addEventListener('storage', actualizarMediciones);
        return () => window.removeEventListener('storage', actualizarMediciones);
    }, []);

    function descartarMedicion(id) {
        deleteMedicion(id);
        setListaMediciones(getMediciones());
        toast.current.show({
            severity: 'info',
            summary: 'Lectura descartada',
            life: 3000
        });
    }

    function filtrarMediciones() {
        if (tipoFiltro) {
            const filtradas = getMediciones().filter(medicion => medicion.tipo === tipoFiltro);
            setListaMediciones(filtradas);
        } else {
            setListaMediciones(getMediciones());
        }
    }

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <Panel header="Mediciones Existentes">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <Dropdown
                        value={tipoFiltro}
                        options={opcionesTipoMedida}
                        onChange={(e) => setTipoFiltro(e.value)}
                        placeholder="Filtrar por tipo"
                    />
                    <Button label="Filtrar" icon="pi pi-filter" onClick={filtrarMediciones} />
                </div>

                <DataTable value={listaMediciones} paginator rows={5} sortField="fecha" sortOrder={-1}>
                    <Column field="fecha" header="Fecha" sortable />
                    <Column field="hora" header="Hora" />
                    <Column field="medidor" header="Medidor" />
                    <Column header="Valor" body={formatearValor} />
                    <Column header="Acciones" body={(fila) => plantillaAcciones(fila, descartarMedicion)} />
                </DataTable>
            </Panel>
        </div>
    );
}