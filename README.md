# Energía en familia — código para GitHub

Aplicación piloto para registrar acciones de ahorro de energía, responder cuestionarios y registrar consumos opcionales en el hogar. Este paquete prepara el código para guardarlo y mantener su historial en GitHub.

**Piloto alojado actualmente:** https://energia-familia-piloto-adrian.elborikua-p-r.chatgpt.site

El piloto sigue siendo privado y utiliza el acceso permitido por su alojamiento actual. El código conserva el modo de prueba con información ficticia. La aplicación todavía necesita la habilitación del acceso de las familias y la consolidación del investigador antes de recoger datos reales del estudio.

## Guardar el código en GitHub

La opción más sencilla para este paquete es **GitHub Desktop**, porque hay más de 100 archivos y así se conservan juntos los archivos de configuración.

1. Descomprime `Energia_en_familia_para_GitHub.zip`. El archivo `package.json` y las carpetas `app`, `build`, `db`, `lib` y `scripts` deben quedar juntos en la carpeta extraída.
2. Abre GitHub Desktop e inicia sesión en tu cuenta de GitHub. Selecciona **File → New repository**. Pon el nombre `energia-en-familia`, elige una carpeta donde guardar ese repositorio y pulsa **Create repository**.
3. Abre la carpeta del nuevo repositorio y copia dentro **todo el contenido descomprimido**, no el ZIP ni la carpeta que lo contiene. Incluye `.openai`, `.gitignore`, `vendor`, `components` y los demás archivos. No copies `node_modules`, `.env`, `.wrangler`, datos de participantes ni contraseñas.
4. En GitHub Desktop, revisa los archivos de **Changes**. En **Summary** escribe `Primera versión del piloto Energía en familia` y pulsa **Commit to main**.
5. Pulsa **Publish repository**. Conserva marcada **Keep this code private** y publica. **View on GitHub** abre el repositorio creado.
6. En la descripción del repositorio puedes incluir la dirección actual del piloto. Para probar la aplicación continúa usando esa dirección: guardar el código en GitHub no cambia el alojamiento ni publica otra web automáticamente.

Si utilizas la página de GitHub en vez de GitHub Desktop, **Add file → Upload files** admite un máximo de 100 archivos en una subida. Necesitarás varias tandas y mantener exactamente las carpetas. No subas únicamente el ZIP: GitHub lo guardaría como un archivo comprimido.

## Qué hace falta para publicar desde GitHub en otro alojamiento

**Esta versión no se puede publicar completa activando GitHub Pages.** Pages sirve archivos estáticos. Esta aplicación tiene un servidor Vinext/React, la ruta `/api/data`, una base de datos Cloudflare D1 y acceso mediante el alojamiento Sites. Si se publicaran solo los archivos visuales, no se conservarían automáticamente las funciones del servidor, el guardado y la identificación de la cuenta.

Una alternativa es adaptar la aplicación a un alojamiento propio en **Cloudflare Workers + D1** y conectar allí el repositorio de GitHub. Antes de considerarla lista para ese despliegue se necesita:

- Preparar y comprobar la configuración del Worker y su compilación.
- Crear una base D1 propia, vincularla como `DB` y aplicar las migraciones de `drizzle` en el entorno elegido. El identificador de base de datos usado para la vista previa local no es una base de producción.
- Implementar y verificar la autenticación y los permisos del nuevo alojamiento. La versión actual recibe la identidad desde Sites y utiliza `/signin-with-chatgpt`; estos servicios no se trasladan por copiar el código.
- Verificar el acceso familiar, la separación de registros, la consolidación del investigador, las exportaciones y el tratamiento de los datos del estudio antes de iniciar la recogida real.

Después de esa adaptación, Cloudflare permite conectar el repositorio y publicar los cambios enviados a la rama de producción. Esta entrega **no configura esa conexión, no crea servicios externos y no migra datos**.

## Contenido y procedencia

- Fuente: commit `7e33fc85b6cf1a9c67b77158d0d526e1a60087f7` del proyecto original.
- Incluye los 123 archivos rastreados de esa versión. Este README reemplaza la guía técnica inicial, que se conserva íntegra como `README_STARTER.md`; `.gitignore` añade exclusiones de exportaciones, bases locales y secretos de Cloudflare.
- Incluye los archivos `build/`, `vendor/`, componentes y configuración necesarios que faltaban en el paquete anterior.
- `.openai/hosting.json` conserva el identificador del proyecto original y la vinculación `DB`. Es configuración del proyecto; no contiene una contraseña de acceso ni una copia de la base de datos.
- No incluye `.git`, dependencias instaladas, compilaciones, registros de ejecución, archivos de entorno ni bases de datos de participantes. `.gitignore` excluye las carpetas de ejecución y los archivos `.env*`.

La aplicación requiere Node.js `>=22.13.0` para desarrollo. Las instrucciones técnicas originales se encuentran en `README_STARTER.md`. Guardar este código en GitHub no exige instalar Node.js.

## Documentación oficial

- Crear un repositorio: https://docs.github.com/en/get-started/start-your-journey/creating-a-repository-for-your-project-on-github
- Subir archivos y límites de la subida desde el navegador: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- GitHub Desktop: https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop
- Qué ofrece GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Conectar un repositorio a Cloudflare Workers: https://developers.cloudflare.com/workers/ci-cd/builds/
- Empezar con Cloudflare D1: https://developers.cloudflare.com/d1/get-started/
