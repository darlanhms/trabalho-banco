import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Table from '../../Components/Table';
import api from '../../services/api';
import { handleType } from '../../Utils/types';
import Modal from '../../Components/Modal';
import Form from '../../Components/Form';
import { tratObjCliente } from '../../Utils/utils'

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
    const [selected, setSelected] = useState<number[]>([]);
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [objSelected, setObjSelected] = useState<ICliente | Object>({});
    const [show, setShow] = useState<boolean>(false);
    const [type, setType] = useState<handleType | string>("");

    useEffect(() => {
        api.get("cliente")
        .then(clientes => {
            clientes.data.map((cliente: any) => tratObjCliente(cliente))
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
                setObjSelected({});
                break;
            case "Editar":
                if (selected && selected.length === 1) {
                    let cliente = clientes.find(a => a.id === selected[0]);
                    if (cliente) {
                        setObjSelected(cliente);
                        setType(type)
                        setShow(true);
                    } else {
                        alert("Não foi possível encontrar o cliente")
                    }
                } else {
                    alert("Selecione um para editar.")
                }
                break;
            case "Excluir":
                if (selected && selected.length === 1) {
                    let cliente = clientes.find(a => a.id === selected[0]);
                    if (cliente) {
                        setObjSelected(cliente);
                        setType(type)
                        setShow(true);
                    } else {
                        alert("Não foi possível encontrar o cliente")
                    }
                } else {
                    alert("Selecione um para editar.")
                }
                break;
            default:
                break;
        }
    }

    const handleSubmit = () => {
        switch (type) {
            case "Incluir":
                api.post("/cliente", objSelected)
                .then(res => {
                    console.log(tratObjCliente(res.data));
                    
                    setClientes([...clientes, tratObjCliente(res.data)]);
                    setShow(false);
                }).catch(err => {
                    console.log(err);
                    alert("Erro ao cadastrar cliente, tente novamente.")
                });
                break;
            default:
                break;
        }
    }

    const selectedAsCliente = (objSelected as ICliente);
    const inputs = [
        {
            controlId: "formNomeCliente",
            label: "Nome",
            value: selectedAsCliente.nome,
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...objSelected, nome: e.target.value }),
        },
        {
            controlId: "formEmailCliente",
            label: "Email",
            value: selectedAsCliente.email,
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...objSelected,email: e.target.value }),
        },
        {
            controlId: "formTelefoneCliente",
            label: "Telefone",
            value: selectedAsCliente.telefone,
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...objSelected, telefone: e.target.value }),
        },
        {
            controlId: "formLogradouroCliente",
            label: "Logradouro",
             value: selectedAsCliente.endereco ? selectedAsCliente.endereco.logradouro : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCliente, endereco: { ...(selectedAsCliente.endereco || {}), logradouro: e.target.value } }),
        },
        {
            controlId: "formCidadeCliente",
            label: "Cidade",
            value: selectedAsCliente.endereco ? selectedAsCliente.endereco.cidade : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCliente, endereco: { ...(selectedAsCliente.endereco || {}), cidade: e.target.value } }),
        },
        {
            controlId: "formEstadoCliente",
            label: "Estado",
            value: selectedAsCliente.endereco ? selectedAsCliente.endereco.estado : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCliente, endereco: { ...(selectedAsCliente.endereco || {}), estado: e.target.value } }),
        },
        {
            controlId: "formBairroCliente",
            label: "Bairro",
            value: selectedAsCliente.endereco ? selectedAsCliente.endereco.bairro : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCliente, endereco: { ...(selectedAsCliente.endereco || {}), bairro: e.target.value } }),
        },
        {
            controlId: "formNumeroCliente",
            label: "Número",
            value: selectedAsCliente.endereco ? selectedAsCliente.endereco.numero : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCliente, endereco: { ...(selectedAsCliente.endereco || {}), numero: e.target.value } }),
        },
    ]
    
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
                body={
                    type === "Excluir" ?
                    <div>
                        Você tem certeza que deseja excluir o cliente <b>{selectedAsCliente.nome}</b>?
                    </div>
                    :
                    <Form 
                        inputs={inputs}
                    />
                }
                handleSubmit={handleSubmit}
            />
        </div>
    )
}

export default Clientes
