define('nyt5/analytics',[],function() {

  var canonical = document.querySelector("link[rel='canonical']").href,
      pageview = ['_trackPageview'];

  if (canonical) {
    var a = document.createElement("a");
    a.href = canonical;
    if (a.pathname != document.location.pathname) pageview.push(a.pathname);
  }

  _gaq = [['_setAccount', 'UA-9262032-1'], pageview];

  require(['http://www.google-analytics.com/ga.js']);

});

/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. *
 */
/**
 * jquery.balancetext.js
 *
 * Author: Randy Edmunds
 */

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery, $ */

/*
 * Copyright (c) 2007-2009 unscriptable.com and John M. Hann
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the “Software”), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Except as contained in this notice, the name(s) of the above
 * copyright holders (unscriptable.com and John M. Hann) shall not be
 * used in advertising or otherwise to promote the sale, use or other
 * dealings in this Software without prior written authorization.
 *
 * http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
 *
 */

define('lib/text-balancer',[
  'jquery/nyt'
  ], function($) {

     "use strict";
    var sr = "smartresize";

    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;
            function delayed() {
                if (!execAsap) {
                    func.apply(obj, args);
                }
                timeout = null;
            }

            if (timeout) {
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, args);
            }
            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    $.fn[sr] = function (fn) {  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    var style = document.documentElement.style,
        hasTextWrap = (style.textWrap || style.WebkitTextWrap || style.MozTextWrap || style.MsTextWrap || style.OTextWrap),
        wsMatches;

    function NextWS_params() {
        this.reset();
    }
    NextWS_params.prototype.reset = function () {
        this.index = 0;
        this.width = 0;
    };

    /**
     * Returns true iff char at index is a space character outside of HTML < > tags.
     */
    var isWS = function (txt, index) {
        var re = /\s(?![^<]*>)/g,
            match;

        if (!wsMatches) {
            // Only calc ws matches once per line
            wsMatches = [];
            while ((match = re.exec(txt)) !== null) {
                wsMatches.push(match.index);
            }
        }

        return wsMatches.indexOf(index) !== -1;
    };

    var removeTags = function ($el) {
        $el.find('br[data-owner="balance-text"]').replaceWith(" ");
        var $span = $el.find('span[data-owner="balance-text"]');
        if ($span.length > 0) {
            var txt = "";
            $span.each(function () {
                txt += $(this).text();
                $(this).remove();
            });
            $el.html(txt);
        }
    };

    /**
     * Checks to see if we should justify the balanced text with the
     * element based on the textAlign property in the computed CSS
     *
     * @param $el        - $(element)
     */
    var isJustified = function ($el) {
        style = $el.get(0).currentStyle || window.getComputedStyle($el.get(0), null);
        return (style.textAlign === 'justify');
    };

    /**
     * Add whitespace after words in text to justify the string to
     * the specified size.
     *
     * @param txt      - text string
     * @param conWidth - container width
     */
    var justify = function ($el, txt, conWidth) {
        txt = $.trim(txt);
        var words = txt.split(' ').length;
        txt = txt + ' ';

        // if we don't have at least 2 words, no need to justify.
        if (words < 2) {
            return txt;
        }

        // Find width of text in the DOM
        var tmp = $('<span></span>').html(txt);
        $el.append(tmp);
        var size = tmp.width();
        tmp.remove();

        // Figure out our word spacing and return the element
        var wordSpacing = Math.floor((conWidth - size) / (words - 1));
        tmp.css('word-spacing', wordSpacing + 'px')
            .attr('data-owner', 'balance-text');

        return $('<div></div>').append(tmp).html();
    };

    /**
     * In the current simple implementation, an index i is a break
     * opportunity in txt iff it is 0, txt.length, or the
     * index of a non-whitespace char immediately preceded by a
     * whitespace char.  (Thus, it doesn't honour 'white-space' or
     * any Unicode line-breaking classes.)
     *
     * @precondition 0 <= index && index <= txt.length
     */
    var isBreakOpportunity = function (txt, index) {
        return ((index === 0) || (index === txt.length) ||
                (isWS(txt, index - 1) && !isWS(txt, index)));
    };

    /**
     * Finds the first break opportunity (@see isBreakOpportunity)
     * in txt that's both after-or-equal-to index c in the direction dir
     * and resulting in line width equal to or past clamp(desWidth,
     * 0, conWidth) in direction dir.  Sets ret.index and ret.width
     * to the corresponding index and line width (from the start of
     * txt to ret.index).
     *
     * @param $el      - $(element)
     * @param txt      - text string
     * @param conWidth - container width
     * @param desWidth - desired width
     * @param dir      - direction (-1 or +1)
     * @param c        - char index (0 <= c && c <= txt.length)
     * @param ret      - return object; index and width of previous/next break
     *
     */
    var findBreakOpportunity = function ($el, txt, conWidth, desWidth, dir, c, ret) {
        var w;

        for(;;) {
            while (!isBreakOpportunity(txt, c)) {
                c += dir;
            }

            $el.html(txt.substr(0, c));
            w = $el.width();

            if ((dir < 0)
                    ? ((w <= desWidth) || (w <= 0) || (c === 0))
                    : ((desWidth <= w) || (conWidth <= w) || (c === txt.length))) {
                break;
            }
            c += dir;
        }
        ret.index = c;
        ret.width = w;
    };

    /**
     * Detects the width of a non-breaking space character, given the height of
     * the element with no-wrap applied.
     *
     * @param $el      - $(element)
     * @param h         - height
     *
     */
    var getSpaceWidth = function ($el, h) {
        var container = document.createElement('div');

        container.style.display = "block";
        container.style.position = "absolute";
        container.style.bottom = 0;
        container.style.right = 0;
        container.style.width = 0;
        container.style.height = 0;
        container.style.margin = 0;
        container.style.padding = 0;
        container.style.visibility = "hidden";
        container.style.overflow = "hidden";

        var space = document.createElement('span');

        space.style.fontSize = "2000px";
        space.innerHTML = "&nbsp;";

        container.appendChild(space);

        $el.append(container);

        var dims = space.getBoundingClientRect();
        container.parentNode.removeChild(container);

        var spaceRatio = dims.height / dims.width;

        return (h / spaceRatio);
    };

    // Selectors to watch; calling balanceText() on a new selector adds it to this list.
    var balancedElements = ['.balance-text'];

    // Call the balanceText plugin on the elements with "balance-text" class. When a browser
    // has native support for the text-wrap property, the text balanceText plugin will let
    // the browser handle it natively, otherwise it will apply its own text balancing code.
    var applyBalanceText = function () {
        var selector = balancedElements.join(',');
        $(selector).balanceText(true);
    };

    $.fn.balanceTextUpdate = applyBalanceText;

    $.fn.balanceText = function (skipResize) {
        var selector = this.selector;

        if (!skipResize && balancedElements.indexOf(selector) === -1) {
            // record the selector so we can re-balance it on resize
            balancedElements.push(selector);
        }

        if (hasTextWrap) {
            // browser supports text-wrap, so do nothing
            return this;
        }

        return this.each(function () {
            var $this = $(this);

            // In a lower level language, this algorithm takes time
            // comparable to normal text layout other than the fact
            // that we do two passes instead of one, so we should
            // be able to do without this limit.
            var maxTextWidth = 5000;

            removeTags($this);                        // strip balance-text tags

            // save line-height if set via inline style
            var oldLH = '';
            if ($this.attr('style') &&
                    $this.attr('style').indexOf('line-height') >= 0) {
                oldLH = $this.css('line-height');
            }

            // remove line height before measuring container size
            $this.css('line-height', 'normal');

            var containerWidth = $this.width();
            var containerHeight = $this.height();

            // save settings
            var oldWS = $this.css('white-space');
            var oldFloat = $this.css('float');
            var oldDisplay = $this.css('display');
            var oldPosition = $this.css('position');

            // temporary settings
            $this.css({
                'white-space': 'nowrap',
                'float': 'none',
                'display': 'inline',
                'position': 'static'
            });

            var nowrapWidth = $this.width();
            var nowrapHeight = $this.height();

            // An estimate of the average line width reduction due
            // to trimming trailing space that we expect over all
            // lines other than the last.

            var spaceWidth = ((oldWS === 'pre-wrap') ? 0 : getSpaceWidth($this, nowrapHeight));

            if (containerWidth > 0 &&                  // prevent divide by zero
                    nowrapWidth > containerWidth &&    // text is more than 1 line
                    nowrapWidth < maxTextWidth) {      // text is less than arbitrary limit (make this a param?)

                var remainingText = $this.html();
                var newText = "";
                var lineText = "";
                var shouldJustify = isJustified($this);
                var totLines = Math.round(containerHeight / nowrapHeight);
                var remLines = totLines;

                // Determine where to break:
                while (remLines > 1) {

                    // clear whitespace match cache for each line
                    wsMatches = null;

                    var desiredWidth = Math.round((nowrapWidth + spaceWidth)
                                                  / remLines
                                                  - spaceWidth);

                    // Guessed char index
                    var guessIndex = Math.round((remainingText.length + 1) / remLines) - 1;

                    var le = new NextWS_params();

                    // Find a breaking space somewhere before (or equal to) desired width,
                    // not necessarily the closest to the desired width.
                    findBreakOpportunity($this, remainingText, containerWidth, desiredWidth, -1, guessIndex, le);

                    // Find first breaking char after (or equal to) desired width.
                    var ge = new NextWS_params();
                    guessIndex = le.index;
                    findBreakOpportunity($this, remainingText, containerWidth, desiredWidth, +1, guessIndex, ge);

                    // Find first breaking char before (or equal to) desired width.
                    le.reset();
                    guessIndex = ge.index;
                    findBreakOpportunity($this, remainingText, containerWidth, desiredWidth, -1, guessIndex, le);

                    // Find closest string to desired length
                    var splitIndex;
                    if (le.index === 0) {
                        splitIndex = ge.index;
                    } else if ((containerWidth < ge.width) || (le.index === ge.index)) {
                        splitIndex = le.index;
                    } else {
                        splitIndex = ((Math.abs(desiredWidth - le.width) < Math.abs(ge.width - desiredWidth))
                                           ? le.index
                                           : ge.index);
                    }

                    // Break string
                    lineText = remainingText.substr(0, splitIndex);
                    if (shouldJustify) {
                        newText += justify($this, lineText, containerWidth);
                    } else {
                        newText += lineText.replace(/\s$/, "");
                        newText += '<br data-owner="balance-text" />';
                    }
                    remainingText = remainingText.substr(splitIndex);

                    // update counters
                    remLines--;
                    $this.html(remainingText);
                    nowrapWidth = $this.width();
                }

                if (shouldJustify) {
                    $this.html(newText + justify($this, remainingText, containerWidth));
                } else {
                    $this.html(newText + remainingText);
                }
            }

            // restore settings
            $this.css({
                'position': oldPosition,
                'display': oldDisplay,
                'float': oldFloat,
                'white-space': oldWS,
                'line-height': oldLH
            });
        });
    };

    return function(selectors) {
        if ($.isArray(selectors)) selectors = selectors.join(', ');
        function applyBalanceText() {
            $(selectors)
                .each(function() {
                    // look for html nodes in this element
                    var el = $(this), updated, related;
                    if (el.hasClass('interactive-leadin')) {
                        // save dateline and related link
                        updated = el.find('time.dateline');
                        related = el.find('a.related-link');
                        el.data('updated', updated.get(0))
                            .data('related', related.get(0))
                            .data('filter', $.trim((updated.text() + ' ' + related.text()).replace(/[ \n\t]+/g, ' ')));
                    } else if (el.hasClass('g-intro')) { 
                        // special treatment for stacks
                        updated = el.find('.g-updated');
                        related = el.find('.g-related-link');
                        el.data('updated', updated.get(0))
                            .data('related', related.get(0))
                            .data('filter', $.trim((updated.text() + (related.get(0) ? ' ' + related.text() : '')).replace(/[ \n\t]+/g, ' ')));
                        console.log(el.data('filter'), related.get(0));
                    }
                })
                .balanceText()
                .each(function() {
                    var el = $(this), filter, summary, nobr;
                    if (el.hasClass('interactive-leadin')) {
                        el.find('.dateline,.related-link').remove();
                        filter = el.data('filter');
                        summary = el.html().replace(/[ \n\t]+/g, ' ').replace(filter, '');
                        el.html('<span class="summary-text">'+summary+'</span>');
                        nobr = $('<span />')
                            .css('white-space', 'nowrap')
                            .appendTo(el);
                        nobr.append(el.data('updated'));
                        nobr.append(' ');
                        nobr.append(el.data('related'));
                    } else if (el.hasClass('g-intro')) {
                        // special treatment for stacks
                        el.find('.g-updated,.g-related-link').remove();
                        filter = el.data('filter');
                        summary = el.html().replace(/[ \n\t]+/g, ' ').replace(filter, '');
                        el.html('<span class="summary-text">'+summary+'</span>');
                        nobr = $('<span />')
                            .css('white-space', 'nowrap')
                            .appendTo(el);
                        nobr.append(el.data('updated'));
                        if (el.data('related')) {
                            nobr.append(' ');
                            nobr.append(el.data('related'));
                        }
                    }
                    
                });
        }
        // Apply on DOM ready
        $(window).ready(applyBalanceText);
        // Reapply on resize
        $(window).smartresize(applyBalanceText);
    };

});

