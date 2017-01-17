function dv_rolloutManager(handlersDefsArray, baseHandler) {
    this.handle = function () {
        var errorsArr = [];

        var handler = chooseEvaluationHandler(handlersDefsArray);
        if (handler) {
            var errorObj = handleSpecificHandler(handler);
            if (errorObj === null)
                return errorsArr;
            else {
                var debugInfo = handler.onFailure();
                if (debugInfo) {
                    for (var key in debugInfo) {
                        if (debugInfo.hasOwnProperty(key)) {
                            if (debugInfo[key] !== undefined || debugInfo[key] !== null) {
                                errorObj[key] = encodeURIComponent(debugInfo[key]);
                            }
                        }
                    }
                }
                errorsArr.push(errorObj);
            }
        }

        var errorObjHandler = handleSpecificHandler(baseHandler);
        if (errorObjHandler) {
            errorObjHandler['dvp_isLostImp'] = 1;
            errorsArr.push(errorObjHandler);
        }
        return errorsArr;
    };

    function handleSpecificHandler(handler) {
        var request;
        var errorObj = null;

        try {
            request = handler.createRequest();
            if (request && !request.isSev1) {
                var url = request.url || request;
                if (url) {
                    if (!handler.sendRequest(url))
                        errorObj = createAndGetError('sendRequest failed.',
                            url,
                            handler.getVersion(),
                            handler.getVersionParamName(),
                            handler.dv_script);
                } else {
                    errorObj = createAndGetError('createRequest failed.',
                        url,
                        handler.getVersion(),
                        handler.getVersionParamName(),
                        handler.dv_script,
                        handler.dvScripts,
                        handler.dvStep,
                        handler.dvOther
                    );
                }
            }
        }
        catch (e) {
            errorObj = createAndGetError(e.name + ': ' + e.message, request ? (request.url || request) : null, handler.getVersion(), handler.getVersionParamName(), (handler ? handler.dv_script : null));
        }

        return errorObj;
    }

    function createAndGetError(error, url, ver, versionParamName, dv_script, dvScripts, dvStep, dvOther) {
        var errorObj = {};
        errorObj[versionParamName] = ver;
        errorObj['dvp_jsErrMsg'] = encodeURIComponent(error);
        if (dv_script && dv_script.parentElement && dv_script.parentElement.tagName && dv_script.parentElement.tagName == 'HEAD')
            errorObj['dvp_isOnHead'] = '1';
        if (url)
            errorObj['dvp_jsErrUrl'] = url;
        if (dvScripts) {
            var dvScriptsResult = '';
            for (var id in dvScripts) {
                if (dvScripts[id] && dvScripts[id].src) {
                    dvScriptsResult += encodeURIComponent(dvScripts[id].src) + ":" + dvScripts[id].isContain + ",";
                }
            }
            
            
            
        }
        return errorObj;
    }

    function chooseEvaluationHandler(handlersArray) {
        var config = window._dv_win.dv_config;
        var index = 0;
        var isEvaluationVersionChosen = false;
        if (config.handlerVersionSpecific) {
            for (var i = 0; i < handlersArray.length; i++) {
                if (handlersArray[i].handler.getVersion() == config.handlerVersionSpecific) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }
        else if (config.handlerVersionByTimeIntervalMinutes) {
            var date = config.handlerVersionByTimeInputDate || new Date();
            var hour = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            index = Math.floor(((hour * 60) + minutes) / config.handlerVersionByTimeIntervalMinutes) % (handlersArray.length + 1);
            if (index != handlersArray.length) 
                isEvaluationVersionChosen = true;
        }
        else {
            var rand = config.handlerVersionRandom || (Math.random() * 100);
            for (var i = 0; i < handlersArray.length; i++) {
                if (rand >= handlersArray[i].minRate && rand < handlersArray[i].maxRate) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }

        if (isEvaluationVersionChosen == true && handlersArray[index].handler.isApplicable())
            return handlersArray[index].handler;
        else
            return null;
    }
}

function doesBrowserSupportHTML5Push() {
    "use strict";
    return typeof window.parent.postMessage === 'function' && window.JSON;
}

function dv_GetParam(url, name, checkFromStart) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = (checkFromStart ? "(?:\\?|&|^)" : "[\\?&]") + name + "=([^&#]*)";
    var regex = new RegExp(regexS, 'i');
    var results = regex.exec(url);
    if (results == null)
        return null;
    else
        return results[1];
}

function dv_Contains(array, obj) {
    var i = array.length;
    while (i--) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

function dv_GetDynamicParams(url) {
    try {
        var regex = new RegExp("[\\?&](dvp_[^&]*=[^&#]*)", "gi");
        var dvParams = regex.exec(url);

        var results = new Array();
        while (dvParams != null) {
            results.push(dvParams[1]);
            dvParams = regex.exec(url);
        }
        return results;
    }
    catch (e) {
        return [];
    }
}

function dv_createIframe() {
    var iframe;
    if (document.createElement && (iframe = document.createElement('iframe'))) {
        iframe.name = iframe.id = 'iframe_' + Math.floor((Math.random() + "") * 1000000000000);
        iframe.width = 0;
        iframe.height = 0;
        iframe.style.display = 'none';
        iframe.src = 'about:blank';
    }

    return iframe;
}

function dv_GetRnd() {
    return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 16);
}

function dv_SendErrorImp(serverUrl, errorsArr) {

    for (var j = 0; j < errorsArr.length; j++) {
        var errorObj = errorsArr[j];
        var errorImp = dv_CreateAndGetErrorImp(serverUrl, errorObj);
        dv_sendImgImp(errorImp);
    }
}

function dv_CreateAndGetErrorImp(serverUrl, errorObj) {
    var errorQueryString = '';
    for (key in errorObj) {
        if (errorObj.hasOwnProperty(key)) {
            if (key.indexOf('dvp_jsErrUrl') == -1) {
                errorQueryString += '&' + key + '=' + errorObj[key];
            }
            else {
                var params = ['ctx', 'cmp', 'plc', 'sid'];
                for (var i = 0; i < params.length; i++) {
                    var pvalue = dv_GetParam(errorObj[key], params[i]);
                    if (pvalue) {
                        errorQueryString += '&dvp_js' + params[i] + '=' + pvalue;
                    }
                }
            }
        }
    }

    var windowProtocol = 'https:';
    var sslFlag = '&ssl=1';

    var errorImp = windowProtocol + '//' + serverUrl + sslFlag + errorQueryString;
    return errorImp;
}

function dv_sendImgImp(url) {
    (new Image()).src = url;
}

function dv_sendScriptRequest(url) {
    document.write('<scr' + 'ipt type="text/javascript" src="' + url + '"></scr' + 'ipt>');
}

function dv_getPropSafe(obj, propName) {
    try {
        if (obj)
            return obj[propName];
    } catch (e) {
    }
}

function dvBsType() {
    var that = this;
    var eventsForDispatch = {};
    this.t2tEventDataZombie = {};

    this.processT2TEvent = function (data, tag) {
        try {
            if (tag.ServerPublicDns) {
                data.timeStampCollection.push({"beginProcessT2TEvent": getCurrentTime()});
                data.timeStampCollection.push({'beginVisitCallback': tag.beginVisitCallbackTS});
                var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;

                if (!tag.uniquePageViewId) {
                    tag.uniquePageViewId = data.uniquePageViewId;
                }

                tpsServerUrl += '&dvp_upvid=' + tag.uniquePageViewId;
                tpsServerUrl += '&dvp_numFrames=' + data.totalIframeCount;
                tpsServerUrl += '&dvp_numt2t=' + data.totalT2TiframeCount;
                tpsServerUrl += '&dvp_frameScanDuration=' + data.scanAllFramesDuration;
                tpsServerUrl += '&dvp_scene=' + tag.adServingScenario;
                tpsServerUrl += '&dvp_ist2twin=' + (data.isWinner ? '1' : '0');
                tpsServerUrl += '&dvp_numTags=' + Object.keys($dvbs.tags).length;
                tpsServerUrl += '&dvp_isInSample=' + data.isInSample;
                tpsServerUrl += (data.wasZombie) ? '&dvp_wasZombie=1' : '&dvp_wasZombie=0';
                tpsServerUrl += '&dvp_ts_t2tCreatedOn=' + data.creationTime;
                if (data.timeStampCollection) {
                    if (window._dv_win.t2tTimestampData) {
                        for (var tsI = 0; tsI < window._dv_win.t2tTimestampData.length; tsI++) {
                            data.timeStampCollection.push(window._dv_win.t2tTimestampData[tsI]);
                        }
                    }

                    for (var i = 0; i < data.timeStampCollection.length; i++) {
                        var item = data.timeStampCollection[i];
                        for (var propName in item) {
                            if (item.hasOwnProperty(propName)) {
                                tpsServerUrl += '&dvp_ts_' + propName + '=' + item[propName];
                            }
                        }
                    }
                }
                $dvbs.domUtilities.addImage(tpsServerUrl, tag.tagElement.parentElement);
            }
        } catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&jsver=0&dvp_ist2tProcess=1', {dvp_jsErrMsg: encodeURIComponent(e)});
            } catch (ex) {
            }
        }
    };

    this.processTagToTagCollision = function (collision, tag) {
        var i;
        var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;
        var additions = [
            '&dvp_collisionReasons=' + collision.reasonBitFlag,
            '&dvp_ts_reporterDvTagCreated=' + collision.thisTag.dvTagCreatedTS,
            '&dvp_ts_reporterVisitJSMessagePosted=' + collision.thisTag.visitJSPostMessageTS,
            '&dvp_ts_reporterReceivedByT2T=' + collision.thisTag.receivedByT2TTS,
            '&dvp_ts_collisionPostedFromT2T=' + collision.postedFromT2TTS,
            '&dvp_ts_collisionReceivedByCommon=' + collision.commonRecievedTS,
            '&dvp_collisionTypeId=' + collision.allReasonsForTagBitFlag
        ];
        tpsServerUrl += additions.join("");

        for (i = 0; i < collision.reasons.length; i++) {
            var reason = collision.reasons[i];
            tpsServerUrl += '&dvp_' + reason + "MS=" + collision[reason + "MS"];
        }

        if (tag.uniquePageViewId) {
            tpsServerUrl += '&dvp_upvid=' + tag.uniquePageViewId;
        }
        $dvbs.domUtilities.addImage(tpsServerUrl, tag.tagElement.parentElement);
    };

    var messageEventListener = function (event) {
        try {
            var timeCalled = getCurrentTime();
            var data = window.JSON.parse(event.data);
            if (!data.action) {
                data = window.JSON.parse(data);
            }
            if (data.timeStampCollection) {
                data.timeStampCollection.push({messageEventListenerCalled: timeCalled});
            }
            var myUID;
            var visitJSHasBeenCalledForThisTag = false;
            if ($dvbs.tags) {
                for (var uid in $dvbs.tags) {
                    if ($dvbs.tags.hasOwnProperty(uid) && $dvbs.tags[uid] && $dvbs.tags[uid].t2tIframeId === data.iFrameId) {
                        myUID = uid;
                        visitJSHasBeenCalledForThisTag = true;
                        break;
                    }
                }
            }

            switch (data.action) {
                case 'uniquePageViewIdDetermination' :
                    if (visitJSHasBeenCalledForThisTag) {
                        $dvbs.processT2TEvent(data, $dvbs.tags[myUID]);
                        $dvbs.t2tEventDataZombie[data.iFrameId] = undefined;
                    }
                    else {
                        data.wasZombie = 1;
                        $dvbs.t2tEventDataZombie[data.iFrameId] = data;
                    }
                    break;
                case 'maColl':
                    var tag = $dvbs.tags[myUID];
                    
                    tag.AdCollisionMessageRecieved = true;
                    if (!tag.uniquePageViewId) {
                        tag.uniquePageViewId = data.uniquePageViewId;
                    }
                    data.collision.commonRecievedTS = timeCalled;
                    $dvbs.processTagToTagCollision(data.collision, tag);
                    break;
            }

        } catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&jsver=0&dvp_ist2tListener=1', {dvp_jsErrMsg: encodeURIComponent(e)});
            } catch (ex) {
            }
        }
    };

    if (window.addEventListener)
        addEventListener("message", messageEventListener, false);
    else
        attachEvent("onmessage", messageEventListener);

    this.pubSub = new function () {

        var subscribers = [];

        this.subscribe = function (eventName, uid, actionName, func) {
            if (!subscribers[eventName + uid])
                subscribers[eventName + uid] = [];
            subscribers[eventName + uid].push({Func: func, ActionName: actionName});
        };

        this.publish = function (eventName, uid) {
            var actionsResults = [];
            if (eventName && uid && subscribers[eventName + uid] instanceof Array)
                for (var i = 0; i < subscribers[eventName + uid].length; i++) {
                    var funcObject = subscribers[eventName + uid][i];
                    if (funcObject && funcObject.Func && typeof funcObject.Func == "function" && funcObject.ActionName) {
                        var isSucceeded = runSafely(function () {
                            return funcObject.Func(uid);
                        });
                        actionsResults.push(encodeURIComponent(funcObject.ActionName) + '=' + (isSucceeded ? '1' : '0'));
                    }
                }
            return actionsResults.join('&');
        };
    };

    this.domUtilities = new function () {

        this.addImage = function (url, parentElement) {
            var image = parentElement.ownerDocument.createElement("img");
            image.width = 0;
            image.height = 0;
            image.style.display = 'none';
            image.src = appendCacheBuster(url);
            parentElement.insertBefore(image, parentElement.firstChild);
        };

        this.addScriptResource = function (url, parentElement) {
            if (parentElement) {
                var scriptElem = parentElement.ownerDocument.createElement("script");
                scriptElem.type = 'text/javascript';
                scriptElem.src = appendCacheBuster(url);
                parentElement.insertBefore(scriptElem, parentElement.firstChild);
            }
            else {
                addScriptResourceFallBack(url);
            }
        };

        function addScriptResourceFallBack(url) {
            var scriptElem = document.createElement('script');
            scriptElem.type = "text/javascript";
            scriptElem.src = appendCacheBuster(url);
            var firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(scriptElem, firstScript);
        }

        this.addScriptCode = function (srcCode, parentElement) {
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.innerHTML = srcCode;
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addHtml = function (srcHtml, parentElement) {
            var divElem = parentElement.ownerDocument.createElement("div");
            divElem.style = "display: inline";
            divElem.innerHTML = srcHtml;
            parentElement.insertBefore(divElem, parentElement.firstChild);
        };
    };

    this.resolveMacros = function (str, tag) {
        var viewabilityData = tag.getViewabilityData();
        var viewabilityBuckets = viewabilityData && viewabilityData.buckets ? viewabilityData.buckets : {};
        var upperCaseObj = objectsToUpperCase(tag, viewabilityData, viewabilityBuckets);
        var newStr = str.replace('[DV_PROTOCOL]', upperCaseObj.DV_PROTOCOL);
        newStr = newStr.replace('[PROTOCOL]', upperCaseObj.PROTOCOL);
        newStr = newStr.replace(/\[(.*?)\]/g, function (match, p1) {
            var value = upperCaseObj[p1];
            if (value === undefined || value === null)
                value = '[' + p1 + ']';
            return encodeURIComponent(value);
        });
        return newStr;
    };

    this.settings = new function () {
    };

    this.tagsType = function () {
    };

    this.tagsPrototype = function () {
        this.add = function (tagKey, obj) {
            if (!that.tags[tagKey])
                that.tags[tagKey] = new that.tag();
            for (var key in obj)
                that.tags[tagKey][key] = obj[key];
        };
    };

    this.tagsType.prototype = new this.tagsPrototype();
    this.tagsType.prototype.constructor = this.tags;
    this.tags = new this.tagsType();

    this.tag = function () {
    };
    this.tagPrototype = function () {
        this.set = function (obj) {
            for (var key in obj)
                this[key] = obj[key];
        };

        this.getViewabilityData = function () {
        };
    };

    this.tag.prototype = new this.tagPrototype();
    this.tag.prototype.constructor = this.tag;

    this.getTagObjectByService = function (serviceName) {

        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] === 'object'
                && this.tags[impressionId].services
                && this.tags[impressionId].services[serviceName]
                && !this.tags[impressionId].services[serviceName].isProcessed) {
                this.tags[impressionId].services[serviceName].isProcessed = true;
                return this.tags[impressionId];
            }
        }


        return null;
    };

    this.addService = function (impressionId, serviceName, paramsObject) {

        if (!impressionId || !serviceName)
            return;

        if (!this.tags[impressionId])
            return;
        else {
            if (!this.tags[impressionId].services)
                this.tags[impressionId].services = {};

            this.tags[impressionId].services[serviceName] = {
                params: paramsObject,
                isProcessed: false
            };
        }
    };

    this.Enums = {
        BrowserId: {Others: 0, IE: 1, Firefox: 2, Chrome: 3, Opera: 4, Safari: 5},
        TrafficScenario: {OnPage: 1, SameDomain: 2, CrossDomain: 128}
    };

    this.CommonData = {};

    var runSafely = function (action) {
        try {
            var ret = action();
            return ret !== undefined ? ret : true;
        } catch (e) {
            return false;
        }
    };

    var objectsToUpperCase = function () {
        var upperCaseObj = {};
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    upperCaseObj[key.toUpperCase()] = obj[key];
                }
            }
        }
        return upperCaseObj;
    };

    var appendCacheBuster = function (url) {
        if (url !== undefined && url !== null && url.match("^http") == "http") {
            if (url.indexOf('?') !== -1) {
                if (url.slice(-1) == '&')
                    url += 'cbust=' + dv_GetRnd();
                else
                    url += '&cbust=' + dv_GetRnd();
            }
            else
                url += '?cbust=' + dv_GetRnd();
        }
        return url;
    };

    this.dispatchRegisteredEventsFromAllTags = function () {
        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] !== 'function' && typeof this.tags[impressionId] !== 'undefined')
                dispatchEventCalls(impressionId, this);
        }
    };

    var dispatchEventCalls = function (impressionId, dvObj) {
        var tag = dvObj.tags[impressionId];
        var eventObj = eventsForDispatch[impressionId];
        if (typeof eventObj !== 'undefined' && eventObj != null) {
            var url = tag.protocol + '//' + tag.ServerPublicDns + "/bsevent.gif?impid=" + impressionId + '&' + createQueryStringParams(eventObj);
            dvObj.domUtilities.addImage(url, tag.tagElement.parentElement);
            eventsForDispatch[impressionId] = null;
        }
    };

    this.registerEventCall = function (impressionId, eventObject, timeoutMs) {
        addEventCallForDispatch(impressionId, eventObject);

        if (typeof timeoutMs === 'undefined' || timeoutMs == 0 || isNaN(timeoutMs))
            dispatchEventCallsNow(this, impressionId, eventObject);
        else {
            if (timeoutMs > 2000)
                timeoutMs = 2000;

            var dvObj = this;
            setTimeout(function () {
                dispatchEventCalls(impressionId, dvObj);
            }, timeoutMs);
        }
    };

    var dispatchEventCallsNow = function (dvObj, impressionId, eventObject) {
        addEventCallForDispatch(impressionId, eventObject);
        dispatchEventCalls(impressionId, dvObj);
    };

    var addEventCallForDispatch = function (impressionId, eventObject) {
        for (var key in eventObject) {
            if (typeof eventObject[key] !== 'function' && eventObject.hasOwnProperty(key)) {
                if (!eventsForDispatch[impressionId])
                    eventsForDispatch[impressionId] = {};
                eventsForDispatch[impressionId][key] = eventObject[key];
            }
        }
    };

    if (window.addEventListener) {
        window.addEventListener('unload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
        window.addEventListener('beforeunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
        window.attachEvent('onbeforeunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
    }
    else {
        window.document.body.onunload = function () {
            that.dispatchRegisteredEventsFromAllTags();
        };
        window.document.body.onbeforeunload = function () {
            that.dispatchRegisteredEventsFromAllTags();
        };
    }

    var createQueryStringParams = function (values) {
        var params = '';
        for (var key in values) {
            if (typeof values[key] !== 'function') {
                var value = encodeURIComponent(values[key]);
                if (params === '')
                    params += key + '=' + value;
                else
                    params += '&' + key + '=' + value;
            }
        }

        return params;
    };
}

function dv_baseHandler(){function J(j,a,k,d,c,l,w,m,u,F){var e,i,b;void 0==a.dvregion&&(a.dvregion=0);var r,C,D;try{b=d;for(i=0;10>i&&b!=window._dv_win.top;)i++,b=b.parent;d.depth=i;e=K(d);r="&aUrl="+encodeURIComponent(e.url);C="&aUrlD="+e.depth;D=d.depth+c;l&&d.depth--}catch(I){C=r=D=d.depth=""}void 0!=a.aUrl&&(r="&aUrl="+a.aUrl);c=a.script.src;l="&ctx="+(dv_GetParam(c,"ctx")||"")+"&cmp="+(dv_GetParam(c,"cmp")||"")+"&plc="+(dv_GetParam(c,"plc")||"")+"&sid="+(dv_GetParam(c,"sid")||"")+"&advid="+
(dv_GetParam(c,"advid")||"")+"&adsrv="+(dv_GetParam(c,"adsrv")||"")+"&unit="+(dv_GetParam(c,"unit")||"")+"&isdvvid="+(dv_GetParam(c,"isdvvid")||"")+"&uid="+a.uid+"&tagtype="+(dv_GetParam(c,"tagtype")||"")+"&adID="+(dv_GetParam(c,"adID")||"")+"&app="+(dv_GetParam(c,"app")||"")+"&sup="+(dv_GetParam(c,"sup")||"");(b=dv_GetParam(c,"xff"))&&(l+="&xff="+b);(b=dv_GetParam(c,"useragent"))&&(l+="&useragent="+b);if(void 0!=window._dv_win.$dvbs.CommonData.BrowserId&&void 0!=window._dv_win.$dvbs.CommonData.BrowserVersion&&
void 0!=window._dv_win.$dvbs.CommonData.BrowserIdFromUserAgent)e=window._dv_win.$dvbs.CommonData.BrowserId,i=window._dv_win.$dvbs.CommonData.BrowserVersion,b=window._dv_win.$dvbs.CommonData.BrowserIdFromUserAgent;else{var g=b?decodeURIComponent(b):navigator.userAgent;e=[{id:4,brRegex:"OPR|Opera",verRegex:"(OPR/|Version/)"},{id:1,brRegex:"MSIE|Trident/7.*rv:11|rv:11.*Trident/7|Edge/",verRegex:"(MSIE |rv:| Edge/)"},{id:2,brRegex:"Firefox",verRegex:"Firefox/"},{id:0,brRegex:"Mozilla.*Android.*AppleWebKit(?!.*Chrome.*)|Linux.*Android.*AppleWebKit.* Version/.*Chrome",
verRegex:null},{id:0,brRegex:"AOL/.*AOLBuild/|AOLBuild/.*AOL/|Puffin|Maxthon|Valve|Silk|PLAYSTATION|PlayStation|Nintendo|wOSBrowser",verRegex:null},{id:3,brRegex:"Chrome",verRegex:"Chrome/"},{id:5,brRegex:"Safari|(OS |OS X )[0-9].*AppleWebKit",verRegex:"Version/"}];b=0;i="";for(var h=0;h<e.length;h++)if(null!=g.match(RegExp(e[h].brRegex))){b=e[h].id;if(null==e[h].verRegex)break;g=g.match(RegExp(e[h].verRegex+"[0-9]*"));null!=g&&(i=g[0].match(RegExp(e[h].verRegex)),i=g[0].replace(i[0],""));break}e=
h=M();i=h===b?i:"";window._dv_win.$dvbs.CommonData.BrowserId=e;window._dv_win.$dvbs.CommonData.BrowserVersion=i;window._dv_win.$dvbs.CommonData.BrowserIdFromUserAgent=b}l+="&brid="+e+"&brver="+i+"&bridua="+b;(b=dv_GetParam(c,"turl"))&&(l+="&turl="+b);(b=dv_GetParam(c,"tagformat"))&&(l+="&tagformat="+b);b="";try{var f=window._dv_win.parent;b+="&chro="+(void 0===f.chrome?"0":"1");b+="&hist="+(f.history?f.history.length:"");b+="&winh="+f.innerHeight;b+="&winw="+f.innerWidth;b+="&wouh="+f.outerHeight;
b+="&wouw="+f.outerWidth;f.screen&&(b+="&scah="+f.screen.availHeight,b+="&scaw="+f.screen.availWidth)}catch(J){}var l=l+b,x;f=function(){try{return!!window.sessionStorage}catch(a){return!0}};b=function(){try{return!!window.localStorage}catch(a){return!0}};i=function(){var a=document.createElement("canvas");if(a.getContext&&a.getContext("2d")){var b=a.getContext("2d");b.textBaseline="top";b.font="14px 'Arial'";b.textBaseline="alphabetic";b.fillStyle="#f60";b.fillRect(0,0,62,20);b.fillStyle="#069";
b.fillText("!image!",2,15);b.fillStyle="rgba(102, 204, 0, 0.7)";b.fillText("!image!",4,17);return a.toDataURL()}return null};try{e=[];e.push(["lang",navigator.language||navigator.browserLanguage]);e.push(["tz",(new Date).getTimezoneOffset()]);e.push(["hss",f()?"1":"0"]);e.push(["hls",b()?"1":"0"]);e.push(["odb",typeof window.openDatabase||""]);e.push(["cpu",navigator.cpuClass||""]);e.push(["pf",navigator.platform||""]);e.push(["dnt",navigator.doNotTrack||""]);e.push(["canv",i()]);var n=e.join("=!!!=");
if(null==n||""==n)x="";else{f=function(a){for(var b="",c,t=7;0<=t;t--)c=a>>>4*t&15,b+=c.toString(16);return b};b=[1518500249,1859775393,2400959708,3395469782];var n=n+String.fromCharCode(128),v=Math.ceil((n.length/4+2)/16),y=Array(v);for(i=0;i<v;i++){y[i]=Array(16);for(e=0;16>e;e++)y[i][e]=n.charCodeAt(64*i+4*e)<<24|n.charCodeAt(64*i+4*e+1)<<16|n.charCodeAt(64*i+4*e+2)<<8|n.charCodeAt(64*i+4*e+3)}y[v-1][14]=8*(n.length-1)/Math.pow(2,32);y[v-1][14]=Math.floor(y[v-1][14]);y[v-1][15]=8*(n.length-1)&
4294967295;n=1732584193;e=4023233417;var h=2562383102,g=271733878,A=3285377520,p=Array(80),z,s,t,B,G;for(i=0;i<v;i++){for(var q=0;16>q;q++)p[q]=y[i][q];for(q=16;80>q;q++)p[q]=(p[q-3]^p[q-8]^p[q-14]^p[q-16])<<1|(p[q-3]^p[q-8]^p[q-14]^p[q-16])>>>31;z=n;s=e;t=h;B=g;G=A;for(q=0;80>q;q++){var L=Math.floor(q/20),N=z<<5|z>>>27,E;c:{switch(L){case 0:E=s&t^~s&B;break c;case 1:E=s^t^B;break c;case 2:E=s&t^s&B^t&B;break c;case 3:E=s^t^B;break c}E=void 0}var O=N+E+G+b[L]+p[q]&4294967295;G=B;B=t;t=s<<30|s>>>2;
s=z;z=O}n=n+z&4294967295;e=e+s&4294967295;h=h+t&4294967295;g=g+B&4294967295;A=A+G&4294967295}x=f(n)+f(e)+f(h)+f(g)+f(A)}}catch(Q){x=null}a=(window._dv_win.dv_config.verifyJSURL||a.protocol+"//"+(window._dv_win.dv_config.bsAddress||"rtb"+a.dvregion+".doubleverify.com")+"/verify.js")+"?jsCallback="+a.callbackName+"&jsTagObjCallback="+a.tagObjectCallbackName+"&num=6"+l+"&srcurlD="+d.depth+"&ssl="+a.ssl+(F?"&dvf_isiOS=1":"")+"&refD="+D+a.tagIntegrityFlag+a.tagHasPassbackFlag+"&htmlmsging="+(w?"1":"0")+
(null!=x?"&aadid="+x:"");(d=dv_GetDynamicParams(c).join("&"))&&(a+="&"+d);if(!1===m||u)a=a+("&dvp_isBodyExistOnLoad="+(m?"1":"0"))+("&dvp_isOnHead="+(u?"1":"0"));k="srcurl="+encodeURIComponent(k);if((m=window._dv_win[H("=@42E:@?")][H("2?46DE@C~C:8:?D")])&&0<m.length){u=[];u[0]=window._dv_win.location.protocol+"//"+window._dv_win.location.hostname;for(d=0;d<m.length;d++)u[d+1]=m[d];m=u.reverse().join(",")}else m=null;m&&(k+="&ancChain="+encodeURIComponent(m));m=4E3;/MSIE (\d+\.\d+);/.test(navigator.userAgent)&&
7>=new Number(RegExp.$1)&&(m=2E3);if(c=dv_GetParam(c,"referrer"))c="&referrer="+c,a.length+c.length<=m&&(a+=c);r.length+C.length+a.length<=m&&(a+=C,k+=r);r=P();a+="&vavbkt="+r.vdcd;a+="&lvvn="+r.vdcv;"prerender"===window._dv_win.document.visibilityState&&(a+="&prndr=1");a+="&eparams="+encodeURIComponent(H(k))+"&"+j.getVersionParamName()+"="+j.getVersion();return{isSev1:!1,url:a}}function P(){try{return{vdcv:17,vdcd:eval(function(a,k,d,c,l,j){l=function(a){return(a<k?"":l(parseInt(a/k)))+(35<(a%=k)?
String.fromCharCode(a+29):a.toString(36))};if(!"".replace(/^/,String)){for(;d--;)j[l(d)]=c[d]||l(d);c=[function(a){return j[a]}];l=function(){return"\\w+"};d=1}for(;d--;)c[d]&&(a=a.replace(RegExp("\\b"+l(d)+"\\b","g"),c[d]));return a}("(y(){1i{1i{2w('1')}19(e){d[-5O]}w 13=[1A];1i{w G=1A;5K(G!=G.1O&&G.1C.5W.69){13.1B(G.1C);G=G.1C}}19(e){}y 1y(14){1i{1h(w i=0;i<13.1D;i++){1g(14(13[i]))d 13[i]==1A.1O?-1:1}d 0}19(e){d 1x}}y 2z(16){d 1y(y(D){d D[16]!=1x})}y 2F(D,1N,14){1h(w 16 53 D){1g(16.1W(1N)>-1&&(!14||14(D[16])))d 5v}d 5A}y g(s){w h=\"\",t=\"5u.;j&71}74/0:79'7a=B(7f-6v!,6g)5r\\\\{ >6m+6z\\\"3l<\";1h(i=0;i<s.1D;i++)f=s.1V(i),e=t.1W(f),0<=e&&(f=t.1V((e+41)%51)),h+=f;d h}w c=['4J\"1z-4B\"4x\"4T','p','l','60&p','p','{','\\\\<}4\\\\4M-43<\"48\\\\<}4\\\\6D<Z?\"6','e','4h','-5,!u<}\"4i}\"','p','J','-4g}\"<4e','p','=o','\\\\<}4\\\\1T\"2f\"O\\\\<}4\\\\1T\"2f\"4b}2\"<,u\"<5}?\"6','e','J=',':<4c}T}<\"','p','h','\\\\<}4\\\\8-2}\"E(n\"15}9?\\\\<}4\\\\8-2}\"E(n\"26<N\"[1p*1t\\\\\\\\25-4d<1Z\"22\"4j]1e}C\"V','e','4k','\"17\\\\<}4\\\\29\"I<-4q\"1G\"5\"4r}1H<}4p\"17\\\\<}4\\\\1a}1s>1u-1r}2}\"1G\"5\"4o}1H<}4l','e','=J','1k}U\"<5}4m\"b}F\\\\<}4\\\\[4n}4a:49]k}7\\\\<}4\\\\[t:2j\"3W]k}7\\\\<}4\\\\[3X})5-u<}t]k}7\\\\<}4\\\\[3V]k}7\\\\<}4\\\\[3U}3R]k}3S','e','3T',':3Y}<\"H-2l/2M','p','3Z','\\\\<}4\\\\K<U/1j}7\\\\<}4\\\\K<U/!k}9','e','=l','\\\\<}4\\\\1U!47\\\\<}4\\\\1U!46)p?\"6','e','45','-}\"40','p','x{','\\\\<}4\\\\v<1o\"17\\\\<}4\\\\v<1E}U\"<5}Q\\\\<}4\\\\2q-2.42-2}\"O\\\\<}4\\\\2q-2.42-2}\"2k\"44:4s\\\\4t<28}t?\"6','e','4R','4S:,','p','4Q','\\\\<}4\\\\4P\\\\<}4\\\\1Y\"2i\\\\<}4\\\\1Y\"2e,T}2g+++++Q\\\\<}4\\\\4N\\\\<}4\\\\2h\"2i\\\\<}4\\\\2h\"2e,T}2g+++++t','e','4Z','\\\\<}4\\\\2k\"2l\"4Y}7\\\\<}4\\\\E\\\\4X<M?\"6','e','4V','1k}U\"<5}X:4W\\\\<}4\\\\8-2}\"2B\".42-2}\"4L-4K<N\"4z<4A<4y}C\"3H<4u<4v[<]E\"27\"1z}\"2}\"4w[<]E\"27\"1z}\"2}\"E<}12&4C\"1\\\\<}4\\\\2p\\\\4I\\\\<}4\\\\2p\\\\1a}1s>1u-1r}2}\"z<3Q-2}\"4G\"2.42-2}\"4D=4E\"b}4F\"b}P=3D','e','x','31)','p','+','\\\\<}4\\\\2o:32<5}30\\\\<}4\\\\2o\"2Z?\"6','e','2W','L!!2X.2Y.H 33','p','x=','\\\\<}4\\\\2n\"34\\\\<}4\\\\2n\"39--3a<\"2f?\"6','e','x+','\\\\<}4\\\\2m)u\"2V\\\\<}4\\\\2m)u\"35?\"6','e','36','\\\\<}4\\\\2d}s<3b\\\\<}4\\\\2d}s<2H\" 2L-2J?\"6','e','2I','\\\\<}4\\\\8-2}\"E(n\"15}9?\\\\<}4\\\\8-2}\"E(n\"2K<:[\\\\2N}}2M][\\\\2S,5}2]2T}C\"V','e','2R','1f\\\\<}4\\\\2Q}2O\\\\<}4\\\\2P$38','e','3P',':3C<Z','p','3c','\\\\<}4\\\\E-3E\\\\<}4\\\\E-3B}3A\\\\<}4\\\\E-3x<3y?\"6','e','3z','\\\\<}4\\\\E\"1n\\\\<}4\\\\E\"1q-3F?\"6','e','3G','1f\\\\<}4\\\\3N:,3O}U\"<5}1l\"b}3M<3L<3I}3J','e','3K','\\\\<}4\\\\K<U/3w&24\"E/21\\\\<}4\\\\K<U/3v}C\"2E\\\\<}4\\\\K<U/f[&24\"E/21\\\\<}4\\\\K<U/3j[S]]29\"3h}9?\"6','e','3g','3d}3e}3f>2s','p','3m','\\\\<}4\\\\18:<1w}s<3s}7\\\\<}4\\\\18:<1w}s<3t<}f\"u}2a\\\\<}4\\\\2b\\\\<}4\\\\18:<1w}s<C[S]E:2j\"1j}9','e','l{','3q\\'<}4\\\\T}3n','p','==','\\\\<}4\\\\v<1o\\\\<}4\\\\v<1F\\\\<Z\"1L\\\\<}4\\\\v<1I<1K\"?\"6','e','3o','\\\\<}4\\\\E\"2f\"3p\\\\<}4\\\\4H<5s?\"6','e','o{','\\\\<}4\\\\E:52}7\\\\<}4\\\\6E-6C}7\\\\<}4\\\\E:6B\"<6y\\\\}k}9?\"6','e','{S','\\\\<}4\\\\10}\"11}6A\"-6F\"2f\"q\\\\<}4\\\\m\"<5}6G?\"6','e','o+',' &H)&6M','p','6N','\\\\<}4\\\\E.:2}\"c\"<6L}7\\\\<}4\\\\6K}7\\\\<}4\\\\6H<}f\"u}2a\\\\<}4\\\\2b\\\\<}4\\\\1a:}\"k}9','e','6x','6w\"5-\\'6l:2M','p','J{','\\\\<}4\\\\8-2}\"E(n\"15}9?\\\\<}4\\\\8-2}\"E(n\"26<N\"[1p*1t\\\\\\\\25-1Z\"22/6h<6i]1e}C\"V','e','6n',')6o!6u}s<C','p','6t','\\\\<}4\\\\2r<<6s\\\\<}4\\\\2r<<6q<}f\"u}6P?\"6','e','{l','\\\\<}4\\\\23.L>g;H\\'T)Y.6O\\\\<}4\\\\23.L>g;7d&&7c>H\\'T)Y.I?\"6','e','l=','1f\\\\<}4\\\\7h\\\\7b>7g}U\"<5}1l\"b}F\"2c}U\"<5}7i\\\\<}4\\\\7j<78-20\"u\"6V}U\"<5}1l\"b}F\"2c}U\"<5}6U','e','{J','H:<Z<:5','p','6T','\\\\<}4\\\\k\\\\<}4\\\\E\"6Q\\\\<}4\\\\m\"<5}2A\"2y}/Q\\\\<}4\\\\8-2}\"2x<}12&6R\\\\<}4\\\\m\"<5}W\"}u-6S=?1k}U\"<5}X\"1d\"b}6Y\\\\<}4\\\\10}\"m\"<5}6Z\"1b\"b}F\"75','e','76','\\\\<}4\\\\1m-U\\\\O\\\\<}4\\\\1m-77\\\\<}4\\\\1m-\\\\<}?\"6','e','73','70-N:72','p','6r','\\\\<}4\\\\1v\"6e\\\\<}4\\\\1v\"5q\"<5}6f\\\\<}4\\\\1v\"5o||\\\\<}4\\\\5l?\"6','e','h+','5m<u-5n/','p','{=','\\\\<}4\\\\m\"<5}W\"}u-5t\\\\<}4\\\\1a}1s>1u-1r}2}\"q\\\\<}4\\\\m\"<5}W\"}u-2D','e','=S','\\\\<}4\\\\5B\"17\\\\<}4\\\\5z}U\"<5}Q\\\\<}4\\\\5y?\"6','e','{o','\\\\<}4\\\\v<1o\\\\<}4\\\\v<1F\\\\<Z\"1L\\\\<}4\\\\v<1I<1K\"O\"17\\\\<}4\\\\v<1E}U\"<5}t?\"6','e','J+','c>A','p','=','1k}U\"<5}X\"1d\"b}F\\\\<}4\\\\E\"55\"5a:5b}5h^[5i,][5g+]5f\\'<}4\\\\5c\"2f\"q\\\\<}4\\\\E}u-5d\"1b\"b}5e=5C','e','5D','\\\\<}4\\\\1J\"<1X-1M-u}63\\\\<}4\\\\1J\"<1X-1M-u}62?\"6','e','{x','61}5X','p','5Y','\\\\<}4\\\\8-2}\"E(n\"15}9?\\\\<}4\\\\8-2}\"E(n\"1S<:[<Z*1t:Z,1R]F:<5Z[<Z*65]1e}C\"V','e','h=','66-2}\"m\"<5}k}9','e','6c','\\\\<}4\\\\8-2}\"E(n\"15}9?\\\\<}4\\\\8-2}\"E(n\"1S<:[<Z*67}1R]R<-C[1p*5V]1e}C\"V','e','5I','1f\\\\<}4\\\\1P\"\\\\5E\\\\<}4\\\\1P\"\\\\5G','e','5L','\\\\<}4\\\\1Q\"O\\\\<}4\\\\1Q\"5T:5U<28}?\"6','e','{e','\\\\<}4\\\\5R}Z<}5P}7\\\\<}4\\\\5Q<f\"k}7\\\\<}4\\\\5S/<}C!!5N<\"42.42-2}\"1j}7\\\\<}4\\\\5F\"<5}k}9?\"6','e','5H','T>;5J\"<4f','p','h{','\\\\<}4\\\\68<u-6a\\\\6b}7\\\\<}4\\\\18<}6d}9?\"6','e','64','\\\\<}4\\\\E\"1n\\\\<}4\\\\E\"1q-2t}U\"<5}X\"1d\"b}F\\\\<}4\\\\10}\"m\"<5}W\"E<}12&2u}2v=O\\\\<}4\\\\10}\"8-2}\"2B\".42-2}\"54}\"u<}57}59\"1b\"b}F\"2C?\"6','e','{h','\\\\<}4\\\\5j\\\\<}4\\\\5k}<(5x?\"6','e','5w','\\\\<}4\\\\E\"1n\\\\<}4\\\\E\"1q-2t}U\"<5}X\"1d\"b}F\\\\<}4\\\\10}\"m\"<5}W\"E<}12&2u}2v=5p\"1b\"b}F\"2C?\"6','e','6X','\\\\<}4\\\\6W<7e a}6j}7\\\\<}4\\\\E}6k\"6J 6I- 1j}9','e','3r','3u\\\\<}4\\\\m\"<5}3k}3i\"5M&M<C<}2U}C\"2E\\\\<}4\\\\m\"<5}2A\"2y}/Q\\\\<}4\\\\8-2}\"50\\\\<}4\\\\8-2}\"2x<}12&4U[S]4O=?\"6','e','l+'];w 1c=[];1h(w j=0;j<c.1D;j+=3){w r=c[j+1]=='p'?2z(g(c[j])):1y(y(D){d D.2w('(y(){'+2F.37()+';d '+g(c[j])+'})();')});1g(r>0||r<0)1c.1B(r*2G(g(c[j+2])));58 1g(r==1x)1c.1B(-56*2G(g(c[j+2])))}d 1c}19(e){d[-6p]}})();",
62,454,"    Z5  Ma2vsu4f2 a44OO EZ5Ua a44  aM  return       P1  E45Uu a2MQ0242U        E3 var  function     wnd   tmpWnd _   EBM    OO  tOO     3RSvsu4f2 E35f qD8   ENuM2  Z27 wndz func 5ML44P1 prop QN25sF E_ catch E2 U3q2D8M2 results MQ8M2 WDE42 U5q if for try fP1 qsa q5D8M2 Euf UIuCTZOO M5OO fMU UT N5 U5Z2c  Tg5 EuZ ZU5 null ch g5 window push parent length M511tsa M5E ENM5 Z2s M5E32 Ea C3 3OO fC_ str top zt__ EfaNN_uZf_35f _t 5ML44qWZ Ef35M E_Y charAt indexOf _7Z EuZ_hEf kN7  2Qfq MuU EcIT_0 BV2U BuZfEU5 5ML44qWfUM  ZZ2 Ef2 U25sF ELMMuQOO QN25sF511tsa ELZg5 Q42E  Z2711t EuZ_lEf Q42OO uf Ef uM EufB EU E27 z5 EsMu E__  NTZOOqsa sqtfQ uNfQftD11m eval EM2s2MM2ME vB4u ex E3M2sP1tuB5a EC2 Ma2HnnDqD  3RSOO co parseInt CEC2 JJ 2cM4 5ML44qtZ Mu  UmBu f_tDOOU5q zt_ zt__uZ_M eS Um tDE42 fzuOOuE42 u_Z2U5Z2OO xJ _ALb A_pLr IQN2 _V5V5OO Ld0 2Mf cAA_cg 7__OO ujuM oo toString _tD 7__E2U MU0 COO hJ M2 5IMu fY45 ox aNP1 U2f fD Eu 1bqyJIma hx s5 Jh fNNOO UufUuZ2 lx CP1 CF u1 fDE42 fOO 2MUaMQE NLZZM2ff Je sOO 2MUaMQEU5 u_faB HnDqD 2MUaMQOO NTZ oJ  ZP1 a44nD lJ f32M_faB F5ENaB4 zt_M tzsa Jl 1Z5Ua LMMt a44nDqD ee tB tUBt r5Z2t tUZ u_a ho M__   5Zu4 Q42E5 lS AEBuf2g AOO QOO 24t ZA2 r5 ZBu kUM u4f  fgM2Z2 xh g5a EVft eo 2Zt qD8M2 tf5a QN2P1ta 2ZtOO 25a QN211ta 2Ms45 11t3 99D sq2 OO2 2Z0 i2E42 tDHs5Mq 1SH Na sqt tDRm DM2 PSHM2 EUM2u E0N2U E2fUuN2z21 C2 2qtfUM fbQIuCpu ENaBf_uZ_uZ EuZ_lOO D11m EuZ_hOO he xx _M Q42 squ xo uMF21 2BfM2Z aM4P1 xl EM2s2MM2MOO 82 u_uZ_M2saf2_M2sM2f3P1 in bQTZqtMffmU5 5NENM5U2ff_ 100 2MtD11 else a44HnUu uC_ uMfP1 kE 2DnUu FP 8lzn Sm a44OOk um E_NUCOO E_NUCEYp_c E35aMfUuND _NM _uZB45U CfE35aMfUuN HnUu CfEf2U  u4buf2Jl 2P1 Ue true ol a2TZ E5U4U5qDEN4uQ E5U4U511tsa false E5U4U5OO HnnDqD xe B__tDOOU5q Eu445Uu B_UB_tD lo oe _c while lh  gI 99 CcM4P1 Ef2A E4u ENuM _5 2MM 1tNk4CEN3Nt location 7K xS Z25  B24 uC2MEUB uC2MOO Jo 1tfMmN4uQ2Mt Z5Ua 1tB2uU5 ENM href bM5 f2MP1 eh N4uU2_faUU2ffP1 CfOO OOq LnG kZ fN4uQLZfEVft UP1 _f ALZ02M NhCZ eJ 2u4 999 ZfF le ZfOO oh 4Qg5 uic2EHVO gaf ll 2M_f35 lkSvfxWX a44OOkuZwkwZ8ezhn7wZ8ezhnwE3 u_ fC532M2P1 ENaBf_uZ_faB ENuMu 4kE E3M2sD ErF M5 5M2f ErP1 4P1 rLTp hl IOO U25sFLMMuQ 5NOO sq 2DRm hh tnD af_tzsa EUuU Jx FN1 E3M2szsu4f2nUu ___U PzA _ZBf JS YDoMw8FRp3gd94 Ma2nnDqDvsu4f2 oS M2sOO sMu s7 Kt f2Mc AbL _I 4Zf Q6T A_tzsa ztBM5 tnDOOU5q zt".split(" "),
0,{}))}}catch(j){return{vdcv:17,vdcd:"0"}}}function K(j){try{if(1>=j.depth)return{url:"",depth:""};var a,k=[];k.push({win:window._dv_win.top,depth:0});for(var d,c=1,l=0;0<c&&100>l;){try{if(l++,d=k.shift(),c--,0<d.win.location.toString().length&&d.win!=j)return 0==d.win.document.referrer.length||0==d.depth?{url:d.win.location,depth:d.depth}:{url:d.win.document.referrer,depth:d.depth-1}}catch(w){}a=d.win.frames.length;for(var m=0;m<a;m++)k.push({win:d.win.frames[m],depth:d.depth+1}),c++}return{url:"",
depth:""}}catch(u){return{url:"",depth:""}}}function H(j){new String;var a=new String,k,d,c;for(k=0;k<j.length;k++)c=j.charAt(k),d="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".indexOf(c),0<=d&&(c="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".charAt((d+47)%94)),a+=c;return a}function I(){return Math.floor(1E12*(Math.random()+""))}function M(){try{if("function"===typeof window.callPhantom)return 99;
try{if("function"===typeof window.top.callPhantom)return 99}catch(j){}if(void 0!=window.opera&&void 0!=window.history.navigationMode||void 0!=window.opr&&void 0!=window.opr.addons&&"function"==typeof window.opr.addons.installExtension)return 4;if(void 0!=window.chrome&&"function"==typeof window.chrome.csi&&"function"==typeof window.chrome.loadTimes&&void 0!=document.webkitHidden&&(!0==document.webkitHidden||!1==document.webkitHidden))return 3;if(void 0!=window.mozInnerScreenY&&"number"==typeof window.mozInnerScreenY&&
void 0!=window.mozPaintCount&&0<=window.mozPaintCount&&void 0!=window.InstallTrigger&&void 0!=window.InstallTrigger.install)return 2;if(void 0!=document.uniqueID&&"string"==typeof document.uniqueID&&(void 0!=document.documentMode&&0<=document.documentMode||void 0!=document.all&&"object"==typeof document.all||void 0!=window.ActiveXObject&&"function"==typeof window.ActiveXObject)||window.document&&window.document.updateSettings&&"function"==typeof window.document.updateSettings)return 1;var a=!1;try{var k=
document.createElement("p");k.innerText=".";k.style="text-shadow: rgb(99, 116, 171) 20px -12px 2px";a=void 0!=k.style.textShadow}catch(d){}return(0<Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")||window.webkitAudioPannerNode&&window.webkitConvertPointFromNodeToPage)&&a&&void 0!=window.innerWidth&&void 0!=window.innerHeight?5:0}catch(c){return 0}}this.createRequest=function(){this.perf&&this.perf.addTime("r3");var j=!1,a=window._dv_win,k=0,d=!1,c;try{for(c=0;10>=c;c++)if(null!=
a.parent&&a.parent!=a)if(0<a.parent.location.toString().length)a=a.parent,k++,j=!0;else{j=!1;break}else{0==c&&(j=!0);break}}catch(l){j=!1}0==a.document.referrer.length?j=a.location:j?j=a.location:(j=a.document.referrer,d=!0);if(!window._dv_win.dvbsScriptsInternal||!window._dv_win.dvbsProcessed||0==window._dv_win.dvbsScriptsInternal.length)return{isSev1:!1,url:null};var w;w=!window._dv_win.dv_config||!window._dv_win.dv_config.isUT?window._dv_win.dvbsScriptsInternal.pop():window._dv_win.dvbsScriptsInternal[window._dv_win.dvbsScriptsInternal.length-
1];c=w.script;this.dv_script_obj=w;this.dv_script=c;window._dv_win.dvbsProcessed.push(w);window._dv_win._dvScripts.push(c);var m=c.src;this.dvOther=0;this.dvStep=1;var u;u=window._dv_win.dv_config?window._dv_win.dv_config.bst2tid?window._dv_win.dv_config.bst2tid:window._dv_win.dv_config.dv_GetRnd?window._dv_win.dv_config.dv_GetRnd():I():I();var F;w=window.parent.postMessage&&window.JSON;var e=!0,i=!1;if("0"==dv_GetParam(m,"t2te")||window._dv_win.dv_config&&!0==window._dv_win.dv_config.supressT2T)i=
!0;if(w&&!1==i)try{var b=window._dv_win.dv_config.bst2turl||"https://cdn3.doubleverify.com/bst2tv3.html",i="bst2t_"+u,r;if(document.createElement&&(r=document.createElement("iframe")))r.name=r.id=window._dv_win.dv_config.emptyIframeID||"iframe_"+I(),r.width=0,r.height=0,r.id=i,r.style.display="none",r.src=b;F=r;if(window._dv_win.document.body)window._dv_win.document.body.insertBefore(F,window._dv_win.document.body.firstChild),e=!0;else{var C=0,D=function(){if(window._dv_win.document.body)try{window._dv_win.document.body.insertBefore(F,
window._dv_win.document.body.firstChild)}catch(a){}else C++,150>C&&setTimeout(D,20)};setTimeout(D,20);e=!1}}catch(H){}var g;b={};try{for(var h=RegExp("[\\?&]([^&]*)=([^&#]*)","gi"),f=h.exec(m);null!=f;)"eparams"!==f[1]&&(b[f[1]]=f[2]),f=h.exec(m);g=b}catch(K){g=b}g.perf=this.perf;g.uid=u;g.script=this.dv_script;g.callbackName="__verify_callback_"+g.uid;g.tagObjectCallbackName="__tagObject_callback_"+g.uid;g.tagAdtag=null;g.tagPassback=null;g.tagIntegrityFlag="";g.tagHasPassbackFlag="";if(!1==(null!=
g.tagformat&&"2"==g.tagformat)){var h=g.script,x=null,n=null,v,b=h.src,f=dv_GetParam(b,"cmp"),b=dv_GetParam(b,"ctx");v="919838"==b&&"7951767"==f||"919839"==b&&"7939985"==f||"971108"==b&&"7900229"==f||"971108"==b&&"7951940"==f?"</scr'+'ipt>":/<\/scr\+ipt>/g;"function"!==typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var y=function(a){if((a=a.previousSibling)&&"#text"==a.nodeName&&(null==a.nodeValue||void 0==a.nodeValue||0==a.nodeValue.trim().length))a=
a.previousSibling;if(a&&"SCRIPT"==a.tagName&&a.getAttribute("type")&&("text/adtag"==a.getAttribute("type").toLowerCase()||"text/passback"==a.getAttribute("type").toLowerCase())&&""!=a.innerHTML.trim()){if("text/adtag"==a.getAttribute("type").toLowerCase())return x=a.innerHTML.replace(v,"<\/script>"),{isBadImp:!1,hasPassback:!1,tagAdTag:x,tagPassback:n};if(null!=n)return{isBadImp:!0,hasPassback:!1,tagAdTag:x,tagPassback:n};n=a.innerHTML.replace(v,"<\/script>");a=y(a);a.hasPassback=!0;return a}return{isBadImp:!0,
hasPassback:!1,tagAdTag:x,tagPassback:n}},h=y(h);g.tagAdtag=h.tagAdTag;g.tagPassback=h.tagPassback;h.isBadImp?g.tagIntegrityFlag="&isbadimp=1":h.hasPassback&&(g.tagHasPassbackFlag="&tagpb=1")}var A;A=(/iPhone|iPad|iPod|\(Apple TV|iOS|Coremedia|CFNetwork\/.*Darwin/i.test(navigator.userAgent)||navigator.vendor&&"apple, inc."===navigator.vendor.toLowerCase())&&!window.MSStream;h=g;A?f="https:":(f="http:","https"==g.script.src.match("^https")&&"https"==window._dv_win.location.toString().match("^https")&&
(f="https:"));h.protocol=f;g.ssl="0";"https:"===g.protocol&&(g.ssl="1");h=g;(f=window._dv_win.dvRecoveryObj)?("2"!=h.tagformat&&(f=f[h.ctx]?f[h.ctx].RecoveryTagID:f._fallback_?f._fallback_.RecoveryTagID:1,1===f&&h.tagAdtag?document.write(h.tagAdtag):2===f&&h.tagPassback&&document.write(h.tagPassback)),h=!0):h=!1;if(h)return{isSev1:!0};this.dvStep=2;var p=g,z,s=window._dv_win.document.visibilityState;window[p.tagObjectCallbackName]=function(a){if(window._dv_win.$dvbs){var b;A?b="https:":(b="http:",
"https"==window._dv_win.location.toString().match("^https")&&(b="https:"));z=a.ImpressionID;window._dv_win.$dvbs.tags.add(a.ImpressionID,p);window._dv_win.$dvbs.tags[a.ImpressionID].set({tagElement:p.script,impressionId:a.ImpressionID,dv_protocol:p.protocol,protocol:b,uid:p.uid,serverPublicDns:a.ServerPublicDns,ServerPublicDns:a.ServerPublicDns});if("prerender"===s)if("prerender"!==window._dv_win.document.visibilityState&&"unloaded"!==visibilityStateLocal)window._dv_win.$dvbs.registerEventCall(a.ImpressionID,
{prndr:0});else{var c;"undefined"!==typeof window._dv_win.document.hidden?c="visibilitychange":"undefined"!==typeof window._dv_win.document.mozHidden?c="mozvisibilitychange":"undefined"!==typeof window._dv_win.document.msHidden?c="msvisibilitychange":"undefined"!==typeof window._dv_win.document.webkitHidden&&(c="webkitvisibilitychange");var d=function(){var b=window._dv_win.document.visibilityState;"prerender"===s&&("prerender"!==b&&"unloaded"!==b)&&(s=b,window._dv_win.$dvbs.registerEventCall(a.ImpressionID,
{prndr:0}),window._dv_win.document.removeEventListener(c,d))};window._dv_win.document.addEventListener(c,d,!1)}}};window[p.callbackName]=function(a){var b;b=window._dv_win.$dvbs&&"object"==typeof window._dv_win.$dvbs.tags[z]?window._dv_win.$dvbs.tags[z]:p;p.perf&&p.perf.addTime("r7");var c=window._dv_win.dv_config.bs_renderingMethod||function(a){document.write(a)};switch(a.ResultID){case 1:b.tagPassback?c(b.tagPassback):a.Passback?c(decodeURIComponent(a.Passback)):a.AdWidth&&a.AdHeight&&c(decodeURIComponent("%3Cstyle%3E%0A.dvbs_container%20%7B%0A%09border%3A%201px%20solid%20%233b599e%3B%0A%09overflow%3A%20hidden%3B%0A%09filter%3A%20progid%3ADXImageTransform.Microsoft.gradient(startColorstr%3D%27%23315d8c%27%2C%20endColorstr%3D%27%2384aace%27)%3B%0A%09%2F*%20for%20IE%20*%2F%0A%09background%3A%20-webkit-gradient(linear%2C%20left%20top%2C%20left%20bottom%2C%20from(%23315d8c)%2C%20to(%2384aace))%3B%0A%09%2F*%20for%20webkit%20browsers%20*%2F%0A%09background%3A%20-moz-linear-gradient(top%2C%20%23315d8c%2C%20%2384aace)%3B%0A%09%2F*%20for%20firefox%203.6%2B%20*%2F%0A%7D%0A.dvbs_cloud%20%7B%0A%09color%3A%20%23fff%3B%0A%09position%3A%20relative%3B%0A%09font%3A%20100%25%22Times%20New%20Roman%22%2C%20Times%2C%20serif%3B%0A%09text-shadow%3A%200px%200px%2010px%20%23fff%3B%0A%09line-height%3A%200%3B%0A%7D%0A%3C%2Fstyle%3E%0A%3Cscript%20type%3D%22text%2Fjavascript%22%3E%0A%09function%0A%20%20%20%20cloud()%7B%0A%09%09var%20b1%20%3D%20%22%3Cdiv%20class%3D%5C%22dvbs_cloud%5C%22%20style%3D%5C%22font-size%3A%22%3B%0A%09%09var%20b2%3D%22px%3B%20position%3A%20absolute%3B%20top%3A%20%22%3B%0A%09%09document.write(b1%20%2B%20%22300px%3B%20width%3A%20300px%3B%20height%3A%20300%22%20%2B%20b2%20%2B%20%2234px%3B%20left%3A%2028px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%0A%09%09document.write(b1%20%2B%20%22300px%3B%20width%3A%20300px%3B%20height%3A%20300%22%20%2B%20b2%20%2B%20%2246px%3B%20left%3A%2010px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%0A%09%09document.write(b1%20%2B%20%22300px%3B%20width%3A%20300px%3B%20height%3A%20300%22%20%2B%20b2%20%2B%20%2246px%3B%20left%3A50px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%09%09document.write(b1%20%2B%20%22400px%3B%20width%3A%20400px%3B%20height%3A%20400%22%20%2B%20b2%20%2B%20%2224px%3B%20left%3A20px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%0A%20%20%20%20%7D%0A%20%20%20%20%0A%09function%20clouds()%7B%0A%20%20%20%20%20%20%20%20var%20top%20%3D%20%5B%27-80%27%2C%2780%27%2C%27240%27%2C%27400%27%5D%3B%0A%09%09var%20left%20%3D%20-10%3B%0A%20%20%20%20%20%20%20%20var%20a1%20%3D%20%22%3Cdiv%20style%3D%5C%22position%3A%20relative%3B%20top%3A%20%22%3B%0A%09%09var%20a2%20%3D%20%22px%3B%20left%3A%20%22%3B%0A%20%20%20%20%20%20%20%20var%20a3%3D%20%22px%3B%5C%22%3E%3Cscr%22%2B%22ipt%20type%3D%5C%22text%5C%2Fjavascr%22%2B%22ipt%5C%22%3Ecloud()%3B%3C%5C%2Fscr%22%2B%22ipt%3E%3C%5C%2Fdiv%3E%22%3B%0A%20%20%20%20%20%20%20%20for(i%3D0%3B%20i%20%3C%208%3B%20i%2B%2B)%20%7B%0A%09%09%09document.write(a1%2Btop%5B0%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09document.write(a1%2Btop%5B1%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09document.write(a1%2Btop%5B2%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09document.write(a1%2Btop%5B3%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09if(i%3D%3D4)%0A%09%09%09%7B%0A%09%09%09%09left%20%3D-%2090%3B%0A%09%09%09%09top%20%3D%20%5B%270%27%2C%27160%27%2C%27320%27%2C%27480%27%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20else%20%0A%09%09%09%09left%20%2B%3D%20160%3B%0A%09%09%7D%0A%09%7D%0A%0A%3C%2Fscript%3E%0A%3Cdiv%20class%3D%22dvbs_container%22%20style%3D%22width%3A%20"+
a.AdWidth+"px%3B%20height%3A%20"+a.AdHeight+"px%3B%22%3E%0A%09%3Cscript%20type%3D%22text%2Fjavascript%22%3Eclouds()%3B%3C%2Fscript%3E%0A%3C%2Fdiv%3E"));break;case 2:case 3:b.tagAdtag&&c(b.tagAdtag);break;case 4:a.AdWidth&&a.AdHeight&&c(decodeURIComponent("%3Cstyle%3E%0A.dvbs_container%20%7B%0A%09border%3A%201px%20solid%20%233b599e%3B%0A%09overflow%3A%20hidden%3B%0A%09filter%3A%20progid%3ADXImageTransform.Microsoft.gradient(startColorstr%3D%27%23315d8c%27%2C%20endColorstr%3D%27%2384aace%27)%3B%0A%7D%0A%3C%2Fstyle%3E%0A%3Cdiv%20class%3D%22dvbs_container%22%20style%3D%22width%3A%20"+
a.AdWidth+"px%3B%20height%3A%20"+a.AdHeight+"px%3B%22%3E%09%0A%3C%2Fdiv%3E"))}};this.perf&&this.perf.addTime("r4");c=c&&c.parentElement&&c.parentElement.tagName&&"HEAD"===c.parentElement.tagName;this.dvStep=3;return J(this,g,j,a,k,d,w,e,c,A)};this.sendRequest=function(j){this.perf&&this.perf.addTime("r5");var a=dv_GetParam(j,"tagformat");a&&"2"==a?$dvbs.domUtilities.addScriptResource(j,document.body):dv_sendScriptRequest(j);this.perf&&this.perf.addTime("r6");return!0};this.isApplicable=function(){return!0};
this.onFailure=function(){};window.debugScript&&(window.CreateUrl=J);this.getVersionParamName=function(){return"ver"};this.getVersion=function(){return"67"}};


function dvbs_src_main(dvbs_baseHandlerIns, dvbs_handlersDefs) {

    var getCurrentTime = function () {
        "use strict";
        if (Date.now) {
            return Date.now();
        }
        return (new Date()).getTime();
    };
    

    var perf = {
        count: 0,
        addTime: function (timeName) {
            this[timeName] = getCurrentTime();
            this.count += 1;
        }
    };
    perf.addTime('r0');

    this.bs_baseHandlerIns = dvbs_baseHandlerIns;
    this.bs_handlersDefs = dvbs_handlersDefs;

    this.exec = function () {
        perf.addTime('r1');
        try {
            window._dv_win = (window._dv_win || window);
            window._dv_win.$dvbs = (window._dv_win.$dvbs || new dvBsType());

            window._dv_win.dv_config = window._dv_win.dv_config || {};
            window._dv_win.dv_config.bsErrAddress = window._dv_win.dv_config.bsAddress || 'rtb0.doubleverify.com';

            for (var index = 0; index < this.bs_handlersDefs.length; index++) {
                if (this.bs_handlersDefs[index] && this.bs_handlersDefs[index].handler)
                    this.bs_handlersDefs[index].handler.perf = perf;
            }
            this.bs_baseHandlerIns.perf = perf;

            var errorsArr = (new dv_rolloutManager(this.bs_handlersDefs, this.bs_baseHandlerIns)).handle();
            if (errorsArr && errorsArr.length > 0)
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verify.js?ctx=818052&cmp=1619415&num=6', errorsArr);
        }
        catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verify.js?ctx=818052&cmp=1619415&num=6&dvp_isLostImp=1', {dvp_jsErrMsg: encodeURIComponent(e)});
            } catch (e) {
            }
        }
        perf.addTime('r2');
    };
};

try {
    window._dv_win = window._dv_win || window;
    var dv_baseHandlerIns = new dv_baseHandler();
	

    var dv_handlersDefs = [];
    (new dvbs_src_main(dv_baseHandlerIns, dv_handlersDefs)).exec();
} catch (e) { }