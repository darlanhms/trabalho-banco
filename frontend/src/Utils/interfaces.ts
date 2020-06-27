export interface IEndereco {
    logradouro: string;
    cidade: string;
    numero: string;
    estado: string;
    bairro: string
}

export interface ICarga {
    id: number;
    clienteid: number;
    dataentrega: string;
    dataentrada: string;
    tamanho: string;
    peso: string;
    largura: string;
    altura: string;
    comprimento: string;
    status: 0 | 1 | 2 | 3;
    endereco: IEndereco;
}

export interface ICliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: IEndereco;
}

export interface IClienteMin {
    id: number;
    nome: string;
}
