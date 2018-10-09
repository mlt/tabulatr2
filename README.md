# Tabulatr2 (modified)
[![Build Status](https://travis-ci.com/mlt/tabulatr2.svg?branch=wip_mlt)](https://travis-ci.com/mlt/tabulatr2)
[![Maintainability](https://api.codeclimate.com/v1/badges/ba31d13164c4f5c73177/maintainability)](https://codeclimate.com/github/mlt/tabulatr2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ba31d13164c4f5c73177/test_coverage)](https://codeclimate.com/github/mlt/tabulatr2/test_coverage)

This is a work-in-progress branch with my (mlt) modifications on top of original tabulatr2
that have not been merged (yet?). This branch is mostly for my own amusement but you may find it useful.
This is not a full blown fork and I hope the changes will make their way back.

Please note, that I do rebase this branch often in an attempt to keep it tidy and ease cherry picking for merges.
**Do not fork it** unless you are really good with git and are comfortable rebasing and cherry picking.
Create an issue if you feel like working along, so I'll start a permanent development branch.
And don't create any issues here pertinent to main tabulatr2 code base.

Prominent changes include:

- Works with Turbolinks
- Changeable records per page
- Cancellable pre-filter and filter dialog reset to defaults
- In-place editing with [x-editable](http://vitalets.github.io/x-editable/)
- Callable filter
- Support for chained associations
- Partial DSL for complex cell rendering

## Turbolinks and friends

JavaScript code was re-written using bubbled to *document* events. Tabulatr object is saved into `$('table#whatever').data('tabulatr')` upon instantiation. This allows to have, e.g. a `refreshPage` method exposed.

## Adjustable records per page

```ruby
<%= table_for @a_relation, pagesizes: [10, 20, 50, 100, 9999] %>
```

9999 stands for *All* on one page.

## Cancellable pre-filter

```ruby
<%= table_for @a_rel, filter: {'table_name_or_assoc:col': 'value'},...
```

You might want to pre-filter records, but would like to allow an end user to see all records by cancelling filter dialog. Once filter is cancelled you might want to reset it to preset one. You will see an extra button ♻ for that to reset a form in filter dialog ❌♻🡺.

## x-editable support & callable filter

Define `self.editable?` method in your Tabulatr::Data that would return `true` when editing is allowed. Something like this would do it if you use [Pundit](https://github.com/varvet/pundit):

```ruby
  def self.editable?(view, name)
    view.controller.policy(view.record).update?
  end
```

Now use *editable* column option to provide details.

```ruby
  association :myassoc, :assoc_col, sortable: true,
    editable: {url: :controller_where_to_send_updates_for_relation_path, type: :select2, select2: {
      dropdownParent: '.popover', width: '20em', dropdownAutoWidth: true, theme: 'bootstrap'
      }, source: Myassoc.order(:assoc_col).pluck(:assoc_col, :assoc_id).map{|v,i| {id: i, text: v}}},
    filter: Proc.new {|k| k.distinct.where.not(assoc_col: nil).pluck :assoc_col}
```

If you prefer using ids in a match ...

```
...
    filter: Proc.new {|k| k.distinct.where.not(assoc_col: nil).pluck :assoc_col, :assoc_id},
    filter_sql: 'unambiguous_referencing_table_name.assoc_id'
```

It is handy to show filter options that are applicable, e.g. remove entries yielding empty results.
Therefore we use `Proc` here.

If *url* specification is omitted, the appropriate path for requests will be determined with the following logic. If *x-editable* type is select(2), patch HTTP call will update previous association (or main table). If *type* is set to something else, it will try to edit associated record. In latter case you might want to `$('table#whatever').data('tabulatr').refreshPage()` to reflect associated record update in other rows.

Use `where.not(assoc_col: nil)` for [outer joins](https://stackoverflow.com/a/48965930/673826) to remove extra empty cell.

## Chained associations

Use either of

```ruby
  association %i[assoc1 assoc2], :mycol, editable: true
  association 'assoc1-assoc2', :mycol, editable: {type: 'textarea'}
  association :'assoc1-assoc2', :mycol, editable: {type: :select}
```

## Partial

```ruby
  partial :files, header: 'Latest'
```

Use so-named (`files` here) variable in your partial `views/whatever/_files.html.erb`.
