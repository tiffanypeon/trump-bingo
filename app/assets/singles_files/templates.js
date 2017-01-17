this["PGM"] = this["PGM"] || {};
this["PGM"]["JST"] = this["PGM"]["JST"] || {};

this["PGM"]["JST"]["ads/slot"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="dfp-ad dfp-ad-' +
__e(slot.slotName) +
' ' +
__e( typeof extraClass !== 'undefined' ? extraClass : '') +
'" data-tracklabel="Ad Click"';
 if ('undefined' !== typeof prepend) { ;
__p += ' data-prepend="' +
((__t = ( prepend )) == null ? '' : __t) +
'"';
 } ;
__p += '>\n<script type="application/json">\n{"slot": ' +
((__t = ( JSON.stringify(slot) )) == null ? '' : __t) +
', "extraTargeting": ' +
((__t = ( typeof extraTargeting === 'undefined' ? 'null' : JSON.stringify(extraTargeting) )) == null ? '' : __t) +
'}\n</script>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["embeds/gallery"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<figure class="embedded-content--gallery__media embedded-content--gallery__media--' +
((__t = ( media.orientation )) == null ? '' : __t) +
'" data-lightbox-content-path="' +
((__t = ( path )) == null ? '' : __t) +
'" data-lightbox-tracking-label="Inline">\n    <div class="lightbox-cta__wrapper">\n        <img class="embedded-image__image embedded-content--gallery__image--' +
((__t = ( media.orientation )) == null ? '' : __t) +
' media__image" src="' +
((__t = ( media.src )) == null ? '' : __t) +
'">\n        <span class="lightbox-cta"><i class="fa fa-camera"></i> View Slideshow</span>\n    </div>\n    <figcaption class="media__details-text embedded-image__details-text">\n        <div class="media__caption">\n            <span class="embedded-content--gallery__cta">SEE MORE:</span>\n            ' +
((__t = ( title )) == null ? '' : __t) +
'\n            </div>\n    </figcaption>\n</figure>\n';

}
return __p
};

this["PGM"]["JST"]["embeds/image"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<figure>\n    <img class="embedded-image__image" ';
 if (caption) { ;
__p += 'alt="' +
__e( caption ) +
'"';
 };
__p += 'src="' +
((__t = ( path )) == null ? '' : __t) +
'">\n    ';
 if (caption || credit) { ;
__p += '\n    <figcaption class="embedded-image__details-text">\n        ';
 if (credit) { ;
__p += '\n            <div class="media__credit">' +
((__t = ( credit )) == null ? '' : __t) +
'</div>\n        ';
 } ;
__p += '\n        ';
 if (caption) { ;
__p += '\n            <div class="media__caption">' +
((__t = ( caption )) == null ? '' : __t) +
'</div>\n        ';
 } ;
__p += '\n    </figcaption>\n    ';
 } ;
__p += '\n</figure>\n';

}
return __p
};

this["PGM"]["JST"]["embeds/readmore"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<a class="readmore" title="' +
__e( title ) +
'" href="' +
((__t = ( path )) == null ? '' : __t) +
'">\n    ';
 if (
        'undefined' !== typeof media &&
        'undefined' !== typeof media.url
    ) { ;
__p += '\n        <figure class="readmore__media readmore__media--' +
((__t = ( media.orientation )) == null ? '' : __t) +
'">\n            <img class="readmore__image readmore__image--' +
((__t = ( media.orientation )) == null ? '' : __t) +
'" src="' +
((__t = (  media.url )) == null ? '' : __t) +
'" alt="' +
__e( media.caption ) +
'">\n        </figure>\n    ';
 } ;
__p += '\n    <div class="readmore__text">\n        <h4 class="readmore__cta">' +
((__t = ( verb )) == null ? '' : __t) +
' More</h4>\n        <h2 class="readmore__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h2>\n    </div>\n</a>\n';

}
return __p
};

this["PGM"]["JST"]["example-one"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'PGM Example One<br/>\n' +
((__t = ( foo )) == null ? '' : __t) +
'\n';

}
return __p
};

this["PGM"]["JST"]["hybrid_player/mainView"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="hybrid-player__header">\n    <h2>' +
((__t = ( title )) == null ? '' : __t) +
'</h2>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["hybrid_player/player-youtube"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="hybrid-player-video__container">\n    <div class="hybrid-player-video__player-instance">\n    </div>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["hybrid_player/player"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div\n    class="hybrid-player-video__container"\n    style="background-image:url(' +
((__t = ( media.image.fullPath )) == null ? '' : __t) +
')"\n></div>\n<h3 class="hybrid-player-video__title">\n    ' +
((__t = ( title )) == null ? '' : __t) +
'\n</h3>\n';

}
return __p
};

