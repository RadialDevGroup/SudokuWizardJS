/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, SudokuWizard */

class DataArrays {
    constructor(Model) {
        this.CreateDataArrays = () => {
            for (let i = Model.initialValues.length; i >=0; i-- ){
                delete Model.initialValues[i];
                delete Model.currentValues[i];
                delete Model.initialPencilMarks[i];
                delete Model.currentPencilMarks[i];
            }
            this.ResetDataArrays();
        };
        this.ResetDataArrays = () => {
            Model.initialValues = new Array(Model.numberOfClues);
            Model.currentValues = new Array(Model.numberOfClues);
            Model.initialPencilMarks = new Array(Model.numberOfClues);
            Model.currentPencilMarks = new Array(Model.numberOfClues);
            const initialValuePencilMarkString = Model.symbols.substring(0,Model.numberOfClues);
    //        const initialValuePencilMarkString = SudokuWizard.Model.symbols.substring(0,model.numberOfClues);
            for (let i = 0; i < Model.numberOfClues; i++ ){
                const initialValueRow = new Array(Model.numberOfClues);
                const currentValueRow = new Array(Model.numberOfClues);
                const initialValuePencilMarks = new Array(Model.numberOfClues);
                const currentValuePencilMarks = new Array(Model.numberOfClues);
                for (let j = 0; j < Model.numberOfClues; j++ ){
                    initialValueRow[j] = "";
                    currentValueRow[j] = "";
                    initialValuePencilMarks[j] = initialValuePencilMarkString;
                    currentValuePencilMarks[j] = initialValuePencilMarkString;
                }
                Model.initialValues[i] = initialValueRow;
                Model.currentValues[i] = currentValueRow;
                Model.initialPencilMarks[i] = initialValuePencilMarks;
                Model.currentPencilMarks[i] = currentValuePencilMarks;
            }
        };
    }
}

