import React, { useState, useEffect } from 'react';
import Table from '../../Components/Table';
import api from '../../services/api';


interface IEndereco {
    logradouro: string;
    numero: number;
    cidade: string;
    estado: string;
    bairro: string;
}
interface ICliente {
    nome: string;
    email: string;
    telefone: string;
    endereco: IEndereco;
}

const Clientes:React.FC = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [clientes, setClientes] = useState<ICliente[]>([]);

    useEffect(() => {
        api.get("cliente")
        .then(clientes => {
            setClientes(clientes.data);
        }).catch(err => {
            console.log("Erro ao buscar clientes: ", err);
        })
    }, []);

    useEffect(() => {
        console.log(clientes);
        
    }, [clientes])

    const headCells = [
        {id: "nome", label: "nome"}
    ]

    const rows = [
        {"id": "1", "nome": "zezinho"}
    ]

    return (
        <Table 
            selected={selected}
            setSelected={setSelected}
            rows={rows}
            headCells={headCells}
        />
    )
}

export default Clientes
