/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Constants, Utilities */
//import {Constants} from "./Constants.js";
//import {model} from "./Main.js";
//import {Utilities} from "./Utilities.js";

const $candidate = (hash) => $(`#candidate${hash}`);
const $finalValue = (row, column) => $(`#finalValuerow${row}column${column}`);
const $candidateTable = (row, column) => $(`#candidateTablerow${row}column${column}`);


// Basic display manipulation functions
function createDisplay(Model) {
    const constants = new Constants(Model);
    const hideCandidate = (hash) => {
        $candidate(hash).css({ visibility: 'hidden' });
    };
    const showCandidate = (hash) => {
        $candidate(hash).css({ visibility = "visible" });
    };
    const turnOffFinalValue = (row, column) => {
        $finalValue(row, column).css({ visibility = "hidden" });
    };
    const turnOnFinalValue = (row, column) => {
        $finalValue(row, column).css({ visibility: 'visible' });
    };

    const getCurrentValue = (row, column) => Model.getCurrentValue[row][column];

    const turnOnCandidateTable = (row, column) => {
        $candidateTable.css({ visibility: 'visible' });
        const hash = (value) => constants.Hash(row, column, value);
        for (let value = 0; value < Model.numberOfClues; value++) {
            showCandidate(hash(value));
        }
    };
    const turnOffCandidateTable = (row, column) => {
        $candidateTable.css({ visibility: 'hidden' });
        const hash = (value) => constants.Hash(row, column, value);
        for (let value = 0; value < Model.numberOfClues; value++) {
            hideCandidate(hash(value));
        }
    };
    const removePencilMarkString = (row, column, value) => {
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
    const currentValues = () => {
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
    const currentPencilMarks = () => {
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
    const clearDocs = () => {
        $("#docs").val('');
    };
    const restorecurrentValues = () => {
        for (let row = 0; row < Model.numberOfClues; row++) {
            for (let column = 0; column < Model.numberOfClues; column++) {
                const value = getCurrentValue(row, column);
                if (value !== '') {
                    $finalValue(row, column).html(value);
                    turnOffCandidateTable(row, column);
                    turnOnFinalValue(row, column);

                    if (isInitialValue(row, column, value)) {
                        $finalValue(row, column).css({ color: Model.initialValueColor });
                    } else {
                        $finalValue(row, column).css({ color: Model.subsequentValueColor });
                    }
                }
            }
        }
    };
    const restorePencilMarks = () => {
        for (let row = 0; row < Model.numberOfClues; row++) {
            for (let column = 0; column < Model.numberOfClues; column++) {
                const hash = (row, column) => constants.Hash(row, column, value);
                const values = Model.currentPencilMarks[row][column];

                if (values.length === 0) {
                    for (let value = 0; value < Model.numberOfClues; value++) {
                        hideCandidate(hash(value));
                    }
                    continue;
                }
                turnOffFinalValue(row, column);
                turnOnCandidateTable(row, column);

                for (let value = 0; value < Model.numberOfClues; value++) {
                    if (values.indexOf(constants.SymbolAtPosition(value)) !== -1) {
                        showCandidate(hash);
                    } else {
                        hideCandidate(hash);
                    }
                }
            }
        }
    }

    return {
        hideCandidate,
        showCandidate,
        turnOffFinalValue,
        turnOnFinalValue,
        turnOnCandidateTable,
        turnOffCandidateTable,
        removePencilMarkString,
        currentValues,
        currentPencilMarks,
        clearDocs,
        restorecurrentValues,
        restorePencilMarks
    }
}



