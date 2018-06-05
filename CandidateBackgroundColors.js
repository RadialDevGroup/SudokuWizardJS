/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global model */
class CandidateBackground {
    constructor (Model) {
        this.CreateCandidateBackgroundColors = () => {
            for (let i = Model.candidateBackgroundColors.length; i >= 0; i-- ){
                delete Model.candidateBackgroundColors[i];
            }
            this.ResetCandidateBackgroundArrays();
        };
        this.ResetCandidateBackgroundArrays = () => {
            const initColor = Model.initialColor;
            const background = "linear-gradient(" + initColor + " 0%, " + initColor + " 100%)";
            const arraySize = Model.numberOfClues * Model.numberOfClues * Model.numberOfClues;
            Model.candidateBackgroundColors = new Array(arraySize);
            for (let row = 0; row < Model.numberOfClues; row++ ){
                for (let column = 0; column < Model.numberOfClues; column++ ){
                    for (let value = 0; value < Model.numberOfClues; value++ ){
                        const hash  = (((row * Model.numberOfClues) + column) * Model.numberOfClues) + value;
                        Model.candidateBackgroundColors[hash] = background;
                    }
                }
            }
        };
        this.AddCandidateBackgroundColor = (hash, newColor) =>  {
            const currentBackground = Model.candidateBackgroundColors[hash];
            const parts = currentBackground.split('%,');

            let newBackground = "linear-gradient(";

            if (currentBackground.indexOf(Model.initialColor) === -1) {
                const sectionsize = 100 / ((parts.length / 2) + 1);
                let currentpointer = 0;
                let nextpointer = sectionsize;
                for (let i = 0; i < parts.length; i += 2) {
                    const part = parts[i];
                    const firstindex = part.indexOf("rgb");
                    const lastindex = part.lastIndexOf(" ");
                    const oldcolor = part.substring(firstindex, lastindex);
                    newBackground += oldcolor + " " + currentpointer + "%, " + 
                                     oldcolor + " " + nextpointer + "%, ";

                    currentpointer += sectionsize;
                    nextpointer += sectionsize;       
                }
                newBackground += newColor + " " + currentpointer + "%, " + 
                                 newColor + " 100%)"; 
            } else {
                newBackground += newColor + " 0%, " + newColor + " 100%)";
            }
            Model.candidateBackgroundColors[hash] = newBackground;
            return newBackground;
        };
        this.ResetCandidateBackgroundColor = (hash) => {
            let background  = "linear-gradient(";
            const initColor = Model.initialColor;
            background += initColor + " 0%, " + initColor + " 100%)";
            Model.candidateBackgroundColors[hash] = background;
            return background;
        };
    }
}
