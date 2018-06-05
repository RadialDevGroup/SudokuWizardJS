/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global model, Display, SudokuWizard */

class Solver {
    constructor(Model) {
        this.Solve = () => {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "jsp/solver/SolverCore.jsp",
                    dataType:'html',
                    success:function(data) {
                        $("#article").html(data);
                        const createNumberButtons = new CreateNumberButtons(Model);
                        createNumberButtons.CreateNumberButtons();

                        var createDisplay = new CreateDisplay(Model);
                        createDisplay.CreateDisplay();

                        if (!Model.displayIsCleared) {
                            const display = new Display(Model);
                            display.RestoreCurrentValues();
                            display.RestorePencilMarks();
                        }

                        const docElement = $("#docs")[0];
                        docElement.value = Model.currentDocs;

                        if (Model.stepResultsUpdateDisplayOnly0 !== "") {
                            const displayData = new DisplayData(Model);
                            displayData.UpdateDisplayOnly(Model.stepResultsUpdateDisplayOnly0);
                        }
                        const buttonStateControl = new ButtonStateControl(Model);
                        if (Model.numberButtonsEnabled) {
                            buttonStateControl.EnableKeyPad();
                        } else {
                            buttonStateControl.DisableKeyPad();
                        }
                        if (Model.addPencilMarksEnabled) {
                            buttonStateControl.EnableAddPencilMarks();
                        } else {
                            buttonStateControl.DisableAddPencilMarks();
                        }
                        if (Model.clearEnabled) {
                            buttonStateControl.EnableClear();
                        } else {
                            buttonStateControl.DisableClear();
                        }
                        if (Model.resetEnabled) {
                            buttonStateControl.EnableReset();
                        } else {
                            buttonStateControl.DisableReset();
                        }
                        if (Model.stepEnabled) {
                            buttonStateControl.EnableStep();
                        } else {
                            buttonStateControl.DisableStep();
                        }
                        resolve();
                    }
                });
            });
        };
        this.LoadPuzzle = (puzzleName) => {
            if (puzzleName === "") { return; }
            
            const selectedFileName = "sdk/" + puzzleName + ".sdk";
            $.ajax({
                url: selectedFileName,
                async: false,
                success: function(data){ 
                    SudokuWizard.Clear();
                    const selectedFile = new File([data], selectedFileName);
                    var handleFileSelect = new HandleFileSelect(Model);
                    handleFileSelect.LoadFile(selectedFile);
                }
            });
        };
    }
}