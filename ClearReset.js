/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Display, SudokuWizard */

//import {Display} from "./Display.js";
//import {model} from "./Main.js";
class ClearReset {
    constructor (Model) {
        this.Reset = () => {
            if (Model.stepResultsUpdateMatrixAndDisplay.length > 0) {
                const displayData = new DisplayData(Model);
                displayData.ClearDisplay(Model.stepResultsUpdateMatrixAndDisplay.shift());
            }
            const buttonStateControl = new ButtonStateControl(Model);
            buttonStateControl.DisableReset();
            buttonStateControl.EnableStep();

            const display = new Display(Model);
            display.ClearDocs();
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {
                    const value = Model.initialValues[row][column];
                    Model.currentValues[row][column] = value;

                    const finalValueID = "#finalValuerow" + row + "column" + column;
                    const finalValue = $(finalValueID)[0];

                    if (value === "") {
                        display.TurnOffFinalValue(row, column);
                        display.TurnOnCandidateTable(row, column);
                        finalValue.innerHTML = "";

                        Model.initialPencilMarks[row][column] = Model.symbols;
                        Model.currentPencilMarks[row][column] = Model.symbols;
                    }
                }
            }
            SudokuWizard.AddPencilMarks(Model);
        };
        this.Clear = () => {
            if (Model.stepResultsUpdateMatrixAndDisplay.length > 0) {
                const displayData = new DisplayData(Model);
                displayData.ClearDisplay(Model.stepResultsUpdateMatrixAndDisplay.shift());
            }

            Model.displayIsCleared = true;

            const display = new Display(Model);
            display.ClearDocs();
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {
                    Model.initialValues[row][column] = "";
                    Model.currentValues[row][column] = "";

                    display.TurnOnFinalValue(row, column);
                    display.TurnOffCandidateTable(row, column);

                    const finalValueID = "#finalValuerow" + row + "column" + column;
                    const finalValue = $(finalValueID)[0];
                    finalValue.innerHTML = "";

                    Model.initialPencilMarks[row][column] = Model.symbols;
                    Model.currentPencilMarks[row][column] = Model.symbols;
                }
            }

            const candidateBackground = new CandidateBackground(Model);
            candidateBackground.ResetCandidateBackgroundArrays();

            const buttonStateControl = new ButtonStateControl(Model);
            buttonStateControl.EnableStep();
            buttonStateControl.EnableKeyPad();
            buttonStateControl.DisableAddPencilMarks();
            buttonStateControl.DisableStep();
            buttonStateControl.DisableClear();
            buttonStateControl.DisableReset();

            Model.stepResultsUpdateDisplayOnly = [];
            Model.stepResultsUpdateMatrixAndDisplay = [];

            Model.stepResultsUpdateDisplayOnly0 =  "";
            Model.currentDocs =  "";
        };
    }
}


