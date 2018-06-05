/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var SudokuWizard;
window.onload = function() {
    const Model = new model();
    SudokuWizard = new sudokuWizard(Model);
    Model.symbolarray[9] = "123456789";
    Model.symbolarray[12] = "0123456789AB";
    Model.symbolarray[16] = "0123456789ABCDEF";
    const createNumberButtons = new CreateNumberButtons(Model);
    createNumberButtons.CreateNumberButtons();
    
    const createDisplay = new CreateDisplay(Model);
    createDisplay.CreateDisplay();
    
    const dataArrays = new DataArrays(Model);
    dataArrays.CreateDataArrays();
    
    const candidateBackground = new CandidateBackground(Model);
    candidateBackground.CreateCandidateBackgroundColors();
};