this["PGM"]["JST"]["hybrid_player/playlist"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="hybrid-player-playlist__container">\n    <ol class="hybrid-player-playlist__items">\n    ';
 _.each(items, function(item) { ;
__p += '\n        <li class="hybrid-player-playlist__item">\n            <div\n                class="hybrid-player-playlist__item-thumbnail-image"\n                style="background-image: url(' +
((__t = ( item.media.image.fullPath )) == null ? '' : __t) +
')"\n            ></div>\n            ' +
((__t = ( item.title )) == null ? '' : __t) +
'\n        </li>\n    ';
 }); ;
__p += '\n    </ol>\n</div>\n<button disabled class="hybrid-player-playlist__nav hybrid-player-playlist__nav--previous">Previous</button>\n<button class="hybrid-player-playlist__nav hybrid-player-playlist__nav--next">Next</button>\n';

}
return __p
};

this["PGM"]["JST"]["left_rail/left_rail"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="left-rail__title">\n    ' +
((__t = ( title )) == null ? '' : __t) +
'\n</div>\n<div class="js-rail-items"></div>\n';

}
return __p
};

this["PGM"]["JST"]["left_rail/rail_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<progress class="rail-item__progress" value max></progress>\n<a class="rail-item__link ';
 if( mediaType === 'video') {;
__p += 'rail-item__link--play-button';
};
__p += '" href="' +
((__t = (path)) == null ? '' : __t) +
'">\n    <img class="rail-item__image" src="' +
((__t = (media)) == null ? '' : __t) +
'" alt="' +
__e(title) +
'" />\n</a>\n';
 if( categoryName || publishDate ) { ;
__p += '\n    <p class="rail-item__meta">\n        <a href="' +
((__t = (categoryPath)) == null ? '' : __t) +
'" class="rail-item__category category-link">' +
((__t = ( categoryName )) == null ? '' : __t) +
'</a>\n        <span class="rail-item__date date">' +
((__t = ( publishDate )) == null ? '' : __t) +
'</span>\n    </p>\n';
 } ;
__p += '\n<p class="rail-item__title">\n    <a class="rail-item__link" href="' +
((__t = (path)) == null ? '' : __t) +
'">' +
((__t = (title)) == null ? '' : __t) +
'</a>\n</p>\n';

}
return __p
};

this["PGM"]["JST"]["left_rail/topic_block"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<header class="rail-topic-block__header">\n    <h3 class="rail-topic-block__title">' +
((__t = (title)) == null ? '' : __t) +
'</h3>\n</header>\n<ul class="rail-topic-block__items">\n    ';
_.each(items.slice(0, 3), function(item, i) { ;
__p += '\n        <li class="rail-topic-block__item">\n            <a href="' +
((__t = ( item.path )) == null ? '' : __t) +
'" class="rail-topic-block__link">\n                ';
 if (i === 0) { ;
__p += '\n                    <img class="rail-topic-block__image" src="' +
((__t = ( item.media )) == null ? '' : __t) +
'" alt="' +
__e( item.title ) +
'">\n                ';
 } ;
__p += '\n                <p class="rail-topic-block__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</p>\n            </a>\n        </li>\n    ';
 }); ;
__p += '\n</ul>\n';

}
return __p
};

