(function($){
    "use strict";

    $(window).on('facebook_resize', function(event, data){
        if (data.el_id && data.height){
            consoleLog('resize to ' + data.height, 'facebook');
            
            $('#' + data.el_id).height( data.height );
        }
    });
    
    $(window).on('facebook_comment_create', function(event, data){

        consoleLog('comment create', 'facebook');
        $.post('/facebook/_ajax/notify', data);
    });

})(jQuery);
