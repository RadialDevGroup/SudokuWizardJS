/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global model */

class SdkFormat {
    SdkFormat() {
        const command = "jsp/sdk/sdkFormat.jsp";
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