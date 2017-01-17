// Create an event so DOM elements added later to the page can contain late-loaded content
// by triggering the event to re-bind the handler.
(function($){
$(window).bind( "bindloadlate", function( e ) {
    $('img.loadlate').appear(function() {
        var loadlate = $(this).attr('loadlate'),
            widget = $(this).attr('data-widget');

        if (loadlate) {
            $(this).attr('src', loadlate);
            $(this).removeAttr('loadlate');
        }
        if (widget && widget[0] === "/") {
            $(this)
            .removeAttr('data-widget')
                .parent()
                .load(widget);
        }
    });
    $('img.loadlate.hidden').removeClass('hidden');
} );

$(window).trigger( "bindloadlate" );
})(jQuery);
