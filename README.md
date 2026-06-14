# IsaBot 💕 — Asistente de IA Local en Discord

¡Bienvenido/a al repositorio oficial de **IsaBot 💕**! Este proyecto consiste en un agente de Inteligencia Artificial tierno, servicial y optimizado para interactuar de forma 100% local en servidores de Discord. El sistema ha sido diseñado, desarrollado y desplegado de manera independiente sobre hardware enfocado en computación eficiente (Raspberry Pi 5).

La arquitectura del sistema sigue las mejores prácticas recomendadas, separando de manera estricta la interfaz del cliente (Discord bot) del motor de inferencia de lenguaje (Servidor local de Ollama).

---

## 🏗️ Arquitectura Técnica del Sistema

El proyecto está estructurado bajo un modelo de desacoplamiento de servicios para garantizar la seguridad, el rendimiento y el control de alucinaciones solicitados:

* **Cliente de Interfaz:** Desarrollado en `Python 3` utilizando la librería asíncrona `discord.py` para escuchar e interceptar eventos en tiempo real.
* **Servidor de Inferencia (Backend):** Servidor local de **Ollama** encargado de gestionar y ejecutar los pesos del modelo de lenguaje de manera local en los circuitos de la placa, sin llamadas a APIs externas o de pago.
* **Modelo Utilizado:** `qwen2.5:0.5b` (pesa 397 MB). Seleccionado estratégicamente tras pruebas de rendimiento para garantizar respuestas ultra-rápidas (promedio de 10 segundos) y evitar el colapso de memoria RAM o sobrecalentamiento en hardware embebido.

### ⚙️ Parámetros de Control y Seguridad de Inferencia
Para evitar respuestas erráticas o alucinaciones matemáticas complejas solicitadas en los requerimientos del profesor Michael, el payload de la API inyecta de forma mandatoria:
* `temperature: 0.2` (Baja aleatoriedad para respuestas precisas y lógicas).
* `top_p: 0.80` (Restricción del núcleo de vocabulario para mitigar el relleno innecesario).

---

## 🔒 Buenas Prácticas de Desarrollo Implementadas

1.  **Entorno Virtual Aislado (`venv`):** Todas las dependencias (`discord.py`, `requests`) se instalaron en un entorno de ejecución limpio y controlado, protegiendo los paquetes globales del sistema operativo Linux.
2.  **Manejo de Restricciones del Sistema Promt:** El bot incluye reglas críticas en español que le prohíben alucinar o interactuar en idiomas extranjeros, obligándolo a dar respuestas dulces, kawaiis y cortas.
3.  **Filtrado Estricto de Palabras por Código:** Para solucionar la limitación matemática de los modelos de lenguaje pequeños frente al conteo exacto de palabras, el script intercepta la respuesta a través de código nativo de Python para recortar y limpiar el string en solicitudes específicas (ej. *"dime en 2 palabras"*).

---

## 🚀 Guía de Instalación y Despliegue Local

Sigue estos pasos en la terminal de la Raspberry Pi 5 para clonar y ejecutar el entorno:

### 1. Activar el Entorno Virtual
Ingresa al directorio del proyecto y despierta el entorno `(venv)` aislado:
```bash
cd ~/Documents/isabot-project
source venv/bin/activate
