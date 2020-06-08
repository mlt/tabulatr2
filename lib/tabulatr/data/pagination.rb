#--
# Copyright (c) 2010-2014 Peter Horn & Florian Thomas, metaminded UG
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#++

module Tabulatr::Data::Pagination

  def apply_pagination(offset: 0, pagesize: nil)
    @relation = @relation.limit(pagesize).offset(offset)
  end

  def compute_pagination(page, pagesize)
    count = @relation.count(:all)
    count = count.count if count.is_a?(Hash)
    page ||= 1
    pagesize, page = pagesize.to_i, page.to_i
    pagesize = Tabulatr::pagesize if pagesize == 0

    pages = (count/pagesize.to_f).ceil
    {
      offset: [0,((page-1)*pagesize).to_i].max,
      pagesize: pagesize,
      pages: pages,
      page: page,
      count: count
    }
  end
end

Tabulatr::Data.send :include, Tabulatr::Data::Pagination
