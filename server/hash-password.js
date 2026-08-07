import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const password = process.argv[2];
if (!password) {
  console.error('Uso: npm run password -- "tu-contraseña-segura"');
  process.exit(1);
}

if (password.length < 12) {
  console.error('La contraseña debe tener al menos 12 caracteres.');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = process.env.ENV_FILE ? path.resolve(process.env.ENV_FILE) : path.join(root, '.env');

if (!fs.existsSync(envPath)) {
  console.error(`No se encontró el archivo de variables: ${envPath}`);
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const env = fs.readFileSync(envPath, 'utf8');
const nextEnv = /^ADMIN_PASSWORD_HASH=.*$/m.test(env)
  ? env.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${hash}`)
  : `${env.trimEnd()}\nADMIN_PASSWORD_HASH=${hash}\n`;

fs.writeFileSync(envPath, nextEnv, { mode: 0o600 });
console.log('Contraseña actualizada correctamente en .env.');
console.log('Reinicia el servidor para aplicar el cambio.');
