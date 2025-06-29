# 💼 API - Sistema de Controle de Clientes

Esta API foi desenvolvida para gerenciar empresas, contatos, acessos via Anydesk, servidores, helpdesk, certificados digitais, sistemas utilizados e usuários administradores. Ideal para uso interno em empresas de tecnologia ou suporte técnico.

## 🔧 Tecnologias Utilizadas

- Node.js
- Express.js
- Prisma ORM
- Oracle Database (via Docker)
- JWT para autenticação
- Bcrypt para criptografia de senhas
- Dotenv para variáveis de ambiente

## 🐘 Banco de Dados (Oracle com Docker)

Para facilitar o desenvolvimento, você pode subir uma instância Oracle 21c com Docker, use o compose:

```bash
docker-compose -up D
```

## 📦 Instalação do Projeto

### Node

```bash
git clone https://github.com/seu-usuario/nome-do-projeto.git
cd nome-do-projeto
npm install
```

## .env

Crie o arquivo .env, como este :

```text
PORT=3000
HOST=localhost
DATABASE_URL="oracle://oracle:oracle@localhost:1521/oracle"
JWT_SECRET="sua_chave_secreta_super_segura"
```

Usuário será **oracle** a senha é **oracle** e a db será **oracle**.

## 🔄 Prisma ORM

```bash
# Gerando o client
npx prisma generate
# Obs: Oracle não suporta prisma migrate, use db push (Cuidado quando usar em PROD):
npx prisma db push
# Testando a conexão
npx prisma studio
```

### 🧪 Seed (Usuário Admin)

Para criar um usuário administrador padrão :</br>
**Usuário : admin@admin.com**</br>
**Senha : senha123** </br>

```bash
node prisma/seed.js
```

## Execultando o projeto

```bash
npm run dev
```

## Todas a rotas estão protegidas

No Header, use a Authorization

```text
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📁 Endpoints e Exemplos Postman

Veja exemplos práticos no meu [postman]('https://elements.getpostman.com/redirect?entityId=17594781-7c9d4b48-77d6-4a73-8cc1-c18953a3ac78&entityType=collection')

## 🙋‍♂️ Autor, Maxsuel Oliveira 

<div align=center id="footer-default">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/maxsuelOliveiradev/?utm_source=rocketseat&utm_medium=organic&utm_campaign=profile&utm_term=share&utm_content=md-04583-links)
[![Instagram](https://img.shields.io/badge/Instagram-C13584?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/david_o.santos/)
[![GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MaxsuelOliveira)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/channels/@MaxDavid#7163)
[![Rocketseat](https://img.shields.io/badge/Rocketseat-7159C1?style=for-the-badge&logo=rocketseat&logoColor=white)](https://app.rocketseat.com.br/me/md-04583)
[![Telegram](https://img.shields.io/badge/Telegram-40A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/@oliveiraMaxsuel)
</div>

<!-- teste -->