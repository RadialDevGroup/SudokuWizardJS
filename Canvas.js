/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Utilities, model, SudokuWizard */

class Canvas {
    constructor(Model) {
        const canvas = $("#canvas")[0];
        const context = canvas.getContext("2d");
        
        this.CreateChainSegment = (node1, node2, color) => {
            const epsilon = 0.0001;
            const node1Point = this.CreateNodeShape(node1, color);
            const node2Point = this.CreateNodeShape(node2, color);

            let cntlPointX;
            let cntlPointY;

            const x1 = node1Point.x;
            const y1 = node1Point.y;
            const x2 = node2Point.x;
            const y2 = node2Point.y;

            let IsVerticalLine = () => {
                return Math.abs(x1 - x2) < epsilon;
            };
            let IsHorizontalLine = () => {
                return Math.abs(y1 - y2) < epsilon;
            };
            
            if (IsVerticalLine()) {
                cntlPointX = x1;
                
                const canvasWidth = canvas.width;    
                const column = Math.floor((Model.numberOfClues * x1) / canvasWidth);
                if (column === Model.numberOfClues - 1) {
                    cntlPointX -= Math.abs(y1 - y2) / 10;
                } else {
                    cntlPointX += Math.abs(y1 - y2) / 10;
                }  
                cntlPointY = (y1 + y2) / 2;
            }
            else if (IsHorizontalLine()) {
                cntlPointY = y1;
                
                const canvasHeight = canvas.height;
                const row = Math.floor((Model.numberOfClues * y1) / canvasHeight);
                if (row === Model.numberOfClues - 1) {
                    cntlPointY -= Math.abs(x1 - x2) / 10;
                } else {
                    cntlPointY += Math.abs(x1 - x2) / 10;
                }   
                cntlPointX = (x1 + x2) / 2;

            } else {
                cntlPointY = (y1 + y2) / 2;   
                cntlPointX = (x1 + x2) / 2;
            }
            context.beginPath();
            context.moveTo(x1,y1);
            context.quadraticCurveTo(cntlPointX,cntlPointY,x2,y2);
            context.strokeStyle = color;
            context.stroke();
        };
        this.CreateChainSegments = (nodeIds, nodes, color) => {
            let processANode = (nodePair) => {
                const nodeIDs = nodePair.split(':');
                const nodeID1 = nodeIDs[0];
                const nodeID2 = nodeIDs[1];
                const node1 = GetNodeWithID(nodeID1);
                const node2 = GetNodeWithID(nodeID2);
                this.CreateChainSegment(node1, node2, color);
            };
            let GetNodeWithID = function(nodeID ) {
                for (let i = 0; i < nodes.length; i ++) {
                    const node = nodes[i];
                    const ID = node.getElementsByTagName("ID")[0].childNodes[0].nodeValue;
                    if (ID === nodeID) {
                        return node;
                    }
                }
            }; 
            nodeIds.forEach(
                function(nodePair) {
                    processANode(nodePair);
                }
            );
        };
        this.ClearCanvas = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };
        this.CreateInterchainSegments = (nodes, color) => {
            context.beginPath();
            this.CreateChainSegment(nodes[0], nodes[1], color);
            context.closePath();
        };
        this.AddChainNodes = (nodes, color) => {
            let nodeIDs = new Set();
            context.beginPath();
            for (let i =0; i < nodes.length; i++) {
                const node = nodes[i];
                const thisNodeId = node.getElementsByTagName("ID")[0].childNodes[0].nodeValue;
                const adjacentNodeIdsArray = node.getElementsByTagName("AdjacentID");
                if (adjacentNodeIdsArray === null || adjacentNodeIdsArray.length === 0){
                    continue;
                }
                for (let j = 0; j < adjacentNodeIdsArray.length; j++) {
                    const adjacentNodeIdItem = adjacentNodeIdsArray[j];
                    const adjacentNodeId = adjacentNodeIdItem.childNodes[0].nodeValue;
                    let nodeID1;
                    let nodeID2;
                    if (thisNodeId < adjacentNodeId) {
                        nodeID1 = thisNodeId;
                        nodeID2 = adjacentNodeId;
                    } else {
                        nodeID1 = adjacentNodeId;
                        nodeID2 = thisNodeId;
                    }
                    const nodePair = nodeID1 + ":" + nodeID2;
                    nodeIDs.add(nodePair);
                }
            }
            this.CreateChainSegments(nodeIDs, nodes, color);
            context.closePath();
        };
        this.CreateNodeShape = (node, color) => {
            const points = GetCandidateLocations(node);
            if (points.length === 1){
                return points[0];
            }
            if (points.length === 2) {
                const x1 = points[0].x;
                const y1 = points[0].y;
                const x2 = points[1].x;
                const y2 = points[1].y;
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();

                const nodePoint = new Point((x1 + x2) / 2, (y1+ y2) / 2);
                return nodePoint;
            }
            if (points.length > 2) {
                let sumX = points[0].x;
                let sumY = points[0].y;
                for (let i = 1; i < points.length; i++) {
                    const point = points[i];
                    const pointX = point.x;
                    const pointY = point.y;
                    sumX += pointX;
                    sumY += pointY;
                }
                const avgX = sumX / points.length;
                const avgY = sumY / points.length;

                context.strokeStyle = color;
                for (let i = 0; i < points.length; i++) {
                    const point = points[i];
                    const pointX = point.x;
                    const pointY = point.y;
                    context.moveTo(pointX, pointY);
                    context.lineTo(avgX, avgY);
                    context.stroke();
                }
                const nodePoint = new Point(avgX, avgY);
                return nodePoint;
            }
        };
        const GetCandidateLocations = (node) => {
            const  candidates = node.getElementsByTagName("CandidateID");
            let locations = [];
            const  displaySection = $("#displaySection")[0];
            const  tableNodeLeft = SudokuWizard.GetOffsetLeft(displaySection) - 5;
            const tableNodeTop = SudokuWizard.GetOffsetTop(displaySection) - 5;
            for (let i = 0; i < candidates.length; i++) {
                const candidate = candidates[i];
                const ID = candidate.childNodes[0].nodeValue;
                const candidateID = "#candidate" + ID;
                const displayCandidate = $(candidateID)[0];
                const x = SudokuWizard.GetOffsetLeft(displayCandidate) - tableNodeLeft ;
                const y = SudokuWizard.GetOffsetTop(displayCandidate) - tableNodeTop;
                const point = new Point(x,y);
                locations[locations.length] = point;
            }
            return locations;
        };
        
        class Point { 
            constructor(x, y) {
                this.x = x;
                this.y = y;
            };
        }
    }
}
