#!/usr/bin/env python

# Runs locally to chop kanji svg data up into a JS format suitable for direct client consumption.
from xml.dom.minidom import parse
from django.utils import simplejson

import re

def parsexml(filename):

    fileMap = [
        [ur'[\u0020-\u00ff]', 'asciikana.js'],
        [ur'[\u3000-\u30ff]', 'asciikana.js'],
        [ur'[\u4e00-\u5dff]', 'kanji1.js'],
        [ur'[\u5e00-\u6dff]', 'kanji2.js'],
        [ur'[\u6e00-\u7dff]', 'kanji3.js'],
        [ur'[\u7e00-\u8dff]', 'kanji4.js'],
        [ur'[\u8e00-\u9faf]', 'kanji5.js'],
        [ur'[\u3400-\u4dbf]', 'kanji6.js']
    ]

    files = {}
    files.update([(f, open("../js/%s" % f, "wt")) for f in ["asciikana.js","kanji1.js","kanji2.js","kanji3.js","kanji4.js","kanji5.js","kanji6.js","misc.js"]])
    print files
    
    for fd in files.values():
        fd.write("kanjiSvg.onload({");
    
    print "Parsing: %s" % filename
    xml = parse(filename)
    cnt = 0
    for elem in xml.getElementsByTagName("kanji"):
	moji = elem.attributes["midashi"].value
	svg = ""
	for stroke in elem.getElementsByTagName("stroke"):
	    try:
		svg += stroke.attributes["path"].value
	    except:
		pass
        filename = "misc.js"
        for r, f in fileMap:
            if re.match(r, moji):
                filename = f
                break

	files[filename].write((u"\"%s\":\"%s\"," % (moji, svg)).encode("utf-8"))

	cnt += 1
	if cnt % 100 == 0:
	    print "%d..." % cnt,


    for filename, fd in files.items():
        fd.write("\"dummy\":false}, \"%s\");" % (filename));

if __name__ == "__main__":
    parsexml("kanjivg-20100513.xml")
