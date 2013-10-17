module Tabulatr::Data::Pagination

  def apply_pagination(offset: 0, pagesize: 10, pages: nil, page: 1, count: nil)
    @relation = @relation.limit(pagesize).offset(offset)
  end

  def compute_pagination(page, pagesize)
    count = @relation.count
    page ||= 1
    pagesize, page = pagesize.to_i, page.to_i
    pagesize = 10 if pagesize == 0

    pages = (count/pagesize.to_f).ceil
    page = [page, pages].min

    {
      offset: ((page-1)*pagesize).to_i,
      pagesize: pagesize,
      pages: pages,
      page: page,
      count: count
    }
  end
end

Tabulatr::Data.send :include, Tabulatr::Data::Pagination
