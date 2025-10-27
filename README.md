# 🧠 ARSW-LAB6-Websocket

**Proyecto del Laboratorio 6 - ARSW (Arquitectura de Software)**
Implementación de comunicación en tiempo real con **Spring Boot**, **Jakarta WebSocket** y **React.js**, incluyendo un tablero colaborativo interactivo y un canal de mensajes periódicos desde el servidor.

---

## 🚀 Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 3.1.1**
- **Jakarta WebSocket API 2.1.0**
- **Spring WebSocket**
- **React.js (v18 y v16 para clientes de prueba)**
- **P5.js** para el dibujo en el pizarrón colaborativo

---

## 📦 Estructura del Proyecto

```

ARSW-LAB6-Websocket/
│
├── src/main/java/eci/edu/websocket
│   ├── Application.java                # Punto de entrada principal del servidor
│   ├── components/
│   │   └── TimedMessageBroker.java     # Envía mensajes cada 5s al canal /timer
│   ├── configuration/
│   │   └── WSConfigurator.java         # Configuración del endpoint WebSocket
│   ├── controller/
│   │   └── WebController.java          # Endpoint REST /status
│   ├── endpoints/
│   │   └── TimerEndpoint.java          # Canal WebSocket de tiempo real /timer
│   └── interactiveblackboard/
│       ├── BBAppStarter.java           # App Spring Boot del pizarrón interactivo
│       ├── configurator/               # Configuración de WebSockets del BB
│       ├── controller/
│       │   └── DrawingServiceController.java
│       └── endpoints/
│           └── BBEndpoint.java         # Canal /bbService para dibujo colaborativo
│
├── src/main/resources/static/
│   ├── index.html                      # Cliente WebSocket simple (timer)
│   ├── bb.html                         # Cliente React + P5.js (pizarrón)
│   ├── component/WSClient.jsx          # Cliente React del canal /timer
│   └── js/bbComponents.jsx             # Cliente React/P5 del canal /bbService
│
├── pom.xml                             # Configuración Maven
├── LICENSE                             # Licencia MIT
└── README.md                           # Este archivo

````

---

## ⚙️ Ejecución del Proyecto

### 🔧 Prerrequisitos

- **Java 17+**
- **Maven 3.8+**
- **Navegador moderno (Chrome, Edge, Firefox)**

---

### 🖥️ 1. Compilar y ejecutar

```bash
mvn clean package
mvn spring-boot:run
````

El servidor se iniciará por defecto en:

```
http://localhost:8080
```

---

### 💬 2. Probar el canal `/timer`

Abre el archivo:

```
src/main/resources/static/index.html
```

Esto abrirá una pequeña app React que muestra la hora actual enviada por el servidor cada 5 segundos a través del **WebSocket `/timer`**.

---

### 🎨 3. Probar el pizarrón colaborativo (`/bbService`)

Abre el archivo:

```
src/main/resources/static/bb.html
```

Podrás dibujar en tiempo real, y cualquier trazo será replicado a los demás usuarios conectados mediante el **WebSocket `/bbService`**.

---

## 📡 Endpoints Disponibles

| Tipo          | Endpoint     | Descripción                          |
| ------------- | ------------ | ------------------------------------ |
| **REST**      | `/status`    | Verifica que el servidor esté activo |
| **WebSocket** | `/timer`     | Envío periódico de hora del servidor |
| **WebSocket** | `/bbService` | Canal de dibujo colaborativo         |

---

## 🧩 Dependencias Principales

* `spring-boot-starter-web`
* `spring-boot-starter-websocket`
* `jakarta.websocket-api`
* `spring-context`
* `lombok`

---

## 🧠 Autores

**Alejandro Prieto**
[GitHub: AlejandroPrieto82](https://github.com/AlejandroPrieto82)

---

## 🪪 Licencia

Este proyecto está bajo la licencia **MIT** — ver el archivo [LICENSE](./LICENSE) para más detalles.

```
MIT License © 2025 Alejandro Prieto
```

---

## 🧩 Notas

* La clase `TimerEndpoint` y `BBEndpoint` gestionan las sesiones activas con `ConcurrentLinkedQueue`.
* `TimedMessageBroker` usa `@Scheduled` para emitir mensajes periódicos.
* `ServerEndpointExporter` es requerido para que los WebSockets funcionen con Spring Boot embebido.

---

## 🧭 Ejemplo Visual

* **/timer** → muestra un mensaje tipo `"The time is now 12:34:56"`
* **/bbService** → pizarrón compartido en el que todos los usuarios dibujan en simultáneo.

---

✨ *Desarrollado como parte del curso de Arquitectura de Software (ARSW)*
