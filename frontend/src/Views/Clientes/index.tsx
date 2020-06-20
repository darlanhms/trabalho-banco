import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'
import Table from '../../Components/Table';
import api from '../../services/api';
import { handleType } from '../../Utils/types';
import Modal from '../../Components/Modal'

interface IEndereco {
    logradouro: string;
    numero: number;
    cidade: string;
    estado: string;
    bairro: string;
}
interface ICliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: IEndereco;
}

const Clientes:React.FC = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [type, setType] = useState<handleType | string>("");

    useEffect(() => {
        api.get("cliente")
        .then(clientes => {
            setClientes(clientes.data);
        }).catch(err => {
            console.log("Erro ao buscar clientes: ", err);
        })
    }, []);

    const headCells = [
        { id: "nome", label: "Nome" },
        { id: "telefone", label: "Telefone" },
        { id: "cidade", label: "Cidade" },
        { id: "logradouro", label: "Logradouro" },
    ]

    const rows = clientes;

    const handlePress = (type: handleType):void => {
        switch (type) {
            case "Incluir":
                setType(type)
                setShow(true);
                break;
            case "Editar":
                setType(type)
                setShow(true);
                
                break;
            case "Excluir":
                setType(type)
                setShow(true);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <h1 className="title-section">Clientes</h1>
            <div className="headerButtons">
                <Button variant="dark" onClick={() => handlePress("Incluir")}>Incluir</Button>
                <Button variant="dark" onClick={() => handlePress("Editar")}>Editar</Button>
                <Button variant="dark" onClick={() => handlePress("Excluir")}>Excluir</Button>
            </div>
            <Table 
                selected={selected}
                setSelected={setSelected}
                rows={rows}
                headCells={headCells}
            />
            <Modal
                show={show}
                setShow={setShow}
                title={type}
                body="Dale na narguilera"
                handleSubmit={() => {}}
            />
        </div>
    )
}

export default Clientes
