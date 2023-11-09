// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import * as path from "path";
import { getNonce } from "../utils";
import { sendError } from "vscode-extension-telemetry-wrapper";

let projectManagementView: vscode.WebviewPanel | undefined;

export async function showProjectManagementPage(context: vscode.ExtensionContext): Promise<void> {
    if (projectManagementView) {
      projectManagementView.reveal();
        return;
    }

    projectManagementView = vscode.window.createWebviewPanel(
        "java.projectManagement",
        "Project Management",
        vscode.ViewColumn.Active,
        {
            enableScripts: true,
            enableCommandUris: true,
            retainContextWhenHidden: true
        }
    );

    await initializeWebview(context);
}

// TODO: deserializeWebviewPanel
// export class ClassPathConfigurationViewSerializer implements vscode.WebviewPanelSerializer {
//     async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, _state: any) {
//         classpathConfigurationPanel = webviewPanel;
//         await initializeWebview(getExtensionContext());
//     }
// }

async function initializeWebview(context: vscode.ExtensionContext): Promise<void> {
    if (!projectManagementView) {
        sendError(new Error("projectManagementView is not defined."));
        return;
    }

    context.subscriptions.push(projectManagementView.onDidDispose(_e => projectManagementView = undefined));

    projectManagementView.iconPath = {
        light: vscode.Uri.file(path.join(context.extensionPath, "caption.light.svg")),
        dark: vscode.Uri.file(path.join(context.extensionPath, "caption.dark.svg"))
    };

    context.subscriptions.push(projectManagementView.webview.onDidReceiveMessage((async (message) => {
        switch (message.command) {
        }
    })));

    projectManagementView.webview.html = getHtmlForWebview(projectManagementView.webview, context.asAbsolutePath("./out/assets/projectManagement/index.js"));
}

function getHtmlForWebview(webview: vscode.Webview, scriptPath: string) {
    const scriptPathOnDisk = vscode.Uri.file(scriptPath);
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <title>Project Management</title>
    </head>
    <body>
        <script nonce="${nonce}" src="${scriptUri}" type="module"></script>
        <div id="content"></div>
    </body>

    </html>
    `;
}
