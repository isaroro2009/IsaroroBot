# IsaBot 💕 — Local AI Discord Bot

¡Holi! ✨ Este es el repositorio de **IsaBot**, un bot inteligente para Discord cuyo "cerebro" corre de manera 100% local dentro de una **Raspberry Pi 5**. El sistema utiliza un modelo de lenguaje optimizado (**TinyLlama**) cargado localmente, un servidor backend en **Flask (Python)** y un script puente conectado al ecosistema de **Discord.py**.

---

## 🗺️ Arquitectura del Sistema

El proyecto está dividido en tres capas que trabajan en equipo de forma simultánea:

1. **El Servidor IA (Flask + TinyLlama):** Procesa el texto utilizando los recursos locales de la Raspberry Pi y genera las respuestas.
2. **El Servidor Puente (Discord Bot):** Escucha las menciones en tu servidor de Discord, limpia el texto, se lo envía a Flask y publica la respuesta final.
3. **Interfaz Web/Discord:** El entorno gráfico donde los usuarios interactúan directamente con la IA.

---

## 🛠️ Requisitos e Instalación

### 1. Clonar el repositorio y preparar carpetas
```bash
cd ~/Documents
# Asegúrate de estar en la carpeta donde tienes guardados tus scripts

2. Instalar las dependencias en la Raspberry Pi 5
Como los sistemas operativos modernos de la Raspberry protegen el entorno global, instalamos los paquetes necesarios usando el parámetro especial de compatibilidad:

pip3 install discord.py requests Flask --break-system-packages

Esto activará el servidor local en http://localhost:5000/api/chat.

Paso 2: Encender la Conexión a Discord (Puente)
En la segunda terminal, arranca el script del bot de Discord:

python3 discord_bot.py
Al hacer esto, verás el letrero en la consola confirmando que inició sesión y notarás que el círculo de IsaBot en Discord pasa a estar en verde (Conectado).

📂 Estructura de los Archivos Principales
server_robot.py: Contiene la API en Flask, la configuración de CORS y la lógica para comunicarse directamente con el modelo de lenguaje TinyLlama.

discord_bot.py: Gestiona los Intents de Discord, detecta cuando los usuarios mencionan a @IsaBot en los canales de texto, maneja el estado visual ("Escribiendo...") y realiza las peticiones HTTP POST al backend.

README.md: Guía de instalación y documentación general del proyecto (¡este archivo!).

🎨 Configuración en el Discord Developer Portal
Para que el script se conecte correctamente, se deben asegurar los siguientes puntos en la plataforma de Discord:

Privileged Gateway Intents: En la sección Bot del portal de desarrolladores, activar los interruptores de Presence Intent, Server Members Intent, y Message Content Intent.

Token Secreto: El token generado se debe colocar de forma privada dentro de la variable TOKEN_DISCORD al final del archivo discord_bot.py.

OAuth2 URL Generator: Generar el enlace seleccionando el scope bot y otorgando los permisos de Send Messages y Read Message History.

🌸 Créditos y Desarrollo
Creado con mucho amor, código y café por Isabella Rodriguez. 🚀✨

---


