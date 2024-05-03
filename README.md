# upload.video

Stack: Node.js, Fastify, Prisma, Cloudflare R2

## Features (rotas)

- [x] Criação de usuário
- [x] Login de usuário
- [ ] Update perfil do usuário
- [x] Upload de arquivos no Cloudflare
- [x] Download de arquivos do cloudflare
- [x] Listar todos os arquivos do usuário
- [x] Excluir os arquivos do usuário automaticamente

## Requisitos

### Requisitos Funcionais (RFs):
- [x] O usuário pode realizar novos uploads;
- [x] O usuário pode visualizar os últimos uploads realizados;

### Regras de Negócio (RNs):
- [x] Deve ser possível expirados automaticamente após 14 dias;
- [x] Deve ser possível visualizar uploads não expirados;
- [x] Deve ser possível realizar upload de arquivos com o padrão (mp4) correto;
- [ ] Deve ser possível realizar upload de arquivos até 1gb cada;

### Requisitos Não Funcionais (RNFs):
- [x] Os links para compartilhamento devem ser assinados evitando acesso público;

## Importante

### Mime Types

```ts
const bannerMimeTypes = [
  '.exe', // (executáveis)
	'.dll', // (bibliotecas dinâmicas)
	'.bat', // (arquivos de lote)
	'.cmd', // (arquivos de comando)
	'.sh' , // (scripts shell)
	'.cgi', // (scripts CGI)
	'.jar', // (arquivos Java)
];
```