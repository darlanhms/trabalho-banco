
export const tratObjCliente = (cliente:any) => {
  if (!cliente.endereco) {
    const { logradouro, estado, numero, bairro, cep, cidade } = cliente
    cliente.endereco = { logradouro, estado, numero, bairro, cep, cidade }
    return cliente
  } else {
    return cliente
  }
}
