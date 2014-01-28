#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template, util
import cgi, os

class MainHandler(webapp.RequestHandler):
    def get(self):
	path = os.path.join(os.path.dirname(__file__), 'templates', 'index.html')
        self.response.out.write(template.render(path, {}))

class PageNotFoundHandler(webapp.RequestHandler):
    def get(self):
	self.response.set_status(404)
        self.response.out.write('Whoops! Page doesn\'t seem to exist!')

def main():
    application = webapp.WSGIApplication([
		(r'/', MainHandler),
		(r'.*', PageNotFoundHandler),
	], debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
