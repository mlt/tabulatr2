// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require tabulatr
//= require turbolinks
//= require editable/bootstrap-editable
//= require editable/rails
//= require_tree .

$(document).on('tabulatr:response', function() {
  $('.editable').editable({
    // Here is an idea of what we would do without editable/rails & coffee
    // ajaxOptions: {
    //   type: 'put'
    // },
    // params: function(params) {  //params already contain `name`, `value` and `pk`
    //   var data = {};
    //   data['id'] = params.pk;
    //   data[params.name] = params.value;
    //   return data;
    // }
  });
})
