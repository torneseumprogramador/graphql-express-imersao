const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInputObjectType, GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');

const clientes = [
    {
      id: 1,
      nome: "João Silva",
      telefone: "(11) 98765-4321",
      cpf: "123.456.789-01",
      endereco: "Rua das Flores, 123, Jardim Primavera, São Paulo, SP"
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      telefone: "(21) 91234-5678",
      cpf: "234.567.890-12",
      endereco: "Avenida dos Pássaros, 456, Centro, Rio de Janeiro, RJ"
    },
    {
      id: 3,
      nome: "Carlos Pereira",
      telefone: "(31) 99876-5432",
      cpf: "345.678.901-23",
      endereco: "Travessa da Paz, 789, Savassi, Belo Horizonte, MG"
    },
    {
      id: 4,
      nome: "Ana Castro",
      telefone: "(41) 91234-5678",
      cpf: "456.789.012-34",
      endereco: "Rua das Orquídeas, 321, Batel, Curitiba, PR"
    },
    {
      id: 5,
      nome: "Roberto Almeida",
      telefone: "(51) 98765-4321",
      cpf: "567.890.123-45",
      endereco: "Praça da Harmonia, 654, Moinhos de Vento, Porto Alegre, RS"
    }
];

const ClienteType = new GraphQLObjectType({
    name: 'Cliente',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        nome: { type: new GraphQLNonNull(GraphQLString) },
        telefone: { type: GraphQLString },
        cpf: { type: GraphQLString },
        endereco: { type: GraphQLString }
    }
})
  
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    clientes: {
      type: new GraphQLList(ClienteType),
      resolve: () => {
        return clientes;
      }
    },
    clientesPorId: {
        type: ClienteType,
        args: {
            id: { type: new GraphQLNonNull( GraphQLID ) }  // Definindo o argumento ID
        },
        resolve: (_, { id }) => {
            return clientes.find(cliente => cliente.id === parseInt(id));  // Usando o método find para buscar o cliente pelo ID
        }
    }
  }
});

const ClienteInputType = new GraphQLInputObjectType({
    name: 'ClienteInput',
    fields: {
        nome: { type: new GraphQLNonNull(GraphQLString) },
        telefone: { type: GraphQLString },
        cpf: { type: GraphQLString },
        endereco: { type: GraphQLString }
    }
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCliente: {
            type: ClienteType,
            args: {
                clienteInput: { type: new GraphQLNonNull(ClienteInputType) } 
            },
            resolve: (_, { clienteInput }) => {
                const newCliente = {
                    id: clientes.length + 1, // Atribuir o próximo ID disponível
                    nome: clienteInput.nome,
                    telefone: clienteInput.telefone,
                    cpf: clienteInput.cpf,
                    endereco: clienteInput.endereco
                };
                clientes.push(newCliente);
                return newCliente;
            }
        },
        excluirCliente: {
            type: ClienteType,
            args: {
                id: { type: GraphQLID } 
            },
            resolve: (_, { id }) => {
                const clienteIndex = clientes.findIndex(cliente => cliente.id === parseInt(id));

                if (clienteIndex === -1) {
                    throw new Error('Cliente não encontrado');
                }
        
                const [clienteRemovido] = clientes.splice(clienteIndex, 1);
        
                return clienteRemovido;
            }
        }
    }
});

// Criando o esquema usando os tipos definidos
const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});

const app = express();

// Aqui você definirá seu esquema e resolvers de GraphQL

app.use('/', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
