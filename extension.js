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
        return characterPosition - prefixLength + 1; // Ajustado para ser 1-based correctamente
    }

    // Si el cursor está sobre el prefijo, no devolvemos nada.
    return null;
}
// --- FIN: Lógica reutilizable ---


// Esta función se llama cuando tu extensión es activada
function activate(context) {
    console.log('¡Extensión "Indice Flotante" está activa!');

    // =========================================================================
    // --- INICIO: CÓDIGO ORIGINAL (Posición relativa del cursor) ---
    // Esta sección se mantiene sin cambios.
    // =========================================================================

    // --- 1. Muestra el índice en la BARRA DE ESTADO al mover el cursor con el teclado ---
    const positionStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    context.subscriptions.push(positionStatusBarItem);

    const selectionChangeDisposable = vscode.window.onDidChangeTextEditorSelection(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.textEditor === editor) {
            const position = editor.selection.active;
            const lineText = editor.document.lineAt(position.line).text;
            const relativeIndex = getRelativeIndex(lineText, position.character);

            if (relativeIndex !== null) {
                positionStatusBarItem.text = `$(symbol-key) Posición: ${relativeIndex}`;
                positionStatusBarItem.show();
            } else {
                positionStatusBarItem.hide();
            }
        }
    });
    context.subscriptions.push(selectionChangeDisposable);

    // --- 2. Muestra el índice en un HOVER al pasar el mouse ---
    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: 'file' },
        {
            provideHover(document, position, token) {
                const lineText = document.lineAt(position.line).text;
                const relativeIndex = getRelativeIndex(lineText, position.character);

                if (relativeIndex !== null) {
                    return new vscode.Hover(`Índice relativo: ${relativeIndex}`);
                }
                return null;
            }
        }
    );
    context.subscriptions.push(hoverProvider);

    // =========================================================================
    // --- FIN: CÓDIGO ORIGINAL ---
    // =========================================================================


    // =========================================================================
    // --- INICIO: NUEVA FUNCIONALIDAD (Reemplazo de Números por Letras) ---
    // =========================================================================

    let isReplacementModeActive = false; // Estado para saber si el modo está activo
    let isProgrammaticChange = false; // Previene bucles infinitos al editar el documento

    // Mapa de reemplazos de número a letra
    const replacementMap = {
        '1': 'A', '2': 'B', '3': 'C',
        '4': 'D', '5': 'E', '6': 'F',
        '7': 'G', '8': 'H', '0': 'X'
    };

    // --- 3. Crea el BarItem para activar/desactivar el modo ---
    const toggleModeBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 900);
    toggleModeBarItem.command = 'extension.toggleReplacementMode'; // Comando que se ejecuta al hacer clic

    function updateStatusBarItem() {
        if (isReplacementModeActive) {
            toggleModeBarItem.text = `$(keyboard) NUM → ABC: ON`;
            toggleModeBarItem.tooltip = 'Modo de reemplazo de números activado. Haz clic para desactivar.';
            toggleModeBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            toggleModeBarItem.text = `$(keyboard) NUM → ABC: OFF`;
            toggleModeBarItem.tooltip = 'Modo de reemplazo de números desactivado. Haz clic para activar.';
            // Quita el color de fondo cuando está apagado
            toggleModeBarItem.backgroundColor = undefined;
        }
    }

    updateStatusBarItem(); // Llama a la función para establecer el estado inicial
    toggleModeBarItem.show();
    context.subscriptions.push(toggleModeBarItem);

    // --- 4. Registra el comando para cambiar el estado ---
    const toggleCommand = vscode.commands.registerCommand('extension.toggleReplacementMode', () => {
        isReplacementModeActive = !isReplacementModeActive; // Invierte el estado
        updateStatusBarItem(); // Actualiza el texto del botón
        vscode.window.showInformationMessage(`Modo de reemplazo de números: ${isReplacementModeActive ? 'Activado' : 'Desactivado'}`);
    });
    context.subscriptions.push(toggleCommand);

    // --- 5. Escucha los cambios en el documento para hacer el reemplazo ---
    const textChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        // Si el modo no está activo, o el cambio fue hecho por la propia extensión, no hagas nada.
        if (!isReplacementModeActive || isProgrammaticChange) {
            return;
        }

        const editor = vscode.window.activeTextEditor;
        // Asegúrate de que el cambio sea en el editor activo
        if (!editor || event.document !== editor.document) {
            return;
        }

        // Procesa cada cambio individualmente
        event.contentChanges.forEach(change => {
            const insertedText = change.text;
            // Solo nos interesan inserciones de un solo carácter que sea un número a reemplazar
            if (insertedText.length === 1 && replacementMap[insertedText]) {
                const replacementLetter = replacementMap[insertedText];

                // Calcula el rango exacto del número que se acaba de insertar
                const startPosition = change.range.start;
                const endPosition = startPosition.translate(0, 1);
                const replacementRange = new vscode.Range(startPosition, endPosition);

                // Marca que el siguiente cambio será programático para evitar bucles
                isProgrammaticChange = true;
                // Edita el documento para reemplazar el número por la letra
                editor.edit(editBuilder => {
                    editBuilder.replace(replacementRange, replacementLetter);
                }).then(() => {
                    // Una vez que la edición se completa, resetea la marca
                    isProgrammaticChange = false;
                });
            }
        });
    });
    context.subscriptions.push(textChangeDisposable);

    // =========================================================================
    // --- FIN: NUEVA FUNCIONALIDAD ---
    // =========================================================================
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
