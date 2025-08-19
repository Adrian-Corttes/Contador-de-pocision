// Importa la API de VS Code
const vscode = require('vscode');

// --- INICIO: Lógica reutilizable ---
// Es una buena práctica mover la lógica principal a su propia función
// para poder usarla desde diferentes lugares (hover y barra de estado).

/**
 * Analiza una línea de texto y devuelve el índice del carácter relativo al prefijo.
 * @param {string} lineText El texto completo de la línea.
 * @param {number} characterPosition La posición del carácter en la línea (0-based).
 * @returns {number|null} El índice relativo (1-based) o null si no aplica.
 */
function getRelativeIndex(lineText, characterPosition) {
    // Expresión regular para encontrar un prefijo como "123;45;6;" al inicio de la línea.
    const prefixRegex = /^\d+;\d+;\d+;/;
    const match = lineText.match(prefixRegex);

    // Si la línea no tiene el prefijo, no hacemos nada.
    if (!match) {
        return null;
    }

    const prefixLength = match[0].length;

    // Si el cursor está sobre el texto DESPUÉS del prefijo...
    if (characterPosition >= prefixLength) {
        // Calculamos el índice relativo (1-based).
        return characterPosition - prefixLength;
    }

    // Si el cursor está sobre el prefijo, no devolvemos nada.
    return null;
}
// --- FIN: Lógica reutilizable ---


// Esta función se llama cuando tu extensión es activada
function activate(context) {
    console.log('¡Extensión "Indice Flotante" está activa!');

    // --- 1. Muestra el índice en la BARRA DE ESTADO al mover el cursor con el teclado ---

    // Creamos un elemento en la barra de estado. Lo alineamos a la derecha.
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    context.subscriptions.push(statusBarItem); // Importante para que se limpie al desactivar

    // Registramos un evento que se dispara cada vez que el cursor o la selección cambian.
    const selectionChangeDisposable = vscode.window.onDidChangeTextEditorSelection(event => {
        // Nos aseguramos de que el evento corresponda al editor de texto activo.
        const editor = vscode.window.activeTextEditor;
        if (editor && event.textEditor === editor) {
            const position = editor.selection.active;
            const lineText = editor.document.lineAt(position.line).text;

            // Usamos nuestra función reutilizable para obtener el índice.
            const relativeIndex = getRelativeIndex(lineText, position.character);

            if (relativeIndex !== null) {
                // Si tenemos un índice, lo mostramos en la barra de estado.
                // Usamos un icono `$(symbol-key)` para que sea más claro.
                statusBarItem.text = `$(symbol-key) Posición: ${relativeIndex}`;
                statusBarItem.show();
            } else {
                // Si no estamos en una posición válida, ocultamos el indicador.
                statusBarItem.hide();
            }
        }
    });

    context.subscriptions.push(selectionChangeDisposable);


    // --- 2. Muestra el índice en un HOVER al pasar el mouse ---

    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: 'file' }, // Se aplica a cualquier archivo
        {
            provideHover(document, position, token) {
                const lineText = document.lineAt(position.line).text;

                // Usamos nuestra función reutilizable de nuevo.
                const relativeIndex = getRelativeIndex(lineText, position.character);

                if (relativeIndex !== null) {
                    // ¡CAMBIO IMPORTANTE!
                    // Creamos el hover mostrando solo el número.
                    // VS Code lo envolverá en un objeto Hover automáticamente.
                    return new vscode.Hover(`${relativeIndex}`);
                }

                // Si no hay índice, no mostramos hover.
                return null;
            }
        }
    );

    context.subscriptions.push(hoverProvider);
}

function deactivate() {
    // Esta función se llama cuando la extensión se desactiva.
    // VS Code se encarga de limpiar los elementos en `context.subscriptions`.
}

// Exporta las funciones para que VS Code pueda usarlas.
module.exports = {
    activate,
    deactivate
};