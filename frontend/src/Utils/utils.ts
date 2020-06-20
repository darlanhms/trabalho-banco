
export const tratObjCliente = (cliente:any) => {
    if (!cliente.endereco) {
        const { logradouro, numero, bairro, cep, cidade } = cliente;
        cliente.endereco = { logradouro, numero, bairro, cep, cidade };
        return cliente;
    } else {
        return cliente
    }
}