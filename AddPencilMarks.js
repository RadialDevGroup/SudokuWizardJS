/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Display, SudokuWizard */

function addPencilMarks(Model) {
    const display = createDisplay(Model);
    for (let row = 0; row < Model.numberOfClues; row++) {
        for (let column = 0; column < Model.numberOfClues; column++) {
            if (Model.initialValues[row][column] === "") {
                display.turnOffFinalValue(row, column);
                display.turnOnCandidateTable(row, column);
            }
        }
    }

    const displayData = createDisplayData(Model);
    for (let row = 0; row < Model.numberOfClues; row++) {
        for (let column = 0; column < Model.numberOfClues; column++) {
            displayData.PropagateFinalValue(row, column, true);
        }
    }
    const buttonStateControl = new ButtonStateControl(Model);
    buttonStateControl.DisableKeyPad();
    buttonStateControl.DisableAddPencilMarks();
    buttonStateControl.EnableStep();
    buttonStateControl.EnableClear();
    buttonStateControl.DisableReset();
}
