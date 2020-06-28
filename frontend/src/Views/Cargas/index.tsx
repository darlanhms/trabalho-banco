import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import moment from 'moment'
import { parseISO } from 'date-fns'
import api from '../../services/api'
import Modal from '../../Components/Modal'
import Form from '../../Components/Form'
import Table from '../../Components/Table'
import { handleType } from '../../Utils/types'
import { ICarga, IClienteMin } from '../../Utils/interfaces'

const Cargas:React.FC = () => {
  const [selected, setSelected] = useState<number[]>([])
  const [cargas, setCargas] = useState<ICarga[]>([])
  const [clientes, setClientes] = useState<IClienteMin[]>([])
  const [objSelected, setObjSelected] = useState<ICarga | Object>({})
  const [show, setShow] = useState<boolean>(false)
  const [type, setType] = useState<handleType | string>('')

  type statusCarga = 0 | 1 | 2 | 3;
  const selectedAsCarga = (objSelected as ICarga)

  useEffect(() => {
    api.get('carga')
      .then(cargas => {
        if (cargas.data) {
          setCargas(cargas.data)
        }

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
          setObjSelected({ clienteid: clientes[0].id, status: 2, dataentrada: Date.now() })
        } else {
          setObjSelected({ status: 2 })
        }
        setType(type)
        setShow(true)
        break
      case 'Editar':
        if (selected && selected.length === 1) {
          const carga: any = { ...cargas.find(a => a.id === selected[0]) }
          carga.dataentrega = parseISO(moment(parseInt(carga.dataentrega)).format())
          carga.dataentrada = parseISO(moment(parseInt(carga.dataentrada)).format())

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

  const validarCarga = ():boolean => {
    if (selectedAsCarga.endereco) {
      var { clienteid } = selectedAsCarga
      var { estado } = selectedAsCarga.endereco
      if (!estado || estado.length !== 2) {
        alert('Estado inválido - exemplo (SC, RS, PA)')
        return false
      }
      if (!clienteid) {
        alert('Selecione um cliente para a carga')
        return false
      }
    } else {
      alert('Informe um endereco válido')
      return false
    }
    return true
  }

  const handleSubmit = () => {
    const carga = { ...selectedAsCarga }

    switch (type) {
      case 'Incluir':
        if (validarCarga()) {
          carga.dataentrega = moment(carga.dataentrega).format('x')
          carga.dataentrada = moment().format('x')
          api.post('/carga', carga)
            .then(res => {
              setCargas([...cargas, res.data])
              setShow(false)
              setObjSelected({})
              setSelected([])
            }).catch(err => {
              console.log(err)
              alert('Erro ao cadastrar cliente, tente novamente.')
            })
        }
        break
      case 'Editar':
        if (validarCarga()) {
          carga.dataentrega = moment(carga.dataentrega).format('x')
          carga.dataentrada = moment(carga.dataentrada).format('x')
          api.patch('/carga/' + carga.id, carga)
            .then(carga => {
              setCargas([...cargas.filter(a => a.id !== (objSelected as ICarga).id), { ...objSelected, ...carga.data }])
              setShow(false)
              setObjSelected({})
              setSelected([])
            }).catch(err => {
              console.log(err)
              alert('Não foi possível alterar a carga')
            })
        }
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
            alert('Não foi possível excluir a carga')
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
      value: selectedAsCarga.status,
      type: 'select',
      options: [
        { label: 'Em processamento', value: 2 },
        { label: 'Cancelado', value: 0 },
        { label: 'Em transporte', value: 3 },
        { label: 'Entregue', value: 1 }
      ],
      onChange: (e: React.ChangeEvent<any>) => setObjSelected({ ...selectedAsCarga, status: (parseInt(e.target.value) as statusCarga) })
    },
    {
      controlId: 'formDataEntregaCarga',
      label: 'Data de entrega',
      placeholder: 'DD/MM/YYYY',
      type: 'date',
      value: selectedAsCarga.dataentrega || '',
      onChangeDate: (date: any) => setObjSelected({ ...selectedAsCarga, dataentrega: date })
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
    if (newCarga.status || newCarga.status === 0) {
      switch (newCarga.status) {
        case 0:
          newCarga.status = 'Cancelado'
          break
        case 1:
          newCarga.status = 'Entregue'
          break
        case 2:
          newCarga.status = 'Em processamento'
          break
        case 3:
          newCarga.status = 'Em transporte'
          break
        default:
          newCarga.status = 'Outros'
          break
      }
    }
    if (newCarga.dataentrada) {
      newCarga.dataentrada = moment(parseInt(newCarga.dataentrada)).format('DD/MM/YYYY')
    }
    if (newCarga.dataentrega) {
      newCarga.dataentrega = moment(parseInt(newCarga.dataentrega)).format('DD/MM/YYYY')
    }
    if (newCarga.endereco) {
      const { cidade, estado, logradouro, numero } = newCarga.endereco
      newCarga.endereco = `${logradouro}, ${numero} - ${cidade} (${estado})`
    }
    rows.push(newCarga)
  })

  const headCells = [
    { id: 'cliente', label: 'Cliente' },
    { id: 'status', label: 'Status' },
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
                    Você tem certeza que deseja excluir esta carga do dia <b>{moment(parseInt(selectedAsCarga.dataentrada as string)).format('DD/MM/YYYY')}</b>?
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
