# Queue 🕑

O Queue é uma plataforma que simplifica o gerenciamento de filas em barbearias, permitindo que os clientes entrem na fila, recebam notificações no WhatsApp e efetuem pagamentos, tudo de forma remota.

## Motivação 🚀

A ideia para o Queue surgiu de uma experiência pessoal. Em um dia em que precisei cortar o cabelo, cheguei ao salão e me deparei com 18 pessoas já esperando. Anotei meu nome em um caderninho que o salão usava para gerenciar os clientes, mas como a espera seria longa, decidi sair para fazer outras coisas.

No entanto, ir ao salão verificar constantemente quanto tempo faltava para a minha vez se tornou cansativo. Foi então que percebi a necessidade de uma solução mais eficiente. Assim, nasceu o Queue, uma maneira de simplificar a espera nas barbearias e garantir que os clientes possam aproveitar melhor o seu tempo.

## Funcionalidades Principais 📋

- **Fila de Atendimento**: Entre na fila de espera facilmente e acompanhe sua posição.
- **Notificações WhatsApp**: Receba notificações quando for a sua vez e mantenha-se informado.
- **Pagamento Online**: Pague antecipadamente e garanta sua vaga sem estar fisicamente no salão.
- **Agendamento**: Faça agendamentos convenientes para evitar longas esperas.

## Tecnologias Utilizadas 🛠️

### Backend

O backend do Queue foi desenvolvido com as seguintes tecnologias:

- **Node.js**: Plataforma de desenvolvimento JavaScript baseada em eventos.
- **Express**: Framework web para Node.js.
- **Zod**: Biblioteca para validação de esquemas em TypeScript.
- **Jsonwebtoken**: Para autenticação e geração de tokens JWT.
- **Prisma ORM**: Uma ferramenta de banco de dados com tipos seguros para Node.js e TypeScript.
- **bcryptjs**: Para criptografia de senhas.
- **TypeScript**: Linguagem de programação tipada.
- **EfíPay API**: Utilizada para integração de pagamento com um SDK.
- **Vitest**: Framework de testes para aplicações Node.js e TypeScript.

### Frontend

O frontend do Queue faz uso das seguintes tecnologias:

- **Vite**: Build tool que serve como base para o desenvolvimento web.
- **React**: Biblioteca de JavaScript para a construção da interface do usuário.
- **Zod**: Utilizada para validação de esquemas em TypeScript.
- **Tailwind CSS**: Framework de estilo CSS.
- **shadcn/ui**: Biblioteca de componentes UI.
- **React Query**: Para gerenciamento de estado.
- **Lucida React**: Biblioteca uso de ícones.
- **React Hook Form**: Para gerenciamento de formulários.
- **Axios**: Cliente HTTP para fazer requisições à API.
- **TypeScript**: Linguagem de programação tipada.
- **Next.js** (planejado): Framework React para desenvolvimento web.

### Integração com o WhatsApp

Foi criado um microserviço para a integração com o WhatsApp, utilizando as seguintes tecnologias:

- **TypeScript**: Linguagem de programação tipada.
- **Express**: Framework web para Node.js.
- **@whiskeysockets/baileys**: Cliente TypeScript/Node.js não oficial para a API WhatsApp.

## Como Rodar o Projeto com Docker e Docker Compose 🐳

Siga os seguintes passos para configurar e executar o projeto usando Docker e Docker Compose:

1. Clone o repositório:

    ```bash
    git clone https://github.com/Kaduh15/queue.git
    ```

2. Entre na pasta do projeto:

    ```bash
    cd queue
    ```

3. Crie uma cópia do arquivo `.env` para o backend:

    ```bash
    npm run copy:env:back
    ```

4. Agora, o projeto está pronto para ser executado sem a parte de pagamento. Você tem duas opções:

   - Para executar em ambiente de produção, utilize:

     ```bash
     npm run compose:up
     ```

   - Para executar em ambiente de desenvolvimento, utilize:

     ```bash
     npm run compose:up:dev
     ```

5. Acesse o projeto no seu navegador:

   Abra seu navegador e vá para `http://localhost:3000`

Caso deseje utilizar o pagamento online, siga as instruções detalhadas em [Pagemento via PIX](PGAMENTO-PIX.md).

## Licença 📜

Este projeto está sob a licença [MIT](LICENSE).
