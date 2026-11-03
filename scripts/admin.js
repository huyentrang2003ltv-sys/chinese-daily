#!/usr/bin/env node
'use strict';

// Account administration from the server shell (admin rights are never granted through the web).
//   npm run admin -- list
//   npm run admin -- grant <email>        make an account an administrator
//   npm run admin -- revoke <email>       back to a normal student account
//   npm run admin -- password <email>     set a new password (prompted, not echoed)
// Stop the web server first, or restart it afterwards: it keeps accounts in memory.
const readline = require('readline');
const accounts = require('../server/accounts');

const [command, email] = process.argv.slice(2);

function need(user) {
  if (!user) {
    console.error(`Không tìm thấy tài khoản: ${email}`);
    process.exit(1);
  }
  return user;
}

function promptHidden(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = text => {
      if (text.includes(question)) rl.output.write(text);
    };
    rl.question(question, answer => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function main() {
  switch (command) {
    case 'list':
      for (const u of accounts.users()) {
        const flags = [u.role, accounts.vipInfo(u).tier, u.passwordHash ? '' : 'CẦN ĐẶT MẬT KHẨU'].filter(Boolean);
        console.log(`${u.email.padEnd(36)} ${u.name.padEnd(24)} ${flags.join(' · ')}`);
      }
      return;
    case 'grant':
    case 'revoke': {
      const user = need(accounts.findByEmail(email));
      user.role = command === 'grant' ? 'admin' : 'student';
      accounts.flushUsers();
      console.log(`${user.email} giờ là ${user.role}.`);
      return;
    }
    case 'password': {
      const user = need(accounts.findByEmail(email));
      const password = await promptHidden('Mật khẩu mới (≥ 8 ký tự): ');
      if (password.length < 8) {
        console.error('Mật khẩu quá ngắn.');
        process.exit(1);
      }
      accounts.setPassword(user, password);
      accounts.flushUsers();
      console.log(`Đã đặt mật khẩu mới cho ${user.email} (các phiên đăng nhập cũ đã bị hủy).`);
      return;
    }
    default:
      console.log('Cách dùng: npm run admin -- <list|grant|revoke|password> [email]');
  }
}

main();
