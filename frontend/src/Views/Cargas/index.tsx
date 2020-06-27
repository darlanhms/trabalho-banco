import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import moment from 'moment'
import api from '../../services/api'
import Modal from '../../Components/Modal'
import Form from '../../Components/Form'
import Table from '../../Components/Table'
import { handleType } from '../../Utils/types'
import { tratObjCliente } from '../../Utils/utils'
import { ICarga, IClienteMin } from '../../Utils/interfaces'

const Cargas:React.FC = () => {
  const [selected, setSelected] = useState<number[]>([])
  const [cargas, setCargas] = useState<ICarga[]>([])
  const [clientes, setClientes] = useState<IClienteMin[]>([])
  const [objSelected, setObjSelected] = useState<ICarga | Object>({})
  const [show, setShow] = useState<boolean>(false)
  const [type, setType] = useState<handleType | string>('')

  const selectedAsCarga = (objSelected as ICarga)

  useEffect(() => {
    api.get('carga')
      .then(cargas => {
        console.log(cargas.data)
        // cargas.data.map((carga: any) => tratObjCliente(carga))
        setCargas(cargas.data)

        api.get('cliente')
          .then(clientes => {
            setClientes(clientes.data.map((a:IClienteMin) => ({ nome: a.nome, id: a.id })))
          }).catch(err => {
            console.log('Erro ao buscar clientes: ', err)
          })
      }).catch(err => {
        console.log('Erro ao buscar clientes: ', err)
      })
  }, [])

  const handlePress = (type:handleType) => {
    switch (type) {
      case 'Incluir':
        if (clientes.length) {
          setObjSelected({ ...selectedAsCarga, clienteid: clientes[0].id, status: 2 })
        } else {
          setObjSelected({ status: 2 })
        }
        setType(type)
        setShow(true)
        break
      case 'Editar':
        if (selected && selected.length === 1) {
          const carga = cargas.find(a => a.id === selected[0])
          if (carga) {
            setObjSelected(carga)
            setType(type)
            setShow(true)
          } else {
            alert('Não foi possível encontrar o carga')
          }
        } else {
          alert('Selecione um para editar.')
        }
        break
      case 'Excluir':
        if (selected && selected.length === 1) {
          const carga = cargas.find(a => a.id === selected[0])
          if (carga) {
            setObjSelected(carga)
            setType(type)
            setShow(true)
          } else {
            alert('Não foi possível encontrar o cliente')
          }
        } else {
          alert('Selecione um para excluir.')
        }
        break
      default:
        break
    }
  }

  const handleSubmit = () => {
    switch (type) {
      case 'Incluir':
        (objSelected as ICarga).dataentrada = moment().format('DDMMYYYY')
        api.post('/carga', objSelected)
          .then(res => {
            setCargas([...cargas, tratObjCliente(res.data)])
            setShow(false)
            setObjSelected({})
            setSelected([])
          }).catch(err => {
            console.log(err)
            alert('Erro ao cadastrar cliente, tente novamente.')
          })
        break
      case 'Editar':
        api.patch('/carga/' + (objSelected as ICarga).id, objSelected)
          .then(carga => {
            setCargas([...cargas.filter(a => a.id !== (objSelected as ICarga).id), { ...objSelected, ...carga.data }])
            setShow(false)
            setObjSelected({})
            setSelected([])
          }).catch(err => {
            console.log(err)
            alert('Não foi possível excluir o cliente')
          })
        break
      case 'Excluir':
        api.delete('/carga/' + (objSelected as ICarga).id)
          .then(deleted => {
            setCargas([...cargas.filter(a => a.id !== (objSelected as ICarga).id)])
            setShow(false)
            setObjSelected({})
            setSelected([])
          }).catch(err => {
            console.log(err)
            alert('Não foi possível excluir o cliente')
          })
        break
      default:
        break
    }
  }

  const inputs = [
    {
      controlId: 'formClienteCarga',
      label: 'Cliente',
      value: selectedAsCarga.clienteid || '',
      type: 'select',
      options: clientes.map(a => ({ value: a.id, label: a.nome })),
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, clienteid: parseInt(e.target.value) })
    },
    {
      controlId: 'formStatusCarga',
      label: 'Status',
      value: selectedAsCarga.status || 0,
      type: 'select',
      options: [
        { label: 'Em processamento', value: 2 },
        { label: 'Cancelado', value: 0 },
        { label: 'Em transporte', value: 3 },
        { label: 'Entregue', value: 1 }
      ],
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, idCliente: parseInt(e.target.value) })
    },
    {
      controlId: 'formDataEntregaCarga',
      label: 'Data de entrega',
      type: 'date',
      value: selectedAsCarga.dataentrega || '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, dataentrega: e.target.value })
    },
    {
      controlId: 'formPesoCarga',
      label: 'Peso',
      value: selectedAsCarga.peso || '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, peso: e.target.value })
    },
    {
      controlId: 'formComprimentoCarga',
      label: 'Tamanho',
      value: selectedAsCarga.comprimento || '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, comprimento: e.target.value })
    },
    {
      controlId: 'formAlturaCarga',
      label: 'Altura',
      value: selectedAsCarga.altura || '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, altura: e.target.value })
    },
    {
      controlId: 'formLarguraCarga',
      label: 'Largura',
      value: selectedAsCarga.largura || '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, largura: e.target.value })
    },
    {
      controlId: 'formLogradouroCliente',
      label: 'Logradouro',
      value: selectedAsCarga.endereco ? selectedAsCarga.endereco.logradouro : '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), logradouro: e.target.value } })
    },
    {
      controlId: 'formCidadeCliente',
      label: 'Cidade',
      value: selectedAsCarga.endereco ? selectedAsCarga.endereco.cidade : '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), cidade: e.target.value } })
    },
    {
      controlId: 'formEstadoCliente',
      label: 'Estado',
      value: selectedAsCarga.endereco ? selectedAsCarga.endereco.estado : '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), estado: e.target.value } })
    },
    {
      controlId: 'formBairroCliente',
      label: 'Bairro',
      value: selectedAsCarga.endereco ? selectedAsCarga.endereco.bairro : '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), bairro: e.target.value } })
    },
    {
      controlId: 'formNumeroCliente',
      label: 'Número',
      type: 'number',
      value: selectedAsCarga.endereco ? selectedAsCarga.endereco.numero : '',
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, endereco: { ...(selectedAsCarga.endereco || {}), numero: e.target.value } })
    }
  ]

  const rows:any[] = []
  cargas.forEach(carga => {
    const newCarga:any = { ...carga }
    if (newCarga.cliente && newCarga.cliente.nome) {
      newCarga.cliente = newCarga.cliente.nome
    }
    if (newCarga.endereco) {
      const { cidade, estado, logradouro, numero } = newCarga.endereco
      newCarga.endereco = `${logradouro}, ${numero} - ${cidade} (${estado})`
    }
    rows.push(newCarga)
  })

  const headCells = [
    { id: 'cliente', label: 'Cliente' },
    { id: 'dataentrada', label: 'Data de entrada' },
    { id: 'dataentrega', label: 'Data de entrega' },
    { id: 'peso', label: 'Peso' },
    { id: 'largura', label: 'Largura' },
    { id: 'altura', label: 'Altura' },
    { id: 'comprimento', label: 'Comprimento' },
    { id: 'endereco', label: 'Endereço' }
  ]

  return (
    <div>
      <h1 className="title-section">Cargas</h1>
      <div className="headerButtons">
        <Button variant="dark" onClick={() => handlePress('Incluir')}>Incluir</Button>
        <Button variant="dark" onClick={() => handlePress('Editar')}>Editar</Button>
        <Button variant="dark" onClick={() => handlePress('Excluir')}>Excluir</Button>
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
          type === 'Excluir'
            ? <div>
                    Você tem certeza que deseja excluir a carga <b>{selectedAsCarga.dataentrada}</b>?
            </div>
            : <Form
              inputs={inputs}
            />
        }
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default Cargas
