import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { addMedicion } from '../services/MedicionService';

function generarOpcionesMedidor() {
    return Array.from({ length: 10 }, (_, i) => {
        const valor = (i + 1).toString().padStart(2, '0');
        return { label: valor, value: valor };
    });
}

const opcionesMedidor = generarOpcionesMedidor();

const opcionesTipoMedida = [
    { label: 'Kilowatts', value: 'Kilowatts' },
    { label: 'Watts', value: 'Watts' },
    { label: 'Temperatura', value: 'Temperatura' }
];

export default function RegistrarLectura() {
    const [fechaHora, setFechaHora] = useState(null);
    const [medidor, setMedidor] = useState(null);
    const [direccion, setDireccion] = useState('');
    const [valor, setValor] = useState(null);
    const [tipoMedida, setTipoMedida] = useState(null);

    const toast = useRef(null);
    const navigate = useNavigate();

    function validarCampos() {
        const errores = [];
        if (!fechaHora) errores.push('Debe seleccionar la fecha y hora.');
        if (!medidor) errores.push('Debe seleccionar el medidor.');
        if (!direccion || direccion.trim() === '' || direccion === '<p><br></p>') errores.push('Debe ingresar la dirección.');
        if (valor === null || valor <= 9 || valor > 500) errores.push('El valor debe ser mayor que 9 y menor o igual a 500.');
        if (!tipoMedida) errores.push('Debe seleccionar el tipo de medida.');
        return errores;
    }

    function formatearFechaHora(date) {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = date.toLocaleString('es-ES', { month: 'long' });
        const año = date.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        const horaFormateada = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return { fecha: fechaFormateada, hora: horaFormateada };
    }

    function handleRegistrar() {
        const errores = validarCampos();

        if (errores.length > 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'Campos obligatorios',
                detail: errores.join(' '),
                life: 4000
            });
            return;
        }

        const { fecha, hora } = formatearFechaHora(fechaHora);

        const nuevaLectura = {
            id: Date.now(),
            fecha,
            hora,
            medidor,
            direccion,
            valor,
            tipo: tipoMedida
        };

        addMedicion(nuevaLectura);

        toast.current.show({
            severity: 'success',
            summary: 'Lectura registrada',
            detail: 'La lectura se ha registrado exitosamente.',
            life: 2000
        });

        setTimeout(() => {
            navigate('/mediciones-existentes');
        }, 2000);
    }

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <Panel header="Registrar Lectura" className="p-fluid">
                <div className="flex-auto mb-3">
                    <label htmlFor="fechaHora" className="font-bold mb-2 d-block">
                        Fecha y hora
                    </label>
                    <Calendar
                        id="fechaHora"
                        value={fechaHora}
                        onChange={(e) => setFechaHora(e.value)}
                        showIcon
                        showTime
                        dateFormat="dd-MM-yy"
                        hourFormat="24"
                        inputClassName="w-100"
                        className="calendar-rounded-icon"
                        placeholder="Seleccione fecha y hora"
                    />
                </div>
                <div className="flex-auto mb-3">
                    <label htmlFor="medidor" className="font-bold mb-2 d-block">
                        Medidor
                    </label>
                    <Dropdown
                        id="medidor"
                        value={medidor}
                        options={opcionesMedidor}
                        onChange={(e) => setMedidor(e.value)}
                        placeholder="Seleccione un medidor"
                        className="w-100"
                    />
                </div>
                <div className="flex-auto mb-3">
                    <label htmlFor="direccion" className="font-bold mb-2 d-block">
                        Dirección
                    </label>
                    <Editor
                        id="direccion"
                        value={direccion}
                        onTextChange={(e) => setDireccion(e.htmlValue)}
                        style={{ height: '50px' }}
                        placeholder="Ingrese la dirección"
                    />
                </div>
                <div className="flex-auto mb-3">
                    <label htmlFor="valor" className="font-bold mb-2 d-block">
                        Valor
                    </label>
                    <InputNumber
                        id="valor"
                        value={valor}
                        onValueChange={(e) => setValor(e.value)}
                        placeholder="Ingrese el valor"
                        min={10}
                        max={500}
                    />
                </div>
                <div className="flex-auto mb-3">
                    <label className="font-bold mb-2 d-block">
                        Tipo de medida
                    </label>
                    <div className="d-flex gap-3 flex-row mt-3">
                        {opcionesTipoMedida.map((opcion, idx) => (
                            <div className="d-flex align-items-center" key={opcion.value}>
                                <RadioButton
                                    inputId={`medida${idx + 1}`}
                                    name="tipoMedida"
                                    value={opcion.value}
                                    onChange={(e) => setTipoMedida(e.value)}
                                    checked={tipoMedida === opcion.value}
                                />
                                <label htmlFor={`medida${idx + 1}`} className="ms-2">{opcion.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-auto mt-5">
                    <Button label="Registrar Lectura" className="rounded" onClick={handleRegistrar} />
                </div>
            </Panel>
        </div>
    );
}