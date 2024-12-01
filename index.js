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
}