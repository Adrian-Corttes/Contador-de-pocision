# **Extensión de Asistencia para Índices y Reemplazo Numérico**

Esta es una extensión para Visual Studio Code diseñada para mejorar la productividad en archivos con formatos específicos, ofreciendo dos funcionalidades principales: un indicador de posición relativa y un modo de reemplazo rápido de números por letras.

## **Características Principales**

La extensión cuenta con las siguientes características:

### **1\. Indicador de Posición Relativa**

Esta función se activa automáticamente en líneas que siguen un formato de prefijo numérico.

* **Detección de Prefijo**: La extensión identifica las líneas que comienzan con un patrón como 123;45;6;.  
* **Visualización en la Barra de Estado**: Cuando el cursor se encuentra después del prefijo, aparece un indicador en la barra de estado que muestra la posición del carácter relativa al final del prefijo. Ejemplo: $(symbol-key) Posición: 15\.  
* **Información al Pasar el Mouse (Hover)**: Al pasar el cursor sobre el texto después del prefijo, un pequeño cuadro de diálogo muestra también el índice relativo.

### **2\. Modo de Reemplazo de Números por Letras**

Esta es una funcionalidad que se puede activar y desactivar para agilizar la escritura de secuencias de caracteres.

* **Botón de Activación**: En la barra de estado, a la derecha, encontrarás un botón con el texto $(keyboard) NUM → ABC: OFF.  
* **Activación/Desactivación**: Al hacer clic en este botón, el modo se activa (ON) o desactiva (OFF).  
  * **Estado Activo**: El botón se muestra en color naranja y con el texto ON.  
  * **Estado Inactivo**: El botón tiene el color por defecto de la barra de estado y muestra el texto OFF.  
* **Mapeo de Teclas**: Cuando el modo está activo, al presionar una tecla numérica, esta se reemplazará automáticamente por su letra correspondiente según el siguiente mapeo:  
  * 1 → A  
  * 2 → B  
  * 3 → C  
  * 4 → D  
  * 5 → E  
  * 6 → F  
  * 7 → G  
  * 8 → H  
  * 0 → X

## **Configuración y Ejecución en Entorno de Desarrollo**

Para probar o modificar esta extensión, puedes ejecutarla fácilmente en un entorno de desarrollo de VS Code.

### **Prerrequisitos**

Antes de empezar, asegúrate de tener instalado lo siguiente:

1. **Visual Studio Code**: El editor donde desarrollarás y probarás la extensión.  
2. **Node.js**: Necesario para gestionar las dependencias del proyecto. Puedes descargarlo desde el [sitio oficial de Node.js](https://nodejs.org/).

### **Pasos para Ejecutar**

1. **Abrir la Carpeta del Proyecto**: Arrastra la carpeta que contiene los archivos de la extensión (como extension.js) y suéltala dentro de una ventana de Visual Studio Code para abrir el proyecto.  
2. **Instalar Dependencias**: Una vez abierto el proyecto, abre la terminal integrada en VS Code (puedes usar el atajo Ctrl+Ñ o Cmd+J) y ejecuta el siguiente comando. Este paso utiliza npm (que se instala junto con Node.js) para descargar las librerías necesarias.  
   npm install

3. **Iniciar el Modo de Depuración**: Presiona la tecla F5. Esto compilará y ejecutará la extensión en una nueva ventana de VS Code llamada **"Host de Desarrollo de Extensiones"**.  
4. **Probar la Extensión**: En esta nueva ventana, la extensión estará activa.  
   * Crea un nuevo archivo de texto.  
   * Para probar el **indicador de posición**, escribe una línea como 1;2;3;Este es mi texto de prueba. y mueve el cursor sobre el texto.  
   * Para probar el **modo de reemplazo**, busca el botón NUM → ABC: OFF en la barra de estado, haz clic para activarlo y comienza a escribir números del 0 al 8\. Verás cómo se transforman en letras al instante.

¡Y eso es todo\! Ya puedes usar y probar la extensión en un entorno controlado.

## 🤝 Contribuciones
¡Bienvenidas! Siéntete libre de abrir un **issue** o enviar un **pull request**.

---

## 📄 Licencia
MIT