(function($) {
jQuery.widget('ui.hover_over_image', {
    CONSTANTS: {
    medium_synopsis_length : 500, // string length
    small_synopsis_length  : 100, // string length
    start_hover_delay  : 500, //[ms]
    end_hover_delay : 500, //[ms]
    fade_in_delay   : 200, //[ms]
    fade_out_delay  : 200, //[ms]
    hover_border_width : 1, //[px] Todo: Hard coded for now; needs to be based on css, but there are issues right now
    faded_top  : -8, //[px] Todo: Hard coded for now; needs to be based on image/faded border size.
    faded_left : -3 //[px] Todo: Hard coded for now; needs to be based on image/faded border size.
    },
/*************************************************/
    _init: function() {
        var constant = this.CONSTANTS;
        var ajax_requests_in_progress = false;
        var data_const   = this.element.attr( 'data-const' );
        var is_grid_view = $( '.article.listo .list' ).hasClass( 'grid' );
        var list_id      = $( '.article.listo' ).attr( 'data-list-id' );
        var list_class   = $( '.article.listo' ).attr( 'data-list-class' );

        // Note on main_parent below:
        // I'm using this for scoping. 'this' is tied to the current
        // function scope. Consider:
        // function foo() {
        //     var foo_this = this;
        //     $some_element.hover(function() { var bar_this = this; }, function() {var how_this = this;});
        // }
        // In the above, foo_this is scoped at foo, while, bar_this and how_this are scoped at $some_element. 
        // Hence the necessity of the following variable.
        var main_parent = this;
        if ( !data_const || !is_grid_view ) {
            return;
        }
    
        /* Typically, images are wrapped around with an <a href ...> ...</a> tag.
         * We would like for our hover information to be associated with an
         * outer element, as follows:
         *  
         * <div class="outer-class"> (out-class could be 'list_item grid' for instance).
         *     <a href="...">
         *         <div class="hover-over-image">
         *             <img src=...>
         *             <div class="ho-faded-border"></div>
         *         </div>
         *     </a>
         *     <div class="ho-hoverover"> ... </div>
         *     <div class="ho-showtimes"> ... </div>
         * </div>
         *
         * This way, the href is not inherited by ho-hoverover or ho-showtimes, but IS
         * inherited by ho-faded-border. ho-faded-border appears as a transparent box
         * with a border on hover, and must be clickable.
         * self_element below finds the nearest outer div tag, and sets up the above.
         */
        var self_element = $(this.element).parent().closest("div");
        var full_width  = 150; //[px]
        var full_height = 200; //[px]
        
        // We are dispatching an ajax call from inside of jQuery.hover() to retrieve
        // data to render. If the users mouse is still over the image, we need a flag
        // to tell us this. If we simply render the hover panel after the ajax call, 
        // the user might have moved away to a different icon and we would be rendering 
        // a hover around the incorrect jacket. If we don't render it immediately on 
        // return, the user will not be able to see the hover until they mouseover 
        // and mouseleave the icon at least once. To handle this, we have the following
        // flag that is set by the .mouseenter() and .mouseleave() methods.
        var mouse_in_div = false;
        var $hoverover;
        self_element.mouseover(
            function() {
                mouse_in_div = true;
                // Check for an existing ajax request or the existence of $hoverover.
                // The mouseover is handled by .hover() if $hoverover exists.
                if ($hoverover || ajax_requests_in_progress) {
                    return;
                }
                var timeout_id = null;
                var fadeout_timer_id = null;
        
                ajax_requests_in_progress = true;
                jQuery.ajax({
                    url: '/widget/hover/_ajax/get_hover_info',
                    type: 'POST',
                    data: {
                        tconst : data_const, 
                        movies_showing_nearby: $('.article.listo .movies-showing-nearby').attr('data-tconsts'),
                        list_class: list_class
                    },
                    beforeSend: window.addClickstreamHeadersToAjax,
                    error: function(message) {ajax_requests_in_progress = false;},
                    success: function(message, textStatus) {
                        ajax_requests_in_progress = false;

                        if (message.status != 200) {
                            return;
                        }
            
                        // The following sets up the different hover panes with the html
                        // content returned, as well as caches this information.
                        $(self_element).append(message.html_title_info);
                        $(self_element).append(message.html_watch_now);

                        if (message.showtimes_nearby) {
                            $('.article.listo').attr('showtimes_nearby', message.showtimes_nearby);
                        }

                        // We associate the border for the image with hover-over-image so
                        // that it is also hyperlinked. See comments early on in this file.
                        $(self_element).find('.hover-over-image').append(message.html_image_border);
            
                        // Enable the ratings widget if the user is logged in.
                        if (message.rating_info.uconst) {
                            $('.ho-hoverover .rating-list').rating({
                                uconst: message.rating_info.uconst,
                                widgetClass: message.rating_info.widget_class,
                                ajaxURL: '/ratings/_ajax/title',
                                starWidth: message.rating_info.star_width,
                                errorMessage: message.rating_info.error_message,
                                images: {
                                    imdb: message.rating_info.images_imdb,
                                    off:  message.rating_info.images_off,
                                    your: message.rating_info.images_your,
                                    del:  message.rating_info.images_del,
                                    info: message.rating_info.images_info
                                }
                            });
                        }
            
                        // Enable the add to watchlist button if we are NOT in our watchlist;
                        // else, enable a remove from watchlist button.
                        if ( list_class.toUpperCase() != 'WATCHLIST' ) {
                            $('.wlb_wrapper', self_element).wlb_lite();
                        } else {
                            // Attach handler and turn on delete buttons
                            var $listo = $(self_element);
                            $('.ho-hoverover .delete-from-watchlist')
                            .click(function() {
                                var $b = $(this);
                                if ($b.hasClass('pending')) {
                                    // Double click; ignore
                                    return;
                                }
                                $b.addClass('pending');
                                var $item = $b.closest('.list_item').fadeTo(0, 0.5);
                                jQuery.ajax({
                                    url: '/list/_ajax/edit',
                                    type: 'POST',
                                    beforeSend: window.addClickstreamHeadersToAjax,
                                    data: {
                                        action: 'delete',
                                        list_item_id: $item.attr('data-list-item-id'),
                                        list_id: list_id,
                                        ref_tag: 'hover',
                                        list_class: "WATCHLIST"
                                    },
                                    error: function() {
                                        $item.fadeTo(0, 1);
                                        $b.removeClass('pending');
                                        // ...and hope the user figures it out
                                    },
                                    success: function() {
                                        $item.fadeTo( 0, 1);
                                        $item.find("img").fadeTo(0,0.1);
                                        $b.removeClass('pending');
                                        $(self_element).find('.ho-faded-border').remove();
                                        $(self_element).find('.ho-hoverover').remove();
                                        $item.html( $item.html() + "<div class='deleted'>Title has been removed from this list.</div>");
                                        $item.addClass('deleted'); // Stop showing delete 
                                    }
                                });
                            });
                        }
            
                        // We need to establish the existence of the hover-over, since it is
                        // added above in append(message.html_title_info).
                        $hoverover = $(self_element).find('.ho-hoverover');
                        // Add appropriate size for hover pane, based on size of synopsis.
                        var synopsis_length = $hoverover.find('.ho-outline').text().length;
                        if (synopsis_length > constant.medium_synopsis_length) {
                            $hoverover.addClass('large-pane');
                        } else if(synopsis_length > constant.small_synopsis_length) {
                            $hoverover.addClass('medium-pane');
                        } else {
                            $hoverover.addClass('small-pane');
                        }
            
                        var $img = $(self_element).find('img');
                        full_width = $img.outerWidth();
                        full_height = $img.outerHeight();
            
                        // Setup the faded border around the image, and 
                        // some default properties.
                        var $faded = $(self_element).find('.ho-faded-border');
                        $faded
                            .css('top',  parseInt(constant.faded_top,10) +'px')
                            .css('left', parseInt(constant.faded_left,10) + 'px')
                            .css('width', parseInt(full_width,10) +'px')
                            .css('height', parseInt(full_height,10) +'px');
                        
                        $faded.addClass('ho-faded-right-straight-edge');
                        $faded.hide();

                        // We are handling the hover as rectangular border for
                        // IE8, as it doesn't support rounded borders/dropshadows.
                        // Also, there's a z-index difference between IE 8 and other
                        // browsers that we're dealing with. See the documentation in
                        // the function fade_in_action for details.
                        if ( jQuery.browser.msie && jQuery.browser.version < 9 ) {
                            $hoverover.addClass('ho-hoverover-msie8');
                            $faded.addClass('ho-faded-border-msie8');
                            var original_z_index = $(self_element).css('z-index');
                            if ( original_z_index == 'auto' ) {
                                original_z_index = '0';
                            }
                            main_parent.original_z_index = parseInt(original_z_index, 10);
                        }
            
                        if (mouse_in_div) {
                            main_parent.fade_in_action({ 
                                timeout_id: timeout_id,
                                fadout_timer_id: fadeout_timer_id,
                                main_parent: main_parent, 
                                $hoverover: $hoverover,
                                $faded: $faded,
                                $jacket: $(self_element) 
                            });
                            timeout_id = null;
                            fadeout_timer_id = null;
                        }

                        timeout_id = null;
                        fadeout_timer_id = null;
            
                        $(self_element).hover (

                            /** In focus **/
                            function(event) {
                                timeout_id =  window.setTimeout( 
                                    function() {
                                        main_parent.fade_in_action({ 
                                            timeout_id: timeout_id,
                                            fadout_timer_id: fadeout_timer_id,
                                            main_parent: main_parent, 
                                            $hoverover: $hoverover,
                                            $faded: $faded,
                                            $jacket: $(self_element) 
                                        });
                                        timeout_id = null;
                                        fadeout_timer_id = null;
                                    },
                                    constant.start_hover_delay );
                            }, // closes in focus
                
                            /** Out of focus **/
                            function(event) {
                                fadeout_timer_id = window.setTimeout(
                                    main_parent.fade_out_action({
                                        timeout_id: timeout_id,
                                        fadeout_timer_id: fadeout_timer_id,
                                        $hoverover: $hoverover,
                                        $faded: $faded,
                                        $jacket: $(self_element),
                                        main_parent: main_parent 
                                    }),
                                    constant.end_hover_delay );
                                } // closes out of focus
                        ); // closes hover
                        $hoverover.mouseover( function() {
                            main_parent.fade_in_action({ 
                                timeout_id: timeout_id,
                                fadout_timer_id: fadeout_timer_id,
                                main_parent: main_parent, 
                                $hoverover: $hoverover,
                                $faded: $faded,
                                $jacket: $(self_element) 
                            });
                            timeout_id = null;
                            fadeout_timer_id = null;
                        });
                    }
                }); // end of ajax
            }
        );
        self_element.mouseout(
            function() { 
                mouse_in_div = false;
            } 
        ); // end self_element.mouseout().
    }, // closes _init().
    /*************************************************/
    /* position_hover:
     * The following are required arguments, and are absolute positions, relative to the document root.
     * jq_container : jQuery object within which we wish to enclose the hover, such as $('.article.listo),
     *              which contains all the elements in the grid).
     * jq_jacket : jQuery object around which we want to position the hover.
     * jq_hover : $(self_element).find('.ho-hoverover')
     * jq_faded-border : $(self_element).find('.ho-faded-border')
     * main_parent : pointer to the main caller parent (this in _init() function scope). Used to get the following:
     * constant : main_parent.CONSTANTS.
     */
    position_hover : function ( args ) {
        var jq_container = args.jq_container;
        var jq_jacket = args.jq_jacket;
        var jq_hover = args.jq_hover;
        var jq_faded = args.jq_faded;
        var jacket = args.jq_jacket.offset();
        var constant = args.constants;
        var parent = args.main_parent;
        var constant = parent.CONSTANTS;

        var otop, oleft;
        var faded_pos_classname = ''; 
        if ( parent.faded_pos_classname ) {
            faded_pos_classname = parent.faded_pos_classname;
        }
        
        var hover_squared_corner = '';
        if ( parent.hover_squared_corner ) {
            hover_squared_corner = parent.hover_squared_corner;
        }
        var new_faded_pos_classname = '';
        var new_hover_squared_corner = '';

        // Ensure hover has minimum height=jq_jacket.outerHeight().
        if ( jq_hover.outerHeight() < jq_jacket.outerHeight() ) {
            jq_hover.css('height', (jq_faded.outerHeight())+'px');//(jq_jacket.outerHeight())+'px');
        }

        var container = args.jq_container.offset();
        var scroll_top = $(document).scrollTop(); // Location of the top edge of the viewable browser window.
        var h_vp = window.innerHeight ? window.innerHeight : $(window).height(); // Height of viewport.
        var container_midpoint = container.left + jq_container.width()/2;
        var bottom_border = Math.min( scroll_top+h_vp, container.top+jq_container.height() );

        if ( jacket.top-scroll_top < 0 ) {
            // Hover below bottom edge of jacket.
            otop = jq_faded.outerHeight()-constant.hover_border_width;
            new_faded_pos_classname = 'bottom-straight-edge top-box-shadow';
        
            if ( jacket.left < container_midpoint ) {
                // Align left edges of jacket and hover.
                oleft = 0;
                new_hover_squared_corner = 'ho-topleft-radius-none top-box-shadow';
            } else {
                // Align right edges of jacket and hover.
                oleft = jq_faded.outerWidth()-jq_hover.outerWidth();
                new_hover_squared_corner = 'ho-topright-radius-none top-box-shadow';
            }
        } else if ( jacket.top+jq_jacket.height() > bottom_border ) {
            // Hover over top edge of jacket.
            otop = -jq_hover.outerHeight()+constant.hover_border_width;
            new_faded_pos_classname = 'top-straight-edge bottom-box-shadow';
        
            if ( jacket.left < container_midpoint ) {
                // Align left edges of jacket and hover.
                oleft = 0;
                new_hover_squared_corner = 'ho-bottomleft-radius-none bottom-box-shadow';
            } else {
                // Align right edges of jacket and hover.
                oleft = jq_faded.outerWidth()-jq_hover.outerWidth();
                new_hover_squared_corner = 'ho-bottomright-radius-none bottom-box-shadow';
            }
        } else if ( jacket.top-scroll_top < bottom_border-jacket.top ) {
            // Hover to left or right of jacket, align top edge.
            otop = 0;
        
            if ( jacket.left < container_midpoint ) {
                // Hover to right of jacket.
                oleft = jq_faded.outerWidth()-constant.hover_border_width;
                new_faded_pos_classname = 'right-straight-edge left-box-shadow';
                new_hover_squared_corner = 'ho-topleft-radius-none left-box-shadow';
            } else {
                // Hover to left of jacket.
                oleft = -jq_hover.outerWidth()+constant.hover_border_width;
                new_faded_pos_classname = 'left-straight-edge right-box-shadow';
                new_hover_squared_corner = 'ho-topright-radius-none right-box-shadow';
            }
        } else {
            // Hover to left or right of jacket, align bottom edge.
            otop = jq_faded.outerHeight()-jq_hover.outerHeight();
        
            if ( jacket.left < container_midpoint ) {
                // Hover to right of jacket.
                oleft = jq_faded.outerWidth()-constant.hover_border_width;
                new_faded_pos_classname = 'right-straight-edge left-box-shadow';
                new_hover_squared_corner = 'ho-bottomleft-radius-none left-box-shadow';
            } else {
               // Hover to left of jacket.
                oleft = -jq_hover.outerWidth()+constant.hover_border_width;
                new_faded_pos_classname = 'left-straight-edge right-box-shadow';
                new_hover_squared_corner = 'ho-bottomright-radius-none right-box-shadow';
            }
        }
        
        jq_faded
            .removeClass(faded_pos_classname)
            .addClass(new_faded_pos_classname);
        parent.faded_pos_classname = new_faded_pos_classname;
        
        jq_hover
            .removeClass(hover_squared_corner)
            .addClass(new_hover_squared_corner);
        parent.hover_squared_corner = new_hover_squared_corner;
        
        // Setup the hover positions. Just forcing 232.0039395 to be 232.
        jq_hover.css('top', Math.round(parseInt(constant.faded_top,10) + otop) + 'px');
        jq_hover.css('left', Math.round(parseInt(constant.faded_left,10) + oleft) + 'px');
    }, // closes position_hover
    /*************************************************/
    /* fade_in_action:
     * args: 
     *     timeout_id: timeout_id
     *     fadout_timer_id: fadeout_timer_id
     *     main_parent: main_parent => pointer to the main caller parent (this in _init() function scope).
     *     $hoverover: $hoverover
     *     $faded: $faded
     *     $jacket: $(self_element)
     */
    fade_in_action : function( args ) {
        var timeout_id = args.timeout_id;
        var fadeout_timer_id = args.fadeout_timer_id;
        var main_parent = args.main_parent;
        var $hoverover = args.$hoverover;
        var $faded = args.$faded;
        var $jacket = args.$jacket;
        var constant = main_parent.CONSTANTS;

        // IE 8 z-index issue. In IE 8, peers in the dom model do not recognize z-indices of peer-children
        // in the heirarchy. For example, consider peers A (children A.a, A.b) and B (children B.a,B.b).
        // If A and B have the same z-index, then A does not honor B.a, or B.b's z-index; and vice-versa.
        // If A's z-index is greater than B, then B will yield to A.a and B.b. Hence, in a field of peers
        // (such as the jackets in a grid view), we need to raise the z-index of a jacket on hover. That
        // way, the jacket's child (the hover pane) will appear above the jackets' peers (neighboring jackets).
        // But once we're no longer showing the hover pane, we need to reset the z-index of the parent
        // to the same level as the neighbors. The reset happens in the fade_out_action, further below.
        if ( jQuery.browser.msie && jQuery.browser.version < 9 ) {
            $jacket.css('z-index', (1+main_parent.original_z_index));
        }

        if (timeout_id) {
            window.clearTimeout(timeout_id);
        }
        if (fadeout_timer_id) {
            window.clearTimeout(fadeout_timer_id);
        }
        if ($hoverover) {
            main_parent.position_hover({jq_container: $('.article.listo'), jq_jacket: $jacket, 
               jq_hover: $hoverover, jq_faded : $faded, main_parent: main_parent});
            $hoverover.fadeIn(constant.fade_in_delay);
            $faded.fadeIn(constant.fade_in_delay);
        }
    },
    /*************************************************/
    /* fade_out_action:
     * args: 
     *     timeout_id: timeout_id
     *     main_parent: main_parent => pointer to the main caller parent (this in _init() function scope).
     *     $hoverover: $hoverover
     *     $faded: $faded
     */
    fade_out_action : function( args ) {
        var timeout_id = args.timeout_id;
        var fadeout_timer_id = args.fadeout_timer_id;
        var $hoverover = args.$hoverover;
        var $faded = args.$faded;
        var $jacket = args.$jacket;
        var main_parent = args.main_parent;
        var constant = main_parent.CONSTANTS;

        if (timeout_id) {
            window.clearTimeout(timeout_id);
        }
        if (fadeout_timer_id) {
            window.clearTimeout(fadeout_timer_id);
        }
        if ($hoverover) { 
            $hoverover.fadeOut(constant.fade_out_delay);
            $faded.fadeOut(constant.fade_out_delay);
            // IE 8 z-index issue. Restoring the z-index back to the original value. See comments in fade_in_action.
            if ( jQuery.browser.msie && jQuery.browser.version < 9 ) {
                $jacket.css('z-index', main_parent.original_z_index);
            }
        }
    }
}); // closes jQuery.widget().
})(jQuery);