this["PGM"]["JST"]["longform/promo"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var single = items.length === 1 ;
__p += '\n<h3 class="longform-rail-promo__headline flap-headline">' +
((__t = ( title ? title : 'Editor&rsquo;s Recommendation' )) == null ? '' : __t) +
'</h3>\n\n<div class="longform-rail-promo__items' +
((__t = ( single ? '' : ' longform-rail-promo__items--multiple' )) == null ? '' : __t) +
'">\n\n';
 _.each(items, function(item, i) { ;
__p += '\n    <article class="longform-rail-promo__item longform-rail-promo__item--' +
((__t = ( single ? 'single' : 'multiple' )) == null ? '' : __t) +
'' +
((__t = ( i === 0 ? ' longform-rail-promo__item--first' : '' )) == null ? '' : __t) +
'">\n\n        <a class="longform-rail-promo__item-title-link" href="' +
((__t = ( item.path )) == null ? '' : __t) +
'">\n            ';
 if (item.media) { ;
__p += '\n            <figure class="longform-rail-promo__item-media">\n                <img class="longform-rail-promo__item-image" src="' +
((__t = ( item.media.path )) == null ? '' : __t) +
'" alt>\n            </figure>\n            ';
 } ;
__p += '\n\n            <h2 class="longform-rail-promo__item-title' +
((__t = ( single ? ' longform-rail-promo__item-title--single' : '' )) == null ? '' : __t) +
'">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h2>\n        </a>\n\n        ';
 if (single) { ;
__p += '\n        <p class="longform-rail-promo__item-deck">' +
((__t = ( item.deck )) == null ? '' : __t) +
'</p>\n        <a class="longform-rail-promo__link" href="' +
((__t = ( item.path )) == null ? '' : __t) +
'">Read More</a>\n        ';
 } ;
__p += '\n    </article>\n';
 }) ;
__p += '\n\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-chart"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h4>\n<h5 class="capsule__deck">' +
((__t = ( deck )) == null ? '' : __t) +
'</h5>\n<div class="capsule__body capsule--chart__body">\n    <ol>\n    ';
 _.each(items, function(item, index) { ;
__p += '\n        <li class="capsule__item capsule__item--' +
((__t = ( index )) == null ? '' : __t) +
' capsule--chart__item">\n            <h3 class="capsule__item-title capsule--chart__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n            <div class="capsule--chart__item-data">' +
((__t = ( item.data )) == null ? '' : __t) +
'</div>\n        </li>\n    ';
 }); ;
__p += '\n    </ol>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h4>\n<div class="capsule__body">\n    ';
 _.each(currentPageItems, function(item, index) { ;
__p += '\n        <article class="capsule__item capsule__item--' +
((__t = ( index )) == null ? '' : __t) +
' capsule--list__item">\n            <a href="' +
((__t = ( item.url )) == null ? '' : __t) +
'">\n                <figure class="capsule__item-figure capsule__item-figure--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule__item-figure--' +
((__t = ( type )) == null ? '' : __t) +
' capsule--list__item-figure">\n                    <img class="capsule__item-image capsule__item-image--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
'" src="' +
((__t = ( index === 0 ? item.media.src : item.media.thumbnail )) == null ? '' : __t) +
'">\n                </figure>\n                <h3 class="capsule__item-title capsule--list__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n            </a>\n        </article>\n    ';
 }); ;
__p += '\n    ';
 if (totalPages > 1) { ;
__p += '\n    <nav class="capsule__nav">\n        <span class="capsule__current-page">\n            ' +
((__t = ( currentPage )) == null ? '' : __t) +
'/' +
((__t = ( totalPages )) == null ? '' : __t) +
'\n        </span>\n        <span class="capsule__nav-button capsule__nav-button--prev"></span>\n        <span class="capsule__nav-button capsule__nav-button--next"></span>\n    </nav>\n    ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-media"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h4>\n<div class="capsule__body capsule--media__body">\n    ';
 _.each(currentPageItems, function(item) { ;
__p += '\n        <article class="capsule__item">\n            <a href="' +
((__t = ( item.url )) == null ? '' : __t) +
'">\n                <figure class="capsule__item-figure capsule__item-figure--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule__item-figure--' +
((__t = ( type )) == null ? '' : __t) +
'">\n                    <img class="capsule__item-image capsule__item-image--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
'" src="' +
((__t = ( item.media.src )) == null ? '' : __t) +
'" />\n                </figure>\n                <h3 class="capsule__item-title capsule--media__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n            </a>\n        </article>\n    ';
 }); ;
__p += '\n    ';
 if (totalPages > 1) { ;
__p += '\n    <nav class="capsule__nav">\n        <span class="capsule__current-page">\n            ' +
((__t = ( currentPage )) == null ? '' : __t) +
'/' +
((__t = ( totalPages )) == null ? '' : __t) +
'\n        </span>\n        <span class="capsule__nav-button capsule__nav-button--prev"></span>\n        <span class="capsule__nav-button capsule__nav-button--next"></span>\n    </nav>\n    ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-multiple"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h4>\n<div class="capsule__body">\n    ';
 _.each(items, function(item, index) { ;
__p += '\n        <article class="capsule__item capsule__item--' +
((__t = ( index )) == null ? '' : __t) +
' capsule--multiple__item">\n            <a href="' +
((__t = ( item.url )) == null ? '' : __t) +
'">\n                <figure class="capsule__item-figure capsule__item-figure--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule__item-figure--' +
((__t = ( type )) == null ? '' : __t) +
' capsule--multiple__item-figure">\n                    <img class="capsule__item-image capsule__item-image--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
'" src="' +
((__t = ( index === 0 ? item.media.src : item.media.thumbnail )) == null ? '' : __t) +
'">\n                </figure>\n                <h3 class="capsule__item-title capsule--multiple__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n            </a>\n        </article>\n    ';
 }); ;
__p += '\n    ';
 if (linkUrl && linkText) { ;
__p += '\n        <article class="capsule__item"><a href="' +
((__t = ( linkUrl )) == null ? '' : __t) +
'" class="capsule__more">' +
((__t = ( linkText )) == null ? '' : __t) +
'</a></article>\n    ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-pushdown"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title capsule--horizontal__title">\n    ' +
((__t = ( title )) == null ? '' : __t) +
'\n    ';
 if (linkUrl && linkText) { ;
__p += '\n        <a href="' +
((__t = ( linkUrl )) == null ? '' : __t) +
'" class="capsule--horizontal__cta">' +
((__t = ( linkText )) == null ? '' : __t) +
'</a></span>\n    ';
 } ;
__p += '\n</h4>\n<div class="capsule__body  capsule--horizontal__body">\n    ';
 _.each(items, function(item, index) { ;
__p += '\n        <article class="capsule__item capsule__item--' +
((__t = ( index )) == null ? '' : __t) +
' capsule--multiple__item  capsule--horizontal__item">\n            <a href="' +
((__t = ( item.url )) == null ? '' : __t) +
'">\n                <figure class="capsule__item-figure capsule__item-figure--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule__item-figure--' +
((__t = ( type )) == null ? '' : __t) +
' capsule--multiple__item-figure">\n                    <img class="capsule__item-image capsule__item-image--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
'" src="' +
((__t = (item.media.src)) == null ? '' : __t) +
'">\n                </figure>\n                <h3 class="capsule__item-title capsule--horizontal__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n            </a>\n        </article>\n    ';
 }); ;
__p += '\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-swipe-chart"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h4>\n<h5 class="capsule__deck">' +
((__t = ( deck )) == null ? '' : __t) +
'</h5>\n<div class="capsule__body capsule--chart__body">\n    <ol class="capsule--swipe__body-container">\n        ';
 _.each(items.slice(0,10), function(item) { ;
__p += '\n            <li class="capsule__item capsule--chart__item capsule--swipe__item">\n                <h3 class="capsule__item-title capsule--chart__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n                <div class="capsule--chart__item-data">' +
((__t = ( item.data )) == null ? '' : __t) +
'</div>\n            </li>\n        ';
 }); ;
__p += '\n        ';
 if (linkUrl && linkText) { ;
__p += '\n            <li class="capsule__item capsule--swipe__item capsule--swipe__item--more"><a href="' +
((__t = ( linkUrl )) == null ? '' : __t) +
'" class="capsule__more capsule--swipe__more">' +
((__t = ( linkText )) == null ? '' : __t) +
'</a></li>\n        ';
 } ;
__p += '\n    </ol>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-swipe-pushdown"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title  capsule--horizontal__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h4>\n<div class="capsule__body  capsule--horizontal__body">\n    <div class="capsule--swipe__body-container">\n        ';
 _.each(items.slice(0,10), function(item) { ;
__p += '\n            <article class="capsule__item capsule--horizontal__item capsule--swipe__item">\n                <a href="' +
((__t = ( item.url )) == null ? '' : __t) +
'">\n                    <figure class="capsule__item-figure capsule__item-figure--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule__item-figure--' +
((__t = ( type )) == null ? '' : __t) +
'">\n                        <img class="capsule__item-image capsule__item-image--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule--swipe__item-image" src="' +
((__t = ( item.media.src )) == null ? '' : __t) +
'" />\n                    </figure>\n                    <h3 class="capsule__item-title capsule--swipe__item-title capsule--horizontal__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n                </a>\n            </article>\n        ';
 }); ;
__p += '\n        ';
 if (linkUrl && linkText) { ;
__p += '\n            <article class="capsule__item capsule--swipe__item capsule__item--more"><a href="' +
((__t = ( linkUrl )) == null ? '' : __t) +
'" class="capsule--horizontal__cta">' +
((__t = ( linkText )) == null ? '' : __t) +
'</a></article>\n        ';
 } ;
__p += '\n    </div>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["topic_index/capsule-swipe"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4 class="capsule__title">' +
((__t = ( title )) == null ? '' : __t) +
'</h4>\n<div class="capsule__body">\n    <div class="capsule--swipe__body-container">\n        ';
 _.each(items.slice(0,10), function(item) { ;
__p += '\n            <article class="capsule__item capsule--swipe__item">\n                <a href="' +
((__t = ( item.url )) == null ? '' : __t) +
'">\n                    <figure class="capsule__item-figure capsule__item-figure--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule__item-figure--' +
((__t = ( type )) == null ? '' : __t) +
'">\n                        <img class="capsule__item-image capsule__item-image--' +
((__t = ( item.media.orientation )) == null ? '' : __t) +
' capsule--swipe__item-image" src="' +
((__t = ( item.media.src )) == null ? '' : __t) +
'" />\n                    </figure>\n                    <h3 class="capsule__item-title capsule--swipe__item-title">' +
((__t = ( item.title )) == null ? '' : __t) +
'</h3>\n                </a>\n            </article>\n        ';
 }); ;
__p += '\n        ';
 if (linkUrl && linkText) { ;
__p += '\n            <article class="capsule__item capsule--swipe__item capsule--swipe__item--more"><a href="' +
((__t = ( linkUrl )) == null ? '' : __t) +
'" class="capsule__more capsule--swipe__more">' +
((__t = ( linkText )) == null ? '' : __t) +
'</a></article>\n        ';
 } ;
__p += '\n    </div>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["chart/search_result_message"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p class="search-results__message">' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n';

}
return __p
};

this["PGM"]["JST"]["chart/search_results"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 for (var ix = 0; ix < rows.length; ix++) { ;
__p += '\n    ';
 if (ix === 0) { ;
__p += '\n        <article class="search-result search-result-1 chart-row" data-hovertracklabel="Song Hover-' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'">\n            <div class="search-result__rank chart-row__rank">' +
((__t = ( (ix + 1) )) == null ? '' : __t) +
'</div>\n            <div class="search-result__image chart-row__image"';
 if (rows[ix].image) { ;
__p += ' style="background-image:url(' +
((__t = ( rows[ix].image )) == null ? '' : __t) +
');"';
 } ;
__p += '></div>\n            <div class="search-result__details chart-row__title">\n                <time class="search-result__date">' +
((__t = ( convertedDate )) == null ? '' : __t) +
'</time>\n                <h2 class="search-result__song chart-row__song">' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'</h2>\n                <h3 class="search-result__artist-name chart-row__artist">\n                <a class="search-result-artist-link chart-row__link" href="/' +
((__t = ( rows[ix].artist_path )) == null ? '' : __t) +
'" data-tracklabel="artist ' +
__e( (ix + 1) ) +
' ' +
__e( rows[ix].bmdb_artistname ) +
'">' +
((__t = ( rows[ix].bmdb_artistname )) == null ? '' : __t) +
'</a>\n                </h3>\n            </div>\n            <div class="search-result__social-share social-shares">\n                <a class="social-share social-share-twitter" rel="popup" data-width="400" data-height="450" data-tracklabel="twitter share archive search ' +
__e( rows[ix].bmdb_artistname ) +
'" href="https://twitter.com/intent/tweet?url=' +
((__t = ( archiveURL )) == null ? '' : __t) +
'/' +
((__t = ( date )) == null ? '' : __t) +
'&text=' +
((__t = ( rows[ix].bmdb_artistname )) == null ? '' : __t) +
'+was+No.1+on+' +
((__t = ( convertedDate )) == null ? '' : __t) +
'&via=Billboard">\n                    <i class="fa fa-twitter"></i>\n                </a>\n            </div>\n        </article>\n    ';
 } else if (ix === 1) { ;
__p += '\n        <div class="search-result-wrap">\n            <article class="search-result search-result-2 chart-row" data-hovertracklabel="Song Hover-' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'">\n                <div class="search-result__rank chart-row__rank">' +
((__t = ( (ix + 1) )) == null ? '' : __t) +
'</div>\n                <div class="search-result__image chart-row__image"';
 if (rows[ix].image) { ;
__p += ' style="background-image:url(' +
((__t = ( rows[ix].image )) == null ? '' : __t) +
');"';
 } ;
__p += '></div>\n                <div class="search-result__details chart-row__title">\n                    <h2 class="search-result__song chart-row__song">' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'</h2>\n                    <h3 class="search-result__artist-name chart-row__artist">\n                    <a class="search-result-artist-link chart-row__link" href="/' +
((__t = ( rows[ix].artist_path )) == null ? '' : __t) +
'" data-tracklabel="artist ' +
((__t = ( (ix + 1) )) == null ? '' : __t) +
' ' +
((__t = ( rows[ix].bmdb_artistname )) == null ? '' : __t) +
'">' +
((__t = ( rows[ix].bmdb_artistname )) == null ? '' : __t) +
'</a>\n                    </h3>\n                </div>\n            </article>\n    ';
 } else if (ix === 2) { ;
__p += '\n            <article class="search-result search-result-3 chart-row" data-hovertracklabel="Song Hover-' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'">\n                <div class="search-result__rank chart-row__rank">' +
((__t = ( (ix + 1) )) == null ? '' : __t) +
'</div>\n                <div class="search-result__image chart-row__image"';
 if (rows[ix].image) { ;
__p += ' style="background-image:url(' +
((__t = ( rows[ix].image )) == null ? '' : __t) +
');"';
 } ;
__p += '></div>\n                <div class="search-result__details chart-row__title">\n                    <h2 class="search-result__song chart-row__song">' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'</h2>\n                    <h3 class="search-result__artist-name chart-row__artist">\n                    <a class="search-result-artist-link chart-row__link" href="/' +
((__t = ( rows[ix].artist_path )) == null ? '' : __t) +
'" data-tracklabel="artist ' +
__e( (ix + 1) ) +
' ' +
__e( rows[ix].bmdb_artistname ) +
'">' +
((__t = ( rows[ix].bmdb_artistname )) == null ? '' : __t) +
'</a>\n                    </h3>\n                </div>\n            </article>\n        </div>\n    ';
 } else { ;
__p += '\n        <article class="search-result search-result-' +
((__t = ( (ix + 1) )) == null ? '' : __t) +
' search-results-4up chart-row" data-hovertracklabel="Song Hover-' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'">\n            <div class="search-result__rank chart-row__rank">' +
((__t = ( (ix + 1) )) == null ? '' : __t) +
'</div>\n            <div class="search-result__image chart-row__image"';
 if (rows[ix].image) { ;
__p += ' style="background-image:url(' +
((__t = ( rows[ix].image )) == null ? '' : __t) +
');"';
 } ;
__p += '></div>\n            <div class="search-result__details chart-row__title">\n                <h2 class="search-result__song chart-row__song">' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'</h2>\n                <h3 class="search-result__artist-name chart-row__artist">\n                    <a class="search-result-artist-link chart-row__link" href="/' +
((__t = ( rows[ix].artist_path )) == null ? '' : __t) +
'" data-tracklabel="artist ' +
__e( (ix + 1) ) +
' ' +
__e( rows[ix].bmdb_artistname ) +
'">' +
((__t = ( rows[ix].bmdb_artistname )) == null ? '' : __t) +
'</a>\n                </h3>\n            </div>\n        </article>\n    ';
 } ;
__p += '\n';
 } ;
__p += '\n<a class="search-result__page-link" href="' +
((__t = ( archiveURL )) == null ? '' : __t) +
'/' +
((__t = ( date )) == null ? '' : __t) +
'" data-tracklabel="view the full chart">View the Full Chart</a>\n';

}
return __p
};

this["PGM"]["JST"]["chart/spotify/footer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Listen to the\n<a class="ye-chart__item-spotify-branding-link js-spotify-spotifyUrl" href="javascript:void(0);" data-href="' +
__e(spotifyUrl) +
'">\n    <span class="ye-chart__item-spotify-branding">' +
((__t = (footerType)) == null ? '' : __t) +
'</span> on <span class="ye-chart__item-spotify-branding"><i class="chart-row__icon fa fa-spotify"></i> Spotify</span>\n</a>\n';

}
return __p
};

