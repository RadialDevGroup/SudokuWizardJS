/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Constants, Utilities */
//import {Constants} from "./Constants.js";
//import {model} from "./Main.js";
//import {Utilities} from "./Utilities.js";
// Basic display manipulation functions
class Display {
    constructor (Model) {
        this.HideCandidate = (hash) => {
            const candidateID = "#candidate" + hash;
            const candidate = $(candidateID)[0];
            candidate.style.visibility = "hidden";
        };
        this.ShowCandidate = (hash) => {
            const candidateID = "#candidate" + hash;
            const candidate = $(candidateID)[0];
            candidate.style.visibility = "visible"; 
        };
        this.TurnOffFinalValue = (row, column) => {
            const finalValueID = "#finalValuerow" + row + "column" + column;
            const finalValue = $(finalValueID)[0];
            finalValue.style.visibility = "hidden";
        };
        this.TurnOnFinalValue = (row, column) => {
            const finalValueID = "#finalValuerow" + row + "column" + column;
            const finalValue = $(finalValueID)[0];
            finalValue.style.visibility = "visible";
        };
        this.TurnOnCandidateTable = (row, column) => {
            const candidateTableID = "#candidateTablerow" + row + "column" + column;
            const candidateTable = $(candidateTableID)[0];
            candidateTable.style.visibility = "visible";
            const constants = new Constants(Model);
            for (let value = 0; value < Model.numberOfClues; value++) {
                const hash = constants.Hash(row, column, value);
                this.ShowCandidate(hash);
            }
        };
        this.TurnOffCandidateTable = (row, column) => {
            const candidateTableID = "#candidateTablerow" + row + "column" + column;
            const candidateTable = $(candidateTableID)[0];

            candidateTable.style.visibility = "hidden";
            const constants = new Constants(Model);
            for (let value = 0; value < Model.numberOfClues; value++) {
                const hash = constants.Hash(row, column, value);
                const candidateID = "#candidate" + hash;
                const candidate = $(candidateID)[0];
                candidate.style.visibility = "hidden";
            }
        };
        this.RemovePencilMarkString = (row, column, value) => {
            const pencilMark = Model.currentPencilMarks[row][column];
            const p = pencilMark.indexOf(value);
            if (p === -1) {
                return pencilMark;
            }
            if (p === 0) {
                return pencilMark.substring(1);
            }
            if (p === pencilMark.length - 1) {
                return pencilMark.substring(0,pencilMark.length - 1);
            }
            return pencilMark.substring(0, p) + pencilMark.substring(p+1);
        };
        this.CurrentValues = () => {
            let currentValue = "";
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {
                    const value = Model.currentValues[row][column];
                    if (value === "") {
                        currentValue += ".";
                    } else {
                        currentValue += value;
                    }
                }
            }
            return currentValue;
        };
        this.CurrentPencilMarks = () => {
            let currentPencilMark = "";
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {
                    const value = Model.currentPencilMarks[row][column];
                    currentPencilMark += value;
                    if ((row === Model.numberOfClues - 1) && (column === Model.numberOfClues - 1)) {
                    } else {
                        currentPencilMark += ",";
                    }
                }
            }
            return currentPencilMark;
        };
        this.ClearDocs = () => {
            const docElement = $("#docs")[0];
            docElement.value = "";
        };
        this.RestoreCurrentValues = () => {
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {

                    // Restore Initial and Final values
                    const value = Model.currentValues[row][column];
                    if (value === "") { continue;}

                    const finalValueID = "#finalValuerow" + row + "column" + column;
                    const finalValue = $(finalValueID)[0];
                    finalValue.innerHTML = value;

                    this.TurnOffCandidateTable(row, column);
                    this.TurnOnFinalValue(row, column);

                    if (Model.initialValues[row][column] === value) {
                        finalValue.style.color = Model.initialValueColor;
                    } else {
                        finalValue.style.color = Model.subsequentValueColor;
                    }
                }
            }
        };
        this.RestorePencilMarks = () => {
            const constants = new Constants(Model);
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {
                    const values = Model.currentPencilMarks[row][column]; 
                    if (values.length === 0) {
                        for (let value = 0; value < Model.numberOfClues; value++) {
                            const hash = constants.Hash(row, column, value);
                            this.HideCandidate(hash);
                        }
                        continue;
                    }
                    this.TurnOffFinalValue(row, column);
                    this.TurnOnCandidateTable(row, column);

                    for (let value = 0; value < Model.numberOfClues; value++) {
                        const hash = constants.Hash(row, column, value);
                        if (values.indexOf(constants.SymbolAtPosition(value)) !== -1) {
                            this.ShowCandidate(hash);
                        } else {
                            this.HideCandidate(hash);
                        }
                    }
                }
            }
        };
    }
}



