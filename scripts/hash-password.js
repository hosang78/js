const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('사용법: npm run hash-password -- "원하는비밀번호"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log('');
console.log('아래 값을 .env 파일의 ADMIN_PASSWORD_HASH 에 넣으세요:');
console.log('');
console.log(hash);
console.log('');