this["PGM"]["JST"]["chart/spotify/preview"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="js-spotify-preview ' +
((__t = ( playing ? 'is-playing' : '' )) == null ? '' : __t) +
'">\n    Preview <i class="fa fa-' +
((__t = ( playing ? 'pause' : 'play' )) == null ? '' : __t) +
'"></i>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["chart/twi_birthday"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 for (var ix = 0; ix < rows.length; ix++) { ;
__p += '\n<div class="twi-result info-module__section">\n    <div class="twi-result__rank info-module__rank">' +
((__t = ( (ix + 1) )) == null ? '' : __t) +
'</div>\n    <div class="info-module__image"';
 if (rows[ix].image) { ;
__p += ' style="background-image:url(' +
((__t = ( rows[ix].image )) == null ? '' : __t) +
');"';
 } ;
__p += '></div>\n    <div class="info-module__details">\n        <h2 class="info-module__song">' +
((__t = ( rows[ix].bmdb_title )) == null ? '' : __t) +
'</h2>\n        <h3 class="info-module__artist">' +
((__t = ( rows[ix].bmdb_artistname )) == null ? '' : __t) +
'</h3>\n    </div>\n</div>\n';
 } ;
__p += '\n<h2 class="twi-result__chart-link"><a href="' +
((__t = ( canonical )) == null ? '' : __t) +
'/' +
((__t = ( date )) == null ? '' : __t) +
'">View the Chart <i class="twi-result__icon fa fa-angle-right"></i></a></h2>\n';

}
return __p
};

this["PGM"]["JST"]["chart/twi"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="twi-result';
 if (featured_content) { ;
__p += ' has-related-content';
 } ;
__p += '">\n    <div class="info-module__rank">1</div>\n    <div class="info-module__image"';
 if (row1.image) { ;
__p += ' style="background-image:url(' +
((__t = ( row1.image )) == null ? '' : __t) +
')"';
 } ;
__p += '></div>\n    <div class="info-module__details">\n        <h2 class="info-module__song">' +
((__t = ( row1.title )) == null ? '' : __t) +
'</h2>\n        <h3 class="info-module__artist">' +
((__t = ( row1.artist_name )) == null ? '' : __t) +
'</h3>\n    </div>\n</div>\n';
 if (featured_content) { ;
__p += '\n<div class="related-content-item" >\n    <div class="related-content-item-inner">\n        <a href="/' +
((__t = ( featured_content.path_alias )) == null ? '' : __t) +
'" data-tracklabel="Media Click">\n            <img src="' +
((__t = ( featured_content.ss_bb_image_uri )) == null ? '' : __t) +
'">\n            <div class="related-content-item-info">\n                <h4>' +
((__t = ( featured_content.bundle_name )) == null ? '' : __t) +
'</h4>\n                <h2>' +
((__t = ( featured_content.label )) == null ? '' : __t) +
'</h2>\n            </div>\n        </a>\n    </div>\n</div>\n';
 } ;
__p += '\n';

}
return __p
};

this["PGM"]["JST"]["gallery/adslide"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ad-slide__container" data-tracklabel="' +
((__t = ( trackEnv )) == null ? '' : __t) +
'-Ad-Click"></div>\n';

}
return __p
};

this["PGM"]["JST"]["gallery/promo-gallery"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="rail_item" data-tracklabel="d-' +
((__t = (itemNumber)) == null ? '' : __t) +
'">\n\t<progress class="rail-item__progress" value="0" max="0"></progress>\n    <a class="rail-item__link " href="' +
((__t = ( path )) == null ? '' : __t) +
'">\n        <img class="rail-item__image" src="' +
((__t = ( image )) == null ? '' : __t) +
'" alt="' +
((__t = ( title )) == null ? '' : __t) +
'" />\n    </a>\n    <p class="rail-item__meta">\n\t    <a class="rail-item__category category-link" href="' +
((__t = ( categoryPath )) == null ? '' : __t) +
'" data-tracklabel="Category-' +
__e( category ) +
'">\n\t        ' +
((__t = ( category )) == null ? '' : __t) +
'\n\t    </a>\n    </p>\n    <p class="rail-item__title">\n\t    <a class="rail-item__link" href="' +
((__t = ( path )) == null ? '' : __t) +
'">\n\t       ' +
((__t = ( title )) == null ? '' : __t) +
'\n\t    </a>\n    </p>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["gallery/slide"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="slide-image-container" data-tracklabel="' +
__e( trackEnv ) +
'-Photo-Click" data-hovertracklabel="' +
__e( trackEnv ) +
'-Photo-Hover">\n    ';
 if (embed !== null) { ;
__p += '\n        <div class="embed-wrap">\n            ' +
((__t = ( embed )) == null ? '' : __t) +
'\n        </div>\n    ';
 } else { ;
__p += '\n        <img class="slide-image" src="' +
((__t = ( src )) == null ? '' : __t) +
'" />\n    ';
 } ;
__p += '\n    <div class="share-overlay">\n        <div class="share-overlay__share-icons">\n            <a target="_blank" class="share-overlay__icon facebook-square fa-facebook" href="http://www.facebook.com/sharer.php?u=' +
__e( social.url ) +
'" data-tracklabel="' +
__e( trackEnv ) +
'-Photo-Share-Facebook" data-width="400" data-height="450" rel="popup">facebook</a>\n            <a target="_blank" class="share-overlay__icon twitter-square fa-twitter" href="https://twitter.com/share?url=' +
__e( social.url ) +
'&via=billboard&text=' +
__e( social.title ) +
'" data-tracklabel="' +
__e( trackEnv ) +
'-Photo-Share-Twitter" data-width="400" data-height="450" rel="popup">twitter</a>\n            <a target="_blank" class="share-overlay__icon pinterest-square fa-pinterest" href="https://pinterest.com/pin/create/bookmarklet/?media=' +
((__t = ( encodeURIComponent(src) )) == null ? '' : __t) +
'&url=' +
__e( social.url ) +
'&is_video=false&description=' +
__e( social.title ) +
'" data-tracklabel="' +
__e( trackEnv ) +
'-Photo-Share-Pinterest" data-width="400" data-height="450" rel="popup">pinterest</a>\n        </div>\n    </div>\n</div>\n<div class="slide-info">\n    <div class="slide-credit">' +
((__t = ( credit )) == null ? '' : __t) +
'</div>\n    <div class="slide-info__index">\n        <div class="slide-info__current" data-section="' +
((__t = ( slideIndex + 1 )) == null ? '' : __t) +
'">' +
((__t = ( displayIndex )) == null ? '' : __t) +
'</div>\n        <div class="slide-info__total">' +
((__t = ( gallery.displayNumSlides )) == null ? '' : __t) +
'</div>\n    </div>\n    <div class="slide-info__title">' +
((__t = (title)) == null ? '' : __t) +
'</div>\n    ';
 if (body !== null) { ;
__p += '\n    <div class="slide-info__body">' +
((__t = ( body )) == null ? '' : __t) +
'</div>\n    ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["gallery/vertical-gallery"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="gallery__head-container">\n    <div class="gallery__head-previous"></div>\n    <div class="gallery__head">\n        <h2 class="gallery__head-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h2>\n        <div class="gallery__head-total-slides">' +
((__t = (numSlides )) == null ? '' : __t) +
' PHOTOS</div>\n    </div>\n    <div class="gallery__head-next"></div>\n</div>\n<div class="gallery__published">\n    <a href="' +
((__t = ( categoryPath )) == null ? '' : __t) +
'"><div class="gallery__published-featured" data-tracklabel="Category-' +
__e( category ) +
'">' +
((__t = ( category )) == null ? '' : __t) +
'</div></a>\n    <div class="gallery__published--byline">\n        <div class="gallery__published--date">' +
((__t = ( displayPublished )) == null ? '' : __t) +
'</div>\n        ';
 _.each( bylines, function(byline, index) { ;
__p += '\n            ';
 if( index === 0 ) { ;
__p += '\n                <div class="gallery__published--by">by</div>\n            ';
 } else { ;
__p += ' and ';
 } ;
__p += '\n            <a href="' +
((__t = ( byline.path )) == null ? '' : __t) +
'" class="gallery__published--author" data-tracklabel="Author-Top-' +
((__t = ( byline.text )) == null ? '' : __t) +
'">' +
((__t = ( byline.text )) == null ? '' : __t) +
'</a>\n        ';
 }); ;
__p += '\n    </div>\n</div>\n<div class="gallery-slides">\n</div>\n<div class="gallery-end">\n        <p class="gallery-end__byline">\n            ' +
((__t = ( displayPublished )) == null ? '' : __t) +
'\n            ';
 _.each( bylines, function(byline, index) { ;
__p += '\n                ';
 if( index === 0 ) { ;
__p += '\n                    <span class="gallery-end__by">by</span>\n                ';
 } else { ;
__p += ' and ';
 } ;
__p += '\n                    <a href="' +
((__t = ( byline.path )) == null ? '' : __t) +
'" class="gallery-end__author" data-tracklabel="Author-Bottom-' +
((__t = ( byline.text )) == null ? '' : __t) +
'">' +
((__t = ( byline.text )) == null ? '' : __t) +
'</a>\n            ';
 }); ;
__p += '\n        </p>\n        <p class="gallery-end__related-links">\n            ';
 if (category !== null) { ;
__p += '\n                <a class="gallery-end__category" href="' +
((__t = ( categoryPath )) == null ? '' : __t) +
'" data-tracklabel="Category-Bottom-' +
__e( category ) +
'">' +
((__t = ( category )) == null ? '' : __t) +
'</a>\n            ';
 } ;
__p += '\n            ';
 _.each( tag, function(tag, index) { ;
__p += '\n                <a class="gallery-end__tag" href="' +
((__t = ( tag.path )) == null ? '' : __t) +
'">' +
((__t = ( tag.name )) == null ? '' : __t) +
'</a>\n            ';
 }); ;
__p += '\n        </p>\n        ';
 if (firstGallery === true) { ;
__p += '\n            <div class="gallery-end__comments">\n                <button class="disqus__toggle fa-chevron-down" data-tracklabel="View-All-Comments">comments</button>\n                <div id="disqus_thread" class="disqus collapsed"></div>\n            </div>\n        ';
 } ;
__p += '\n    </div>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["gallery/vertical-layout"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container-wide">\n    <div class="js-rail left-rail"></div>\n    <div class="js-well region__main vertical-layout"></div>\n</div>\n<div class="js-lightbox"></div>\n';

}
return __p
};