require([
  '_nytg/2016-01-27-trump-insults-catalog/assets',
  '_nytg/2016-01-27-trump-insults-catalog/big-assets',
  'jquery/nyt',
  'underscore/1.6',
  'foundation/views/page-manager',
  'nyt5/analytics',
  'lib/text-balancer',
  'd3/3',
  'queue/1'
  // 'resizerScript'     // uncomment this line to include resizerScript
  // 'templates'         // uncomment to use src/templates
  ], function(NYTG_ASSETS, NYTG_BIG_ASSETS, $, _, PageManager, Analytics, balanceText, d3, queue) {

  // begin code for your graphic here:

  // var cols = ['#ffffff','#f4f8ff','#e8f2ff','#dcecff','#d1e5ff','#c4dfff','#b8d9ff','#abd3ff','#9dccff','#8ec6ff','#7ec0ff','#6cb9ff','#57b4ff','#3caeff','#00a8ff'].reverse();
  var cols = ["#fff",'#fbfcf0','#fafbee','#f9fbe9','#f8fae5','#f8f9e4','#f7f9df','#f6f8db','#f6f7d9','#f5f7d6','#f3f6d2','#f3f5cf','#f2f5cc','#f1f4c8','#f0f3c6','#eff2c3','#eef1be','#edf1bc','#edf0b9','#ebf0b4','#eaefb2','#eaeeaf','#e8edab','#e7eda7','#e6eca5','#e5eba1','#e4eb9c','#e3ea9b','#e2e997','#e1e993','#e0e892','#dfe78e','#dde789','#dde686','#dce684','#dae57f','#dae47d','#d8e47a','#d7e274','#d6e271','#d5e16f','#d3e06a','#d2e067','#d1e065','#cfde5f','#cede5d','#cdde5a','#cbdc54','#cbdc51','#c9dc4e','#c7da48','#c7da45','#c5d941','#c3d93a','#c3d837','#c1d733','#bfd62b','#bed627','#bdd621','#bbd514','#bad40a'].reverse();

  var color = d3.scale.threshold()
    .range(cols)
    .domain(d3.range(1,61));

  // textColor = d3.scale.threshold()
  //   .range(["#fff", "#000"])
  //   .domain([4]);

  window.$ = $;
    
  var now = new Date();

  // var orgOrder = ["presidential candidate", "person", "media", "group", "place", "other"];
  // var orgOrder = ["current and former presidential candidates", "people", "groups", "media", "places", "other"];

  var orgOrder = ["dem-candidates","repub-candidates","democratic-politician","republican-politician","media-figure","people-other","celebrity","place","group","media-org","media-program","other"];
  var orgMap = {
    "dem-candidates": "Democratic presidential candidates",
    "repub-candidates": "Republican presidential candidates",
    "democratic-politician": "Democratic politicians",
    "republican-politician": "Republican politicians",
    "media-figure": "Journalists and other media figures",
    "people-other": "Other people",
    "celebrity": "Celebrities",
    "place": "Places",
    "group": "Groups and political organizations",
    "media-org": "Media organizations",
    "media-program": "Television shows",
    "other": "Other"
  };

  queue()
      .defer(d3.tsv, NYTG_ASSETS + "lookup-table.tsv")
      .defer(d3.csv, NYTG_ASSETS + "qlinks.csv")
      .await(ready);

  function ready(err, data, quotes) {

    if (err) throw "error loading data";

    var gdata = [];

    quotes.forEach(function(d) {
      d.distanceInDays = (now - new Date(d.date))/(1000*60*60*24);
    });

    quotes = quotes.filter(function(d) { return d.quotes_vec !== "_"; })

    data = data.filter(function(d) { return d.drop != "1"; }) ;



    //data + processing
    var quotesBySlug = {},
      displayNameBySlug = {};
    data.forEach(function(d) {
      displayNameBySlug[d.slug] = d.display_name;
      quotesBySlug[d.slug] = quotes.filter(function(q) { return q.insult_slugs == d.slug; });
    });

    dataByType = d3.nest()
        .key(function(d) { return d.tag2; })
        .entries(data);

    dataByType.forEach(function(type) {
      type.values.forEach(function(d) {
        d.insults = quotesBySlug[d.slug];
        d.insults.sort(dateSort);
      });
      type.values.sort(alphaSort);
    });

    dataByType = dataByType.sort(function(a,b) {
      return orgOrder.indexOf(a.key) - orgOrder.indexOf(b.key);
    });

    console.log("dataByType", dataByType);

    var recent = quotes.filter(function(d) { return d.distanceInDays <= 30;});

    recentInsultees = d3.nest()
        .key(function(d) { return d.insult_slugs; })
        .rollup(function(values) {
          var insultDates = d3.max(values.map(function(d) { return d.date; }));
          var mostRecentInsult = values.filter(function(d) { return d.date == insultDates; })[0];
          return {
            "insultDate": mostRecentInsult.date,
            "insultDaysAgo": mostRecentInsult.distanceInDays 
          };
        })
        .entries(recent);

    var recentListItems = d3.select(".g-recent-additions-items").selectAll(".g-insulted-recently")
        .data(recentInsultees)
        .enter()
        .append("span")
        .attr("class", "g-insulted-recently");

    var recentAdditionName = recentListItems.append("a")
        .attr("class", "g-recent-addition-name g-in-app-anchor")
        .attr("href", function(d) { return "#" + d.key; })
        .text(function(d) { return displayNameBySlug[d.key]; });

    // poster
    var itemGroup = d3.select(".g-memorial-wall").selectAll(".g-ph-item-group")
        .data(dataByType)
        .enter()
        .append("div")
        .attr("class", function (d) { return "g-ph-item-group " + d.key; });

    itemGroup.append("div")
        .attr("class", 'g-border-bmarker');

    itemGroup.append("h5")
        .text(function(d) { return orgMap[d.key]; });

    var entityItem = itemGroup.selectAll(".g-entity-item")
        .data(function(d) { return d.values; })
        .enter()
        .append("div")
        .attr("class", "g-entity-item");

    entityItem.append('div')
        .attr("class", "g-entity-name")
        .attr("id", function(d) { return d.slug; })
        .text(function(d) { return d.display_name; });

    entityItem.append('div')
        .attr("class", "g-entity-title")
        .text(function(d) { return d.display_title; });

    var insultContainer = entityItem.append('div')
        .attr("class", "g-insult-container");
        

    var link = insultContainer.selectAll(".g-insult-links-c")
        .data(function(d) { return d.insults; })
        .enter()
        .append("div")
        .attr("class", "g-insult-links-c")
        .classed("g-recent-tweet", function(d) {
          return d.distanceInDays < 2;
        });

    // link.append("span")
    //     .text("“");
        
    link.append("a")
        .style("background-color", function(d) { return color(d.distanceInDays);})
        // .style("color", function(d) { return textColor(d.distanceInDays);})
        .attr("href", function(d) { return d.tweet_link; })
        .attr("target", "_blank")
        // .text(function(d,i) { return '“' + d.quotes_vec; });
        .text(function(d,i) { return '“' + d.quotes_vec + '”'; });
        // .text(function(d,i) { return  d.quotes_vec ; });

    link.append("span")
        .attr("class", "g-kq-date-helper")
        .text(function(d) { return d.date.split("T")[0]; });





  }

  function alphaSort(a,b) {
    if (a.sort_field > b.sort_field) return 1;
    if (a.sort_field < b.sort_field) return -1;
    return 0;
  }

  function dateSort(a,b) {
    return new Date(b.date) - new Date(a.date);
  }





  // uncomment to balance headline and leadin

  if (innerWidth > 500) balanceText('.interactive-headline, .interactive-leadin');

  // templates
  // var html = Templates.jst.example_template({ text: "yo" });

  // custom sharetools
  // <div class="sharetools g-sharetools" data-url="http://www.nytimes.com" data-title="Custom Title"></div>
  // require(['interactive/main'], function() {
  //   require(['shared/sharetools/views/share-tools-container'], function(ShareTools) {
  //     $(".g-sharetools").each(function() {
  //       new ShareTools({ el: $(this) });
  //     });
  //   });
  // });

}); // end require
;
define("script", function(){});

