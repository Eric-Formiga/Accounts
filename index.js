import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';

(async function operation() {
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: ['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
      },
    ]);

    switch (action) {
      case 'Criar conta':
        await createAccount();
        break;
      case 'Consultar Saldo':
        await getAccountBalance();
        break;
      case 'Depositar':
        await deposit();
        break;
      case 'Sacar':
        await withdraw();
        break;
      case 'Sair':
        console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
        process.exit();
        break;
      default:
        console.log(chalk.red('Ação inválida!'));
    }

    await operation();
  } catch (error) {
    console.error(chalk.red('Ocorreu um erro: '), error);
  }
})();

async function createAccount() {
  console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
  console.log(chalk.green('Defina as opções da sua conta a seguir.'));
  await buildAccount();
}

async function buildAccount() {
  try {
    const { accountName } = await inquirer.prompt([
      {
        name: 'accountName',
        message: 'Digite o nome para sua conta:',
      },
    ]);

    if (!fs.existsSync('accounts')) {
      fs.mkdirSync('accounts');
    }

    if (fs.existsSync(`accounts/${accountName}.json`)) {
      console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome.'));
      return buildAccount();
    }

    const initialData = { balance: 0 };
    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(initialData));

    console.log(chalk.green('Parabéns, a sua conta foi criada!'));
  } catch (error) {
    console.error(chalk.red('Ocorreu um erro: '), error);
  }
}

async function deposit() {
  try {
    const { accountName } = await inquirer.prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ]);

    if (!checkAccount(accountName)) {
      return deposit();
    }

    const { amount } = await inquirer.prompt([
      {
        name: 'amount',
        message: 'Quanto você deseja depositar?',
        validate: (value) => !isNaN(value) && value > 0 ? true : 'Insira um valor válido.',
      },
    ]);

    addAmount(accountName, parseFloat(amount));
  } catch (error) {
    console.error(chalk.red('Ocorreu um erro: '), error);
  }
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'));
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);
  accountData.balance += amount;

  fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData));
  console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`));
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, 'utf8');
  return JSON.parse(accountJSON);
}

async function getAccountBalance() {
  try {
    const { accountName } = await inquirer.prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ]);

    if (!checkAccount(accountName)) {
      return getAccountBalance();
    }

    const accountData = getAccount(accountName);
    console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${accountData.balance}`));
  } catch (error) {
    console.error(chalk.red('Ocorreu um erro: '), error);
  }
}

async function withdraw() {
  try {
    const { accountName } = await inquirer.prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ]);

    if (!checkAccount(accountName)) {
      return withdraw();
    }

    const { amount } = await inquirer.prompt([
      {
        name: 'amount',
        message: 'Quanto você deseja sacar?',
        validate: (value) => !isNaN(value) && value > 0 ? true : 'Insira um valor válido.',
      },
    ]);

    removeAmount(accountName, parseFloat(amount));
  } catch (error) {
    console.error(chalk.red('Ocorreu um erro: '), error);
  }
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (amount > accountData.balance) {
    console.log(chalk.bgRed.black('Saldo insuficiente!'));
    return;
  }

  accountData.balance -= amount;

  fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData));
  console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`));
}