this["PGM"]["JST"]["homepage/videoPlayer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if( PGM.debug.getData('player') ) { brightcovePlayer = PGM.debug.getData('player') } ;
__p += '\n<div class="large-video__main">\n    <div class="large-video__player" data-videoID="' +
((__t = ( currentVideo.videoId )) == null ? '' : __t) +
'">\n        <video\n            data-account="' +
((__t = ( brightcoveAccount )) == null ? '' : __t) +
'"\n            data-player="' +
((__t = ( brightcovePlayer )) == null ? '' : __t) +
'"\n            data-embed="default"\n            data-video-id="' +
((__t = ( currentVideo.videoId )) == null ? '' : __t) +
'"\n            poster="' +
((__t = ( currentVideo.image_path )) == null ? '' : __t) +
'"\n            class="video-js" controls>\n        </video>\n        <script src="//players.brightcove.net/' +
((__t = ( brightcoveAccount )) == null ? '' : __t) +
'/' +
((__t = ( brightcovePlayer )) == null ? '' : __t) +
'_default/index.min.js"></script>\n    </div>\n    <div class="large-video__next" data-videoID="' +
((__t = ( nextVideo.videoId )) == null ? '' : __t) +
'">\n        <div class="large-video__next-background" style="background-image: url(' +
((__t = ( nextVideo.image_path )) == null ? '' : __t) +
')"></div>\n        <div class="large-video__next-body">\n            <div class="large-video__next-label">NEXT VIDEO</div>\n            <h3 class="large-video__next-title">' +
((__t = ( nextVideo.title )) == null ? '' : __t) +
'</h3>\n            <div class="large-video__buttons">\n                <button class="large-video__button--previous"></button>\n                <button class="large-video__button--next"></button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class="large-video__body">\n    <h3 class="large-video__title">' +
((__t = ( currentVideo.title )) == null ? '' : __t) +
'</h3>\n    <p class="large-video__deck">' +
((__t = ( currentVideo.deck )) == null ? '' : __t) +
'</p>\n</div>\n';

}
return __p
};

this["PGM"]["JST"]["hybrid_player/mainView"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="hybrid-player__header">\n    <h2 class="flap-headline">' +
((__t = ( title )) == null ? '' : __t) +
'</h2>\n</div>\n';

}
return __p
};