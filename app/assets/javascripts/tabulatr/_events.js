(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        factory(require('jquery'), require('./_tabulatr'));
    } else {
        // Browser globals (root is window)
        factory(root.$, root.Tabulatr);
  }
}(typeof self !== 'undefined' ? self : this, function ($, Tabulatr) {

  $(document).on('inview', '.pagination_trigger.inview', function(event, isInView, visiblePartX, visiblePartY){
    if (isInView && visiblePartY !== 'top' && visiblePartY !== 'bottom') {
      var tableId = $(event.currentTarget).data('table');
      var table_obj = $('table#'+tableId).data('tabulatr');
      table_obj.updateTable({append: true});
    }
  });

  $(document).on('click', 'th.tabulatr-sortable', function(){
    var th = $(this);
    var sort_by = th.data('tabulatr-column-name');
    var dir = th.attr('data-sorted');
    var table = th.parents('table');
    var tableId = table.attr('id');
    var table_obj = table.data('tabulatr');
    var tableName = table_obj.id.split('_')[0];
    table.find('th.tabulatr-sortable.sorted').removeClass('sorted').removeAttr('data-sorted');
    dir = (dir === 'asc') ? 'desc' : 'asc';
    th.addClass('sorted').attr('data-sorted', dir);
    table.data('sort_by', sort_by + ' '+  dir);
    if(!table_obj.moreResults){
      table_obj.moreResults = true;
      if(table_obj.hasInfiniteScrolling){
        $('.pagination_trigger[data-table='+ tableId +']').addClass('inview');;
      }
    }
    $($(this).parents('table').find('tbody tr')).remove();

    $('.tabulatr_mark_all[data-table='+ tableName +']').prop('checked', false).prop('indeterminate', false);
    table_obj.updateTable({});
  });

  $(document).on('click', '.batch-action-inputs', function(){
    var a = $(this);
    if(a.attr('id')) // user wants specific action and has a handler for it
      return;
    var name = a.data('do-batch-action-name');
    var key = a.data('do-batch-action');
    var tableId = a.data('table-id');
    var params = {page: 1};
    var use_ajax = !a.data('download');
    params[name] = key;
    params.tabulatr_checked = {checked_ids: jQuery.map($('#'+ tableId +' .tabulatr-checkbox:checked'), function(el){return $(el).val();}).join(',')};
    var confirmation = true;
    if(params.tabulatr_checked.checked_ids === ''){
      confirmation = window.confirm(a.parents('ul').data('confirm-text'));
    }
    if(confirmation){
      $('.tabulatr_mark_all[data-table='+ tableId +']').prop('indeterminate', false).prop('checked', false);
      $('#'+ tableId +' .tabulatr-wrench').addClass('disabled');
      var table_obj = $('table#'+tableId).data('tabulatr');
      if (use_ajax)
        table_obj.updateTable(params, true);
      else
        table_obj.sendRequestWithoutAjax(params, a.data('extension'));
    }
  });

  $(document).on('submit', 'form.tabulatr-fuzzy-search', function(){
    var tableId = $(this).data('table');
    var table_obj = $('table#'+tableId).data('tabulatr');
    if(table_obj.hasInfiniteScrolling){
      $('.pagination_trigger[data-table='+ tableId +']').addClass('inview');;
    }
    table_obj.updateTable({page: 1, append: false}, true);
    return false;
  });

  $(document).on('change', 'form.tabulatr_filter_form input, form.tabulatr_filter_form select', function(){
    $(this).parents('form.tabulatr_filter_form').submit();
  });

  $(document).on('submit', 'form.tabulatr_filter_form', function(){
    var tableId = $(this).data('table');
    var table_obj = $('table#'+tableId).data('tabulatr');
    table_obj.submitFilterForm();
    return false;
  });

  $(document).on('click', '.tabulatr_mark_all', function(){
    var tableId = $(this).parents('table').prop('id');
    var table_obj = $('table#'+tableId).data('tabulatr');
    if($(this).is(':checked')){
      $('#'+ tableId +' tr[data-page]:visible input[type=checkbox]').prop('checked', true);
      $('#'+ tableId +' .tabulatr-wrench').removeClass('disabled');
    }else{
      $('#'+ tableId +' tr[data-page]:visible input[type=checkbox]').prop('checked', false);
      if(table_obj.checkIfCheckboxesAreMarked()){
        $('#'+ tableId +' .tabulatr-wrench').removeClass('disabled');
      }else{
        $('#'+ tableId +' .tabulatr-wrench').addClass('disabled');
      }
    }
  });

  $(document).on('click', '.tabulatr_table input.tabulatr-checkbox', function(){
    var $table = $(this).closest('.tabulatr_table');
    var tableId = $table.attr('id');
    var $markAllCheckbox = $table.find('.tabulatr_mark_all');
    var table_obj = $table.data('tabulatr');
    if($(this).is(':checked')){
      if($('#'+ tableId +' tr[data-page]:visible input[type=checkbox]').not(':checked').length > 0){
        $markAllCheckbox.prop("indeterminate", true);
      }else{
        $markAllCheckbox.prop('indeterminate', false);
        $markAllCheckbox.prop('checked', true);
      }
      $('#'+ tableId +' .tabulatr-wrench').removeClass('disabled');
    }else{
      if($('#'+ tableId +' tr[data-page]:visible input[type=checkbox]:checked').length > 0){
        $markAllCheckbox.prop('indeterminate', true);
        $('#'+ tableId +' .tabulatr-wrench').removeClass('disabled');
      }else{
        $markAllCheckbox.prop('indeterminate', false);
        $markAllCheckbox.prop('checked', false);
        if(table_obj.checkIfCheckboxesAreMarked()){
          $('#'+ tableId +' .tabulatr-wrench').removeClass('disabled');
        }else{
          $('#'+ tableId +' .tabulatr-wrench').addClass('disabled');
        }
      }
    }
  });

  $(document).on('click', '.tabulatr-per-page a', function(){
    if($(this).hasClass('active')){ return false; }
    $(this).closest('div').find('a').removeClass('active');
    $(this).addClass('active');
    var tableId = $(this).closest('div').data('table');
    var table_obj = $('table#'+tableId).data('tabulatr');
    table_obj.moreResults = true;
    if(table_obj.hasInfiniteScrolling){
      $('.pagination_trigger[data-table='+ tableId +']').addClass('inview');
    }
    if(typeof(Storage) !== undefined){
      try {
        localStorage.tabulatr_page_display_count = $(this).data('items-per-page');
      } catch(e) {}
    }
    table_obj.updateTable({page: 1}, true);
  });

  $(document).on('click', 'a[data-tabulatr-reset]',function(){
    var a = $(this);
    var tableId = a.data('tabulatrReset');
    a.parents('.tabulatr-outer-wrapper').removeClass('filtered');
    var table_obj = $('table#'+tableId).data('tabulatr');
    table_obj.resetTable();
    return false;
  });

  $(document).on('click', 'a[data-tabulatr-recycle]',function(){
    var a = $(this);
    var form = a.parents('form.tabulatr_filter_form');
    form[0].reset();
    form.submit();
    return false;
  });

  $(document).on('change', '.tabulatr_count > select', function(event){
    var tableId = $(event.target).parent().data('table');
    var tbl = $('table#' + tableId);
    tbl.data('pagesize', event.target.value);
    var table_obj = tbl.data('tabulatr');
    table_obj.submitFilterForm();
  });

  $(document).on('ready page:load turbolinks:load', function(event){
    $('.tabulatr_table').each(function(ix, el){
      if($('.pagination[data-table="'+ $(el).attr('id') +'"]').length === 0){
        $('.pagination_trigger[data-table="'+ $(el).attr('id') +'"]').addClass('inview');
      }
    });

    if($('.tabulatr_table:not(".tabulatr_static_table")').length > 0){
      if(typeof(Storage) !== undefined){
        try {
          var count = localStorage.tabulatr_page_display_count;
          if(count !== undefined){
            $('.tabulatr-per-page a').removeClass('active');
            $('.tabulatr-per-page a[data-items-per-page='+ count +']').
              addClass('active');
          }
        } catch(e) {}
      }
      var tableObj, tableId, tabulatrTable;
      $('.tabulatr_table:not(".tabulatr_static_table")').each(function(ix, el){
        if ($(el).data('tabulatr')) return; // can't figure out selector for above // mlt 20180926
        tableId = $(el).attr('id');
        tabulatrTable = new Tabulatr(tableId);
        if($(el).data('persistent')){
          try {
            localStorage._tabulatr_test = 1;
            tabulatrTable.isAPersistedTable = true;
          } catch(e) {}
        }
        if($('.pagination[data-table='+ tableId +']').length === 0){
          tabulatrTable.hasInfiniteScrolling = true;
        }
        $(el).data('tabulatr', tabulatrTable);
        var form = $('form.tabulatr_filter_form[data-table=' + tableId + ']');
        form[0].reset();
        tabulatrTable.updateTable({}, false);
      });
    }
  });

  $(document).on('click', 'a[data-show-filters-for]', function(){
    var a = $(this);
    a.parents('.tabulatr-outer-wrapper').addClass('filtered');
    return false;
  });


$(document).on('click', '.pagination a[data-page]', function(){
  var a = $(this);
  if(a.parent().hasClass('active') ||
     a.parent().hasClass('disabled')){
    return false;
  }
  var tableId = $(a).closest('.pagination').data('table');
  $('.tabulatr_mark_all[data-table='+ tableId +']').prop('checked', false);
  $('.tabulatr_mark_all[data-table='+ tableId +']').prop('indeterminate', false);
  var table_obj = $('table#'+tableId).data('tabulatr');
  table_obj.updateTable({append: false, page: a.data('page')});
  return false;
});

$(document).on('change', 'select[data-tabulatr-date-filter]', function() {
  var select = $(this);
  var option = select.find('option:selected');
  var val = option.val();
  if (val === 'from_to') {
    select.parents('.tabulatr-filter-row').find(".from_to").show().removeClass('hidden');
  } else {
    select.parents('.tabulatr-filter-row').find(".from_to").hide().val('');
  }
});

}));
