# Índice Flotante - VS Code Extension

Extensión para Visual Studio Code que muestra la posición relativa del cursor en líneas con prefijos numéricos (ej. `123;45;6;`).  
El índice se visualiza en la **barra de estado** y también en un **hover** al pasar el mouse.

---

## ✨ Características
- Detecta automáticamente prefijos numéricos con formato `n;n;n;`.
- Muestra la posición relativa del cursor (1-based).
- Visualización en la barra de estado.
- Visualización rápida con hover.

---

## 📦 Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/indice-flotante.git
   ```
2. Abre la carpeta en **VS Code**.
3. Pulsa `F5` para ejecutar la extensión en una ventana de desarrollo.

---

## 🛠 Uso
- Abre cualquier archivo que tenga líneas con prefijos como `123;45;6;`.
- Mueve el cursor:  
  - La **barra de estado** mostrará la posición relativa.  
  - Al pasar el mouse, aparecerá un **hover** con el índice.

---

## 📜 Ejemplo
```
123;45;6;Hola Mundo
        ^ (posición relativa: 2)
```

---

## 🤝 Contribuciones
¡Bienvenidas! Siéntete libre de abrir un **issue** o enviar un **pull request**.

---

## 📄 Licencia
MIT
