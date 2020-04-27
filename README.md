# cashcontrol
** Eu usei o yarn, se não tiver, precisa instalar ele;

1 - Pasta Config/database.js:
  * Alterar a senha para a senha que você definiu para o usuário "root" na instalação do mysql;

2 - Passo para criar a base de dados no mysql:
2.1 - executar no terminal o comando: yarn sequelize db:create

3 - Passo para criar as tabelas no mysql:
3.1 - executar no terminal o comando: yarn sequelize db:migrate
