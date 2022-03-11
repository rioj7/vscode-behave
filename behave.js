'use strict';
const vscode = require('vscode');

function activate(context) {
  const possibleTableRegex = new RegExp('^( +)(Given|Examples:)');
  context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('Behave', {
    /** @param {vscode.TextDocument} document */
    provideDocumentFormattingEdits(document) {
      let possibleTable = false;
      let tableStartLine = undefined;
      let indent = undefined;
      let tableLines = undefined;
      let textEdits = [];
      const addTextEdit = (tableLines, indent, tableStartLine) => {
        // remove '|' from start and end and split on '|'
        tableLines = tableLines.map( t => {
          if (t.startsWith('|')) { t = t.substring(1); }
          if (t.endsWith('|')) { t = t.substring(0, t.length-1); }
          return t.split('|').map( s => s.trim());
        });
        let columnCount = Math.max(...tableLines.map(t => t.length));
        tableLines = tableLines.map( t => {
          while (t.length < columnCount) { t.push(''); }
          return t;
        });
        let columnSize = new Array(columnCount);
        columnSize.fill(0);
        columnSize = tableLines.reduce(
          (colSize, t) => colSize.map( (colLen, idx) => Math.max(colLen, t[idx].length) ),
          columnSize);
        tableLines = tableLines.map( t => {
          return `${indent}| ${t.map( (s, idx) => s.padEnd(columnSize[idx]) ).join(' | ')} |`
        });
        let newText = tableLines.join('\n');
        textEdits.push(vscode.TextEdit.replace(new vscode.Range(document.lineAt(tableStartLine).range.start, document.lineAt(tableStartLine+tableLines.length-1).range.end), newText));
      };
      for (let lineNr = 0; lineNr < document.lineCount; lineNr++) {
        const line = document.lineAt(lineNr);
        const text = line.text;
        if (possibleTable && text.trim().startsWith('|')) {
          if (!tableLines) {
            tableStartLine = lineNr;
            tableLines = [];
          }
          tableLines.push(text.trim())
          continue;
        }
        if (tableLines) { addTextEdit(tableLines, indent, tableStartLine); }

        possibleTable = undefined;
        tableStartLine = undefined;
        indent = undefined;
        tableLines = undefined;

        let result = text.match(possibleTableRegex);
        if (result === null) { continue; }
        possibleTable = true;
        indent = result[1]+'  ';
      }
      if (tableLines) { addTextEdit(tableLines, indent, tableStartLine); }
      return textEdits;
    }
  }));
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
