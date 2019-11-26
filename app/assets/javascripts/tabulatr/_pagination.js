(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.TabulatrPagination = factory(root.$);
  }
}(typeof self !== 'undefined' ? self : this, function ($) {

function TabulatrPagination(pageCount, tableId){
  this.pageCount = pageCount;
  this.tableId = tableId;
}

TabulatrPagination.prototype = {
  constructor: TabulatrPagination,

  createPaginationListItem: function(page, active){
    var $page = $('<li><a href="" data-page="'+ page +'">'+ page +'</a></li>');
    if(active){
      $page.addClass('active');
    }
    return $page;
  },

  updatePagination: function(currentPage){
    var $paginatorUl = $('.pagination[data-table='+ this.tableId +'] > ul');
    $paginatorUl.html(this.createResetButton());
    if(this.pageCount < 13){
      for(var i = 1; i <= this.pageCount; i++){
        $paginatorUl.append(this.createPaginationListItem(i, (i == currentPage)));
      }
    }else{
      if(currentPage > 1){
        $paginatorUl.append(this.createPaginationListItem(1, false));
      }

      var between = Math.floor((1 + currentPage) / 2);
      if(between > 1 && between < currentPage - 2){
        $paginatorUl.append('<li><span>...</span></li>');
        $paginatorUl.append(this.createPaginationListItem(between, false));
      }

      if(currentPage > 4){
        $paginatorUl.append('<li><span>...</span></li>');
      }

      if(currentPage > 3){
        $paginatorUl.append(this.createPaginationListItem(currentPage-2, false));
      }

      if(currentPage > 2){
        $paginatorUl.append(this.createPaginationListItem(currentPage-1, false));
      }

      $paginatorUl.append(this.createPaginationListItem(currentPage, true));

      if(currentPage < this.pageCount - 1){
        $paginatorUl.append(this.createPaginationListItem(currentPage+1, false));
      }

      if(currentPage < this.pageCount - 2){
        $paginatorUl.append(this.createPaginationListItem(currentPage+2, false));
      }

      if(currentPage < this.pageCount - 3){
        $paginatorUl.append('<li><span>...</span></li>');
      }

      between = Math.floor((currentPage + this.pageCount) / 2);

      if(this.additionalPlaceholderNeeded(between, currentPage)){
        $paginatorUl.append(this.createPaginationListItem(between, false));
        $paginatorUl.append('<li><span>...</span></li>');
      }
      if(currentPage < this.pageCount){
        $paginatorUl.append(this.createPaginationListItem(this.pageCount, false));
      }
    }

  },

  createResetButton: function() {
    var html = '';
    if($('table#'+ this.tableId).data('persistent')){
      html = '<li><a href="#" data-tabulatr-reset="'+ this.tableId +'"><i class="fa fa-refresh"></i></a></li>';
    }
    return html;
  },

  additionalPlaceholderNeeded: function(pageToCompare, currentPage){
    return pageToCompare > currentPage + 3 && pageToCompare < this.pageCount - 1;
  }
}

  return TabulatrPagination;
}));
