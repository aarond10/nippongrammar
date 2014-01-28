/**
 * This library provides a relatively painless way to make use of HTML5 local storage for 
 * client-side persistent caching of various data. 
 *
 * Relies on jquery 1.3.
 *
 * Usage:
 *    var kanjiData = new CachedReadOnlyDataStore("kanji", "http://www.readalongkanji.com/kanjivg/json");
 *    var data = kanjiData.getItem("童");
 *    // render strokes or something
 *    var data = kanjiData.getItem("河");
 *    // render strokes or something
 *    var data = kanjiData.getItem("童");
 *    // render strokes or something (cached read)
 */
CachedReadOnlyDataStore = function(name, datasource_url) {

    var dataCache = {};
    
    this.getItem = function(key, success, error) {
        if(key in dataCache)
            return success(key, dataCache[key]);

        if(typeof localStorage != "undefined") {
            var res = localStorage.getItem(name + "_" + key);
            if(res)
                return success(key, res);
        }
        
        $.ajax({type:"GET",url:datasource_url,dataType:"json",data:{key:key}, success:function(data) {
                for(var i in data.items) {
                    dataCache[i] = data.items[i];
                    if(typeof localStorage != "undefined") {
                        try {
                            localStorage.setItem(name + "_" + i, data.items[i]);
                        } catch(e) {
                            // This exception is not defined in my Chrome version.
                            /*if(e == QUOTA_EXCEEDED_ERR) {
                                // purge oldest entries?
                                // for now we just rely on our page-local dataCache structure.
                            }*/
                        }
                    }
                }
                if(key in dataCache)
                    return success(key, dataCache[key]);
                else
                    return error(key);
            },
            error: function(data) {
                return error(key);
            }
        });
    };
};

