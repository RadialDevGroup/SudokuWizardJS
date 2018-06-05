/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Utilities {
    GetOffsetTop(element) {
        let offset = 0;
        while (element !== null) {
            offset += element.offsetTop;
            element = element.offsetParent;
        }
        return offset;
    }
    GetOffsetLeft(element) {
        let offset = 0;
        while (element !== null) {
            offset += element.offsetLeft;
            element = element.offsetParent;
        }
        return offset;
    }
};

