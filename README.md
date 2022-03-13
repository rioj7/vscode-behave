# Behave Formatter

Visual Studio Code extension that is a Formatter for Behave files.

The files with an extension of `feature` are recognized as Behave files.

Files are expected to be indented with spaces.

Currently only the tables are formatted:

* the table indents 2 spaces more than the `Given` or `Examples:` line above the table
* missing columns are appended, if not all rows have the same column count

Use the **Format Document** command or **Format Selection** command of the editor context menu or the key binding for these commands.

It also works if you enable **Format on Save** setting.

# TODO

* syntax highlighting other languages (`# language: es`)
* tab indented files
