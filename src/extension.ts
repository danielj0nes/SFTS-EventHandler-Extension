import * as vscode from "vscode";

let curDir = "";
let projectName = "";

if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("Open a folder to automatically set the project path");
} else {
    curDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    projectName = curDir.split("\\").slice(-1)[0];
}

export function activate(context: vscode.ExtensionContext) {
    const provider = new MainViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(MainViewProvider.viewType, provider));
    
    
}


class MainViewProvider implements vscode.WebviewViewProvider {
    
    
    public static readonly viewType = "setup.setupView";

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case "runScript":
                        vscode.window.showErrorMessage(message.text);
                        var spawn = require("child_process").spawn;
                        spawn("powershell.exe",["C:\\Users\\sftsadmin\\Desktop\\VSCE\\SFTS-EventHandler-Extension\\test.ps1 hello"]);
                        console.log("Hi");
                        return;
                }
            }
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <style> 
                    input[type=text] {
                        width: 100%;
                        margin: 8px 0;
                        box-sizing: border-box;
                        font-size: 12px;
                    }
                    h2, p {
                        padding: 0;
                        margin: 0;
                    }
                    button {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                </style>
            </head>
            <body>
                <h2>Project directory</h1>
                <p style="font-size: 12px">This is the location where the template will be configured.</p>
                <input type="text" id="dirInput" value=${curDir} required>
                <p style="margin: 15px"></p>
                <h2>Project name</h2>
                <input type="text" id="projInput" value=${projectName} required>
                <p style="margin: 15px"></p>
                <button id="runScript">Setup project</button>

                <script>
                    const vscode = acquireVsCodeApi();
                    const runBtn = document.getElementById("runScript");
                    runBtn.addEventListener("click", execScript);

                    function execScript() {
                        vscode.postMessage({
                            command: 'runScript',
                            text: 'xxx'
                        })
                    }
                </script>

            </body>
        </html>
        `;
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
