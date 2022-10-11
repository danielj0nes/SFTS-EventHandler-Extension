import * as vscode from 'vscode';

let curDir: string; 

if (!vscode.workspace.workspaceFolders) {
	vscode.window.showInformationMessage("Open a folder/workspace first");
} else {
	curDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
}

export function activate(context: vscode.ExtensionContext) {
	const provider = new MainViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(MainViewProvider.viewType, provider));
}


class MainViewProvider implements vscode.WebviewViewProvider {
	
	
	public static readonly viewType = 'setup.setupView';

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
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="X-UA-Compatible" content="ie=edge">
			</head>
			<body>
				${curDir}
			</body>
		</html>
		`;
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
