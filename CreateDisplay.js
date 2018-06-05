/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Constants, Utilities, SudokuWizard */
class CreateDisplay {
    constructor(Model) {
        const constants = new Constants(Model);
        this.NewDisplaySize = (selection) => {
            const option = selection.value;
            if (option === "9x9" && Model.numberOfClues !== 9) {
                Model.numberOfClues = 9;
                Model.numberOfRowsPerArea = 3;
                Model.numberOfColumnsPerArea = 3;
                Model.symbols = Model.symbolarray[9];
            } else if (option === "12x12" && Model.numberOfClues !== 12) {
                Model.numberOfClues = 12;
                Model.numberOfRowsPerArea = 4;
                Model.numberOfColumnsPerArea = 3;
                Model.symbols = Model.symbolarray[12];
            } else if (option === "16x16" && Model.numberOfClues !== 16) {
                Model.numberOfClues = 16;
                Model.numberOfRowsPerArea = 4;
                Model.numberOfColumnsPerArea = 4;
                Model.symbols = Model.symbolarray[16];
            }
            const createNumberButtons = new CreateNumberButtons(Model);
            createNumberButtons.CreateNumberButtons();

            const createDisplay = new CreateDisplay(Model);
            createDisplay.CreateDisplay();

            const dataArrays = new DataArrays(Model);
            dataArrays.CreateDataArrays();

            const buttonStateControl = new ButtonStateControl(Model);
            buttonStateControl.DisableStep();
            buttonStateControl.DisableAddPencilMarks();
            buttonStateControl.DisableClear();
            buttonStateControl.DisableReset();
        };
        this.CreateDisplay = () => {
            const tableNode = $("#display")[0];
            let tBodyNode = tableNode.tBodies[0];
            if (tBodyNode !== undefined) {
                tBodyNode.parentNode.removeChild(tBodyNode);
            }
            tBodyNode = document.createElement("tbody");
            WriteBoxes(tBodyNode);
            tableNode.appendChild(tBodyNode);

            const displaySection = $("#displaySection")[0];
            displaySection.width = tableNode.offsetWidth;
            displaySection.height = tableNode.offsetHeight;

            const controlsSection = $("#controlsSection")[0];
            const displayWidth = tableNode.offsetWidth;
            const displayHeight = tableNode.offsetHeight;
            controlsSection.style.position = "absolute";

            const tableNodeLeft = SudokuWizard.GetOffsetLeft(displaySection);
            const tableNodeTop = SudokuWizard.GetOffsetTop(displaySection);
            controlsSection.style.left = (15 + displayWidth + tableNodeLeft) + 'px';
            controlsSection.style.top = (15 + tableNodeTop) + 'px';

            const canvas = $("#canvas")[0];
            canvas.width = tableNode.offsetWidth;
            canvas.height = tableNode.offsetHeight;

            const clickCommand = "SudokuWizard.CanvasClicked(event)";
            canvas.setAttribute("onClick", clickCommand);

            const docsSection = $("#docs")[0];
            docsSection.style.position = "absolute";
            docsSection.style.top = (15 + displayHeight + tableNodeTop) + 'px';
            const docsHeight = docsSection.offsetHeight;
        };
        const WriteBoxes = (tBodyNode) => {
            for (let rowBox = 0; rowBox < Model.numberOfColumnsPerArea; rowBox++) {
                const rowNode = document.createElement("tr");
                for (let columnBox = 0; columnBox < Model.numberOfRowsPerArea; columnBox++){
                    const area = rowBox * Model.numberOfRowsPerArea + columnBox;
                    const areaTd = document.createElement("td");
                    areaTd.id = "area" + area;
                    areaTd.className = "area";
                    WriteCells(areaTd, rowBox, columnBox);

                    rowNode.appendChild(areaTd);
                }
                tBodyNode.appendChild(rowNode);
            }
        };
        const WriteCells = (areaTd, rowBox, columnBox) =>{
            const cellTable = document.createElement("table");
            cellTable.className = "areaTable";
            for (let rowInBox = 0; rowInBox < Model.numberOfRowsPerArea; rowInBox++) {
                const row = (rowBox * Model.numberOfRowsPerArea) + rowInBox;
                const rowNode = document.createElement("tr");            
                for (let columnInBox = 0; columnInBox < Model.numberOfColumnsPerArea; columnInBox++){
                    const column = columnBox * Model.numberOfColumnsPerArea + columnInBox;
                    const cellId = "row" + row + "column" + column;
                    const cellTd = document.createElement("td");
                    cellTd.className = "cell";
                    cellTd.id = cellId;

                    const p = document.createElement("p");
                    p.className = "finalValue";
                    p.id = "finalValue" + cellId;
                    p.innerHTML = "";
                    p.style.visibilty = "visible";
                    cellTd.appendChild(p);

                    WriteCandidates(cellTd, cellId, row, column);
                    rowNode.appendChild(cellTd);
                }
                cellTable.appendChild(rowNode);
            }
            areaTd.appendChild(cellTable);
        };

        const WriteCandidates = (cellTd, cellId, row, column) => {
            const candidateTable = document.createElement("table");
            candidateTable.className = "candidateTable";
            const candidateTableID = "candidateTable" + cellId;
            candidateTable.id = candidateTableID;
            candidateTable.style.visibility = "hidden";

            for (let rowInCell = 0; rowInCell < Model.numberOfColumnsPerArea; rowInCell++) {
                const rowCandidate = document.createElement("tr");
                rowCandidate.className = candidateTableID + "Tr";

                for (let columnInCell = 0; columnInCell < Model.numberOfRowsPerArea; columnInCell++){
                    const value = rowInCell * Model.numberOfRowsPerArea + columnInCell;
                    const hash = constants.Hash(row, column, value);
                    const id = "candidate" + hash;
                    const candidateTd = document.createElement("td");
                    candidateTd.className = "candidate";
                    candidateTd.id = id;
                    candidateTd.style.visibility = "hidden";

                    const v = constants.SymbolAtPosition(value);
                    const p = document.createElement("p");
                    p.className = "candidateValue";
                    p.innerHTML = v;

                    candidateTd.appendChild(p);
                    rowCandidate.appendChild(candidateTd);
                }
                candidateTable.appendChild(rowCandidate);
            }
            cellTd.appendChild(candidateTable);
        };
    }
}