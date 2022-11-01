// Daniel Jones - SFTS - 2022
// Main extension body. Handles communication between extension panel and everything else.

import * as vscode from "vscode";
import * as child_process from "child_process";
import fs = require("fs");
import { scriptText } from "./Event_Handler_Setup";
import { compileText } from "./Event_Handler_Compile";
import { preLoadText } from "./Template_EHs/FLR_PreLoadEventHandler";
import { preSaveText } from "./Template_EHs/FLR_PreSaveEventHandler";
import { adminMessageText } from "./Template_EHs/General_AdminMessage_PreLoadEventHandler";

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
                        const scriptPath = `${message.projectpath}\\Event_Handler_Setup.ps1`;
                        fs.writeFileSync(scriptPath, scriptText);
                        const scriptOutput = child_process.spawnSync("powershell.exe",
                        ["-ExecutionPolicy", "Bypass",
                        "-file", scriptPath,
                        message.projectpath, message.projectname], { encoding: 'utf-8' });
                        const setupDebug = scriptOutput.stdout;
                        fs.unlinkSync(scriptPath);
                        vscode.window.showInformationMessage(`Project ${message.projectname} successfully configured in ${message.projectpath}.`);
                        webviewView.webview.postMessage({
                          command: "debug",
                          debugText: setupDebug
                        });
                        return;
                    
                    case "generateFile":
                        switch (message.fileName) {
                          case "preLoad":
                            fs.writeFileSync(`${curDir}\\FLR_PreLoadEventHandler.cs`, preLoadText);
                            break;
                          case "preSave":
                            fs.writeFileSync(`${curDir}\\FLR_PreSaveEventHandler.cs`, preSaveText);
                            break;
                          case "adminMessage":
                            fs.writeFileSync(`${curDir}\\General_AdminMessage_PreLoadEventHandler.cs`, adminMessageText);
                            break;
                        }
                        vscode.window.showInformationMessage(`Template file successfully created in ${curDir}`);
                        return;
                    
                    case "compile":
                      const compilePath = `${curDir}\\Event_Handler_Compile.ps1`;
                      fs.writeFileSync(compilePath, compileText);
                      const compileOutput = child_process.spawnSync("powershell.exe",
                        ["-ExecutionPolicy", "Bypass",
                        "-file", compilePath, curDir], { encoding: 'utf-8' });
                      const compileDebug = compileOutput.stdout;
                      fs.unlinkSync(compilePath);
                      vscode.window.showInformationMessage(`DLL built in ${curDir}.`);
                      webviewView.webview.postMessage({
                        command: "debug",
                        debugText: compileDebug
                      });
                }
            }
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
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
        
              h2,
              p {
                padding: 0;
                margin: 0;
              }
        
              #runScript, #compile {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
              }
              .debugBox {
                width: 280px;
                height: 150px;
                overflow-x: hidden;
                overflow-y: auto;
                padding: 5px;
                background-color: white;
                color: black;
                scrollbar-base-color: #DEBB07;
                white-space: pre-line;
                resize:both;
              }
            </style>
          </head>
        
          <body>
            <h2>Project directory</h2>
            <p style="font-size: 12px">This is the full path of where the template will be configured.</p>
            <input type="text" id="dirInput" value="${curDir}" required>
            <p style="margin: 15px"></p>
            
            <h2>Project name</h2>
            <input type="text" id="projInput" value="${projectName}" required>
            <p style="margin: 15px"></p>

            <button id="runScript">Setup project</button>
            <p style="margin: 50px"></p>

            <h2>Template Event Handlers</h2>
            <p style="font-size: 12px">Creates a specific SFTS template event handler in the current directory.</p>
            <h3 style="display: inline-block">Pre-Load</h3> <button onclick="generateFile('preLoad')">Create</button>
            <br />
            <h3 style="display: inline-block">Pre-Save</h3> <button onclick="generateFile('preSave')">Create</button>
            <br />
            <h3 style="display: inline-block">Admin Message</h3> <button onclick="generateFile('adminMessage')">Create</button>
            <p style="margin: 50px"></p>

            <h2>Compile Event Handler</h2>
            <p style="font-size: 12px">Builds the <b>.dll</b> file - to be imported into Relativity.</p>
            <button id="compile" onclick="compile()">Compile</button>
            <p style="margin: 50px"></p>
            <h2>Debugging</h2>
            <br />
            <div id="debugInfo" class="debugBox" style="display: none"></div>

            <script>
              const debugInfoBox = document.getElementById("debugInfo");
              const vscode = acquireVsCodeApi();
              const runBtn = document.getElementById("runScript");
        
              function execScript() {
                const projectpath = document.getElementById("dirInput").value;
                const projectname = document.getElementById("projInput").value;
        
                vscode.postMessage({
                  command: "runScript",
                  projectpath: projectpath,
                  projectname: projectname
                })
              }

              function generateFile(fileType) {
                vscode.postMessage({
                    command: "generateFile",
                    fileName: fileType
                })
              }

              function compile() {
                vscode.postMessage({
                  command: "compile"
                })
              }

              window.addEventListener("message", event => {
                const message = event.data;
                switch (message.command) {
                    case "debug":
                        debugInfoBox.style.display = "";
                        debugInfoBox.textContent = message.debugText;
                        break;
                }
            });

              runBtn.addEventListener("click", execScript);
            </script>
          </body>
        
        </html>`;
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
