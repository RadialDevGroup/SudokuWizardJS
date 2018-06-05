/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global model */

class ButtonStateControl {
    constructor (Model) {
        this.EnableKeyPad = () => {
            for (let value = 0; value < Model.numberOfClues; value++) {
                $("#keypad" + value).prop('disabled', false);
            }
            $("#keypadBlank").prop('disabled', false);
            Model.numberButtonsEnabled = true;
        };
        this.DisableKeyPad = () => {
            for (let value = 0; value < Model.numberOfClues; value++) {
                $("#keypad" + value).prop('disabled', true);
            }
            $("#keypadBlank").prop('disabled', true);
            Model.numberButtonsEnabled = false;
        };
        this.EnableAddPencilMarks = () => {
            $('#addPencilMarks').prop('disabled', false);
            Model.addPencilMarksEnabled = true;
        };
        this.DisableAddPencilMarks = () => {
            $('#addPencilMarks').prop('disabled', true);
            Model.addPencilMarksEnabled = false;
        };
        this.EnableClear = () => {
            $('#clear').prop('disabled', false);
            Model.clearEnabled = true;
        };
        this.DisableClear = () => {
            $('#clear').prop('disabled', true);
            Model.clearEnabled = false;
        };
        this.EnableReset = () => {
            $('#reset').prop('disabled', false);
            Model.resetEnabled = true;
        };
        this.DisableReset = () => {
            $('#reset').prop('disabled', true);
            Model.resetEnabled = false;
        };
        this.EnableStep = () => {
            $('#stepButton').prop('disabled', false);
            Model.stepEnabled = true;
        };
        this.DisableStep = () => {
            $('#stepButton').prop('disabled', true);
            Model.stepEnabled = false;
        };
    }
}
