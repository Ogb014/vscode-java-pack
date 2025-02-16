import { CancellationToken, CodeAction, CodeActionContext, CodeActionKind, ExtensionContext, TextDocument, languages, window, workspace, Range, Selection } from "vscode";
import { COMMAND_INSPECT_RANGE, registerCommands } from "./commands";
import { InspectActionCodeLensProvider } from "./InspectActionCodeLensProvider";
import { DefaultRenderer as DefaultInspectionRenderer } from "./render/DefaultRenderer";
import { InspectionRenderer } from "./render/InspectionRenderer";

export async function activateCopilotInspection(context: ExtensionContext): Promise<void> {    
    const inspectActionCodeLenses = new InspectActionCodeLensProvider().install(context);
    const inspectionRenderer: InspectionRenderer = new DefaultInspectionRenderer().install(context);
    // Commands
    registerCommands(inspectionRenderer);

    context.subscriptions.push(
        workspace.onDidOpenTextDocument(doc => inspectActionCodeLenses.rerender(doc)), // Rerender class codelens when open a new document
        workspace.onDidChangeTextDocument(e => inspectActionCodeLenses.rerender(e.document)), // Rerender class codelens when change a document
        languages.registerCodeActionsProvider({ language: 'java' }, { provideCodeActions: rewrite }), // add code action to rewrite code
    );
    window.visibleTextEditors.forEach(editor => inspectActionCodeLenses.rerender(editor.document));
}

async function rewrite(document: TextDocument, range: Range | Selection, _context: CodeActionContext, _token: CancellationToken): Promise<CodeAction[]> {
    const action: CodeAction = {
        title: "Rewrite with new syntax",
        kind: CodeActionKind.RefactorRewrite,
        command: {
            title: "Rewrite selected code",
            command: COMMAND_INSPECT_RANGE,
            arguments: [document, range]
        }
    };
    return [action];
}