/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Display */

class Strategy {
    Strategy(action) {
        let command = "jsp/strategyDocs/";

        command += "Strategy.jsp";
        command += "?action=" + action;
        // Send AJAX Request
        $.ajax({
            url: command,
            dataType:'html',
            success:function(data) {
                $("#article").html(data);
            }
        });
    }
}