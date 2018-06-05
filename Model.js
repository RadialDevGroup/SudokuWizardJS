/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class model{
    constructor () {
        this.symbols = "123456789";
        this.symbolarray =  [];
        this.blank = "";
        this.numberOfClues = 9;
        this.numberOfRowsPerArea = 3;
        this.numberOfColumnsPerArea = 3;
        this.initialColor = "white";
        this.interchainColor = "black";
        this.initialValueColor = "red";
        this.subsequentValueColor = "blue";
        this.prevKeypadId = "";
        this.selectedValue = "";
        this.initialValues = [];
        this.currentValues = [];
        this.initialPencilMarks = [];
        this.currentPencilMarks = [];
        this.lastCandidatesHighlighted = [];
        this.clearDisplayData = null;
        this.stepResultsUpdateDisplayOnly = [];
        this.stepResultsUpdateMatrixAndDisplay = [];

        this.stepResultsUpdateDisplayOnly0 = "";
        this.currentDocs = "";

        this.numberButtonsEnabled = true;
        this.addPencilMarksEnabled = false;
        this.clearEnabled = false;
        this.resetEnabled = false;
        this.stepEnabled = false;
        this.displayIsCleared = true;

        this.candidateBackgroundColors = [];
    }
}
