//!germanPhrases

const germanPhrases = {
  // @codemirror/view
  "Control character": "Steuerzeichen",
  // @codemirror/fold
  "Folded lines": "Eingeklappte Zeilen",
  "Unfolded lines": "Ausgeklappte Zeilen",
  "to": "bis",
  "folded code": "eingeklappter Code",
  "unfold": "ausklappen",
  "Fold line": "Zeile einklappen",
  "Unfold line": "Zeile ausklappen",
  // @codemirror/search
  "Go to line": "Springe zu Zeile",
  "go": "OK",
  "Find": "Suchen",
  "Replace": "Ersetzen",
  "next": "nächste",
  "previous": "vorherige",
  "all": "alle",
  "match case": "groß/klein beachten",
  "replace": "ersetzen",
  "replace all": "alle ersetzen",
  "close": "schließen",
  "current match": "aktueller Treffer",
  "on line": "auf Zeile",
  // @codemirror/lint
  "Diagnostics": "Diagnosen",
  "No diagnostics": "Keine Diagnosen",
}

//!create

import {EditorView, EditorState, basicSetup} from "@codemirror/basic-setup"

;(window as any).view = new EditorView({
  state: EditorState.create({
    doc: `CodeMirror auf Deutsch übersetzt

Versuche zum Beispiel Strg-F für die Suchfunktion, oder bewege die
Mauszeiger über dieses Zeichen: \u0011
`,
    extensions: [basicSetup, EditorState.phrases.of(germanPhrases)]
  }),
  parent: document.querySelector("#editor")
})
