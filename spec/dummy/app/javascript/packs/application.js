/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
require("@rails/ujs").start()
require("turbolinks").start()
import 'bootstrap-sass'
import $ from 'jquery';
import 'app.scss'
require('tabulatr2_ui')
require('x-editable/dist/bootstrap3-editable/js/bootstrap-editable')

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
