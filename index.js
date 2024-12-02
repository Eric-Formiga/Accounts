import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: ['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
      },
    ])
    .then((answer) => {
      const action = answer['action'];

      if(action === 'Criar conta'){
        createAccount()
      }
    })
    .catch((error) => {
      console.log(chalk.red('Ocorreu um erro: '), error);
    });
}

function createAccount( ){
  console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco'))
  console.log(chalk.green('Defina as opções da sua conta a seguir'))
  buildAccount();
}

function buildAccount(){
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Digite o nome para sua conta:'
      },
    ]).then((answer) => {
      const accountName = answer['accountName'];

      console.info(accountName)

      if(!fs.existsSync('accounts')){
      fs.mkdirSync('accounts')
      }

      if(fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome'))
        buildAccount()
        return
      }

      fs.writeFileSync(`accounts/${accountName}.json`, '{balance: 0}', function(err){
        console.log(err)
      })

      console.log(chalk.green('Parabéns, a sua conta foi criada!'))
      operation();

    })
    .catch((error) => {
      console.log(chalk.red('Ocorreu um erro: '), error);
    });
}