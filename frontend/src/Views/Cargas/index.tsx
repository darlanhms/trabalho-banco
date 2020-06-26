import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import api from '../../services/api';
import Modal from '../../Components/Modal';
import Form from '../../Components/Form';
import Table from '../../Components/Table';
import { handleType } from '../../Utils/types';
import { tratObjCliente } from '../../Utils/utils';

interface IEndereco {
    logradouro: string;
    cidade: string;
    numero: string;
    estado: string;
    bairro: string
}

interface ICarga {
    id: number;
    dataEntrega: string;
    dataEntrada: string;
    tamanho: string;
    peso: string;
    largura: string;
    altura: string;
    comprimento: string;
    status: number;
    endereco: IEndereco;
}

const Cargas:React.FC = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const [cargas, setCargas] = useState<ICarga[]>([]);
    const [objSelected, setObjSelected] = useState<ICarga | Object>({});
    const [show, setShow] = useState<boolean>(false);
    const [type, setType] = useState<handleType | string>("");

    const selectedAsCarga = (objSelected as ICarga);

    useEffect(() => {
        api.get("carga")
        .then(cargas => {
            cargas.data.map((carga: any) => tratObjCliente(carga))
            setCargas(cargas.data);
        }).catch(err => {
            console.log("Erro ao buscar clientes: ", err);
        })
    }, []);

    const rows:any[] = [];
    cargas.forEach(carga => {
        let newCarga:any = {...carga}

        if (newCarga.endereco) {
            newCarga.cidade = newCarga.endereco.cidade;
            newCarga.estado = newCarga.endereco.estado;
            newCarga.logradouro = newCarga.endereco.logradouro;
            newCarga.bairro = newCarga.endereco.bairro;
            newCarga.numero = newCarga.endereco.numero;
        }

        rows.push(newCarga);
    });

    const handlePress = (type:handleType) => {
        switch (type) {
            case "Incluir":
                setType(type)
                setShow(true);
                setObjSelected({});
                break;
            case "Editar":
                if (selected && selected.length === 1) {
                    let carga = cargas.find(a => a.id === selected[0]);
                    if (carga) {
                        setObjSelected(carga);
                        setType(type)
                        setShow(true);
                    } else {
                        alert("Não foi possível encontrar o carga")
                    }
                } else {
                    alert("Selecione um para editar.")
                }
                break;
            case "Excluir":
                if (selected && selected.length === 1) {
                    let carga = cargas.find(a => a.id === selected[0]);
                    if (carga) {
                        setObjSelected(carga);
                        setType(type)
                        setShow(true);
                    } else {
                        alert("Não foi possível encontrar o cliente")
                    }
                } else {
                    alert("Selecione um para excluir.")
                }
                break;
            default:
                break;
        }
    }

    const handleSubmit = () => {
        switch (type) {
            case "Incluir":
                (objSelected as ICarga).dataEntrada = moment().format("DDMMYYYY");
                api.post("/carga", objSelected)
                .then(res => {
                    setCargas([...cargas, tratObjCliente(res.data)]);
                    setShow(false);
                    setObjSelected({});
                    setSelected([]);
                }).catch(err => {
                    console.log(err);
                    alert("Erro ao cadastrar cliente, tente novamente.")
                });
                break;
            case "Editar":
                api.patch("/carga/" + (objSelected as ICarga).id, objSelected)
                .then(carga => {
                    setCargas([...cargas.filter(a => a.id !== (objSelected as ICarga).id), carga.data]);
                    setShow(false);
                    setObjSelected({});
                    setSelected([]);
                }).catch(err => {
                    console.log(err);
                    alert("Não foi possível excluir o cliente");
                });
                break;
            case "Excluir":
                api.delete("/carga/" + (objSelected as ICarga).id)
                .then(deleted => {
                    setCargas([...cargas.filter(a => a.id !== (objSelected as ICarga).id)]);
                    setShow(false);
                    setObjSelected({});
                    setSelected([]);
                }).catch(err => {
                    console.log(err);
                    alert("Não foi possível excluir o cliente");
                })
                break;
            default:
                break;
        }
    }

    const inputs = [
        {
            controlId: "formDataEntregaCarga",
            label: "Data de entrega",
            value: selectedAsCarga.dataEntrega || "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, dataEntrega: e.target.value }),
        },
        {
            controlId: "formPesoCarga",
            label: "Peso",
            value: selectedAsCarga.peso || "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, peso: e.target.value }),
        },
        {
            controlId: "formComprimentoCarga",
            label: "Tamanho",
            value: selectedAsCarga.comprimento || "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, comprimento: e.target.value }),
        },
        {
            controlId: "formAlturaCarga",
            label: "Altura",
            value: selectedAsCarga.altura || "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, altura: e.target.value }),
        },
        {
            controlId: "formLarguraCarga",
            label: "Largura",
            value: selectedAsCarga.largura || "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, largura: e.target.value }),
        },
        {
            controlId: "formLogradouroCliente",
            label: "Logradouro",
            value: selectedAsCarga.endereco ? selectedAsCarga.endereco.logradouro : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), logradouro: e.target.value } }),
        },
        {
            controlId: "formCidadeCliente",
            label: "Cidade",
            value: selectedAsCarga.endereco ? selectedAsCarga.endereco.cidade : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), cidade: e.target.value } }),
        },
        {
            controlId: "formEstadoCliente",
            label: "Estado",
            value: selectedAsCarga.endereco ? selectedAsCarga.endereco.estado : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), estado: e.target.value } }),
        },
        {
            controlId: "formBairroCliente",
            label: "Bairro",
            value: selectedAsCarga.endereco ? selectedAsCarga.endereco.bairro : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), bairro: e.target.value } }),
        },
        {
            controlId: "formNumeroCliente",
            label: "Número",
            type: "number",
            value: selectedAsCarga.endereco ? selectedAsCarga.endereco.numero : "",
            onChange: (e: React.ChangeEvent<any>) => setObjSelected({...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), numero: e.target.value } }),
        },
    ]

    const headCells = [
        { id: "dataEntrada", label: "Data de entrada" },
        { id: "dataEntrega", label: "Data de entrega" },
        { id: "peso", label: "Peso" },
        { id: "largura", label: "Largura" },
        { id: "altura", label: "Altura" },
        { id: "comprimento", label: "Comprimento" },
    ]
    
    return (
        <div>
        <h1 className="title-section">Cargas</h1>
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
                    Você tem certeza que deseja excluir a carga <b>{selectedAsCarga.dataEntrada}</b>?
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

export default Cargas;
