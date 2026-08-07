# Publicar maloba en Railway y conectar GoDaddy

Esta aplicación necesita un servicio Node persistente y un volumen. No debe desplegarse como un sitio estático porque la base SQLite y las portadas necesitan almacenamiento permanente.

## 1. Cambiar las credenciales antes de subir

Actualiza la contraseña local:

```bash
npm run password -- "TU-CONTRASEÑA-NUEVA"
```

El comando reemplaza automáticamente `ADMIN_PASSWORD_HASH` dentro de `.env`. Reinicia el servidor para aplicar el cambio. Después copia ese nuevo valor desde `.env` a la variable `ADMIN_PASSWORD_HASH` de Railway.

Genera también una clave de sesión de al menos 32 caracteres, por ejemplo:

```bash
openssl rand -hex 32
```

No compartas estos valores ni subas `.env` a GitHub.

## 2. Crear un repositorio privado

1. Crea un repositorio **privado** en GitHub.
2. Desde esta carpeta, confirma que `.env`, `data/` y `uploads/` están ignorados.
3. Sube el código a la rama principal.

Ejemplo si el proyecto todavía no tiene remoto:

```bash
git add .
git commit -m "Prepare maloba for Railway"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

## 3. Crear el servicio en Railway

1. Entra a Railway y selecciona **New Project**.
2. Elige **Deploy from GitHub repo**.
3. Autoriza GitHub y selecciona el repositorio privado.
4. Railway detectará `railway.json` y utilizará:
   - Build: `npm run build`
   - Start: `npm start`
   - Health check: `/api/health`
5. No generes todavía el dominio final.

## 4. Crear el volumen persistente

1. En el canvas del proyecto, crea un **Volume**.
2. Conéctalo al servicio web de maloba.
3. Configura el punto de montaje exactamente como:

```text
/app/storage
```

Dentro del volumen, la aplicación creará automáticamente:

```text
/app/storage/data/maloba.db
/app/storage/uploads/
```

Mantén una sola réplica del servicio. SQLite y un volumen local no deben compartirse entre múltiples réplicas.

La ruta del volumen y `STORAGE_ROOT` deben coincidir exactamente. En los logs de inicio debe aparecer:

```text
Base persistente: /app/storage/data/maloba.db
```

Si aparece otra ruta, detén el deployment y corrige la variable o el punto de montaje antes de publicar contenido.

## 5. Configurar variables

En el servicio, abre **Variables** y añade:

```env
NODE_ENV=production
COOKIE_SECURE=true
STORAGE_ROOT=/app/storage
ADMIN_USERNAME=TU_USUARIO
ADMIN_PASSWORD_HASH=EL_HASH_GENERADO
SESSION_SECRET=LA_CLAVE_ALEATORIA_GENERADA
```

No añadas `PORT`: Railway lo proporciona automáticamente.

Después de guardar las variables, ejecuta un nuevo deployment.

## 6. Probar antes de conectar el dominio

1. En **Settings → Networking**, genera un dominio temporal de Railway.
2. Abre el portafolio y comprueba proyectos, imágenes y navegación.
3. Abre directamente `/admin-maloba`.
4. Inicia sesión, crea un proyecto de prueba, sube una portada y al menos cinco imágenes de galería.
5. Reinicia el servicio desde Railway.
6. Confirma que el proyecto y la portada continúan disponibles. Esto verifica el volumen.
7. Elimina el proyecto de prueba desde el gestor.

## 7. Conectar `maloba.mx`

1. En Railway abre **Settings → Networking → Custom Domain**.
2. Añade primero `www.maloba.mx`.
3. Railway mostrará los registros DNS requeridos, normalmente `CNAME` y `TXT`. Copia los valores exactamente.
4. En GoDaddy abre **Mis productos → maloba.mx → DNS → Administrar DNS**.
5. Crea o reemplaza el registro `CNAME` de `www` con el destino que indique Railway.
6. Añade el registro `TXT` de validación que indique Railway.
7. No elimines registros `MX` si utilizas correo con `@maloba.mx`.
8. Regresa a Railway y selecciona **Verify**.

Para el dominio raíz `maloba.mx`, intenta añadirlo también como Custom Domain y sigue los registros exactos de Railway. Si GoDaddy no permite el `CNAME` solicitado para `@`, utiliza una de estas opciones:

- Configura en GoDaddy un redireccionamiento permanente de `maloba.mx` a `https://www.maloba.mx`.
- Mueve únicamente la gestión DNS a Cloudflare y conserva el registro del dominio en GoDaddy.

Railway emitirá y renovará automáticamente el certificado HTTPS. La propagación DNS puede tardar desde algunos minutos hasta 48 horas.

## 8. Seguridad después de publicar

- Cambia inmediatamente las credenciales iniciales locales.
- Mantén `.env` fuera de Git.
- No compartas `/admin-maloba`; la seguridad real sigue siendo usuario, contraseña y sesión.
- Mantén `COOKIE_SECURE=true` en producción.
- Activa autenticación de dos factores en Railway, GitHub y GoDaddy.
- Conserva una sola réplica mientras uses SQLite.
- Revisa periódicamente dependencias y registros de acceso.

## 9. Respaldos

Activa los backups del volumen en Railway. Los elementos críticos son:

```text
data/maloba.db
uploads/
```

Antes de una migración importante, descarga una copia del volumen. Un volumen persistente evita que los datos desaparezcan en un deployment, pero no sustituye una política de respaldos.

## 10. Actualizaciones futuras

Cuando el repositorio esté conectado, cada `git push` a la rama configurada generará un nuevo deployment. Railway conservará el volumen y solo reemplazará el código compilado.

Antes de subir cambios ejecuta:

```bash
npm run format:check
npm run lint
npm run build
```
