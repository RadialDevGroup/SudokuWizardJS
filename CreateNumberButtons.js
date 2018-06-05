/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Constants, Utilities */
class CreateNumberButtons {
    constructor(Model) {
        this.CreateNumberButtons = () =>{
            let count = 0;
            const constants = new Constants(Model);
            const tableNode = $("#NumberButtonTable")[0];
            let tBodyNode = tableNode.tBodies[0];
            if (tBodyNode !== undefined) {
                tBodyNode.parentNode.removeChild(tBodyNode);
            }
            tBodyNode = document.createElement("tbody");

            for (let row = 0; row < Model.numberOfColumnsPerArea; row++) {
                const rowNode = document.createElement("tr");

                for (let column = 0; column < Model.numberOfRowsPerArea; column++) {
                    const inputButton = document.createElement("input");
                    inputButton.setAttribute("type", "button");
                    inputButton.id = "keypad" + count;
                    inputButton.className = "keypad";
                    const clickCommand = "SudokuWizard.NumberPadClicked('keypad" + count + "')";
                    inputButton.value = constants.SymbolAtPosition(count);
                    const cellNode = document.createElement("td");
                    cellNode.setAttribute("onClick", clickCommand);
                    cellNode.appendChild(inputButton);
                    rowNode.appendChild(cellNode);
                    count++;
                }
                tBodyNode.appendChild(rowNode);
            }
            const rowNode = document.createElement("tr");

            const inputButton = document.createElement("input");
            inputButton.setAttribute("type", "button");
            inputButton.id = "keypadBlank";
            const value = Model.blank;
            const clickCommand = "SudokuWizard.NumberPadClicked('keypadBlank')";
            inputButton.setAttribute("onClick", clickCommand);
            inputButton.value = value;

            let keypadWidth = GetStyleSheetPropertyValue(".keypad", "width");
            keypadWidth = parseInt(keypadWidth.substring(0, keypadWidth.length - 2), 10);
            const width = (Model.numberOfRowsPerArea * (keypadWidth + 4)) - 4;
            inputButton.style.width = width + "px";
            const blankNode = document.createElement("td");
            blankNode.id = "blankNodeTd";
            blankNode.appendChild(inputButton);

            rowNode.appendChild(blankNode);
            tBodyNode.appendChild(rowNode);

            tableNode.appendChild(tBodyNode);
            const blankNodeTd = $("#blankNodeTd")[0];
            blankNodeTd.colSpan = Model.numberOfRowsPerArea;
        };
        const GetStyleSheetPropertyValue = (selectorText, propertyName) => {
        // search backwards because the last match is more likely the right one
            for (let s= document.styleSheets.length - 1; s >= 0; s--) {
                const cssRules = document.styleSheets[s].cssRules ||
                        document.styleSheets[s].rules || []; // IE support
                for (let c=0; c < cssRules.length; c++) {
                    if (cssRules[c].selectorText === selectorText) 
                        return cssRules[c].style[propertyName];
                }
            }
            return null;
        };
    }
}


