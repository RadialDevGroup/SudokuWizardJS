/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Display */

class SetValuesOnDisplay {
    constructor (Model) {
        this.NumberPadClicked = (id) => {
            const keypad = $("#" + id)[0];
            keypad.style.backgroundColor = "blue";
            Model.selectedValue = keypad.value;

            if (Model.prevKeypadId !== "") {
                const prevKeypad = $("#" + Model.prevKeypadId)[0];
                prevKeypad.style.backgroundColor = "white";
            }
            Model.prevKeypadId = id;
        };

        this.CanvasClicked = (event) => {
            const buttonStateControl = new ButtonStateControl(Model);
            buttonStateControl.EnableAddPencilMarks();
            buttonStateControl.EnableClear();

            const canvas = $("#canvas")[0];
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const row = Math.floor((Model.numberOfClues * y) / canvasHeight);
            const column = Math.floor((Model.numberOfClues * x) / canvasWidth);
            const finalValueID = "#finalValuerow" + row + "column" + column;
            const finalValue = $(finalValueID)[0];
            const display = new Display(Model);
            if (Model.prevKeypadId !== "keypadBlank") {
                display.TurnOffCandidateTable(row, column);
                display.TurnOnFinalValue(row, column);
            } else {
                display.TurnOffFinalValue(row, column);
            }
            finalValue.innerHTML = Model.selectedValue;
            finalValue.style.color = Model.initialValueColor;

            Model.initialValues[row][column] = Model.selectedValue;
            Model.currentValues[row][column] = Model.selectedValue;
        };
    }
}

