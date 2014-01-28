
var kanjiSvg = new (function() {
	var kanjiSvg = {};
	var kanjiSvgLoading = [];
	var kanjiSvgLoaded = [];
	var kanjiSvgQueue = [];

	function kanjiSvg_loadJS(filename)
	{
		if(kanjiSvgLoading.indexOf(filename) == -1)
		{
			var elem = document.createElement("script");
			elem.type = "text/javascript";
			elem.src = "/js/" + filename;
			document.body.appendChild(elem);
	
			kanjiSvgLoading[kanjiSvgLoading.length] = filename;
		}
	}

	this.getSvg = function(moji, success, error)
	{
		// Replace zenkaku numbers with hankaku.
		var hansuji = "0123456789()";
		var zensuji = "０１２３４５６７８９（）";
		if(zensuji.indexOf(moji) != -1)
			moji = hansuji[zensuji.indexOf(moji)];
	
		if(typeof(kanjiSvg[moji]) != "undefined")
			success(moji, kanjiSvg[moji]);
		else
		{
			var fileMap = [
        			[/[\u0020-\u00ff]/, 'asciikana.js'],
        			[/[\u3000-\u30ff]/, 'asciikana.js'],
        			[/[\u4e00-\u5dff]/, 'kanji1.js'],
        			[/[\u5e00-\u6dff]/, 'kanji2.js'],
        			[/[\u6e00-\u7dff]/, 'kanji3.js'],
        			[/[\u7e00-\u8dff]/, 'kanji4.js'],
        			[/[\u8e00-\u9faf]/, 'kanji5.js'],
        			[/[\u3400-\u4dbf]/, 'kanji6.js']
			];
	
			var filename = "misc.js";
        		for(var i = 0; i < fileMap.length; i++)
				if(fileMap[i][0].exec(moji))
					filename = fileMap[i][1];
	
			if(kanjiSvgLoaded.indexOf(filename)!=-1)
				error(moji);
			else
			{
				kanjiSvgQueue[kanjiSvgQueue.length] = [filename, moji, success, error];
				kanjiSvg_loadJS(filename);
			}
		}
	}
	
	this.onload = function(data, filename)
	{
		for(var i in data)
			kanjiSvg[i] = data[i];
		kanjiSvgLoaded[kanjiSvgLoaded.length] = filename;

		// Process any pending requests (in order)
		while(kanjiSvgQueue.length)
		{
			if(kanjiSvgQueue[0][0] != filename)
				break;
			var item = kanjiSvgQueue.shift();
			if(typeof(kanjiSvg[item[1]]) == "undefined")
				item[3](item[1]);
			else
				item[2](item[1], kanjiSvg[item[1]]);
		}
	}
	
	// Preload the most common kanji files
	function kanjiSvg_preloader() {
		kanjiSvg_loadJS("asciikana.js");
		kanjiSvg_loadJS("kanji1.js");
		kanjiSvg_loadJS("kanji2.js");
		kanjiSvg_loadJS("kanji3.js");
		kanjiSvg_loadJS("kanji4.js");
		kanjiSvg_loadJS("kanji5.js");
		kanjiSvg_loadJS("kanji6.js");
		kanjiSvg_loadJS("misc.js");
	};
	window.addEventListener("load", kanjiSvg_preloader, false);

 	return this;
})();
