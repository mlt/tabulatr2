# -*- coding: utf-8 -*-
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

class Tabulatr::Renderer::Column
  include ActiveModel::Model

  attr_accessor *%i{name klass proxy table_name col_options output block}

  delegate :filter, to: :col_options

  def self.from(
    name: nil,
    table_name: nil,
    col_options: nil,
    klass: nil,
    proxy: nil,
    output: nil,
    &block)
    self.new(
      name: name,
      table_name: table_name,
      col_options: col_options,
      klass: klass,
      proxy: proxy,
      output: output,
      block: block
    )
  end

  def klassname() @_klassname ||= @klass.name.underscore end

  def human_name()
    h = col_options.header
    if h && h.respond_to?(:call)
      h.()
    elsif h
      h
    else
      klass.human_attribute_name(name)
    end
  end

  def sort_param() "#{klassname}_sort" end
  def full_name() [table_name, name].compact.join(":") end
  def coltype() 'column' end

  def column?() true end
  def association?() false end
  def checkbox?() false end
  def action?() false end

  def value_for(record, view)
    val = value_for_imp(record, view)
    if col_options.editable and proxy.editable?(view, name.to_s)
      col_options.editable = {} unless col_options.editable.is_a?(Hash)
      options = X::Editable::Rails::Configuration.method_options_for(record, name).deep_merge(col_options.editable).with_indifferent_access
      options.merge! options.delete(:data){ Hash.new }
      nested  = options.delete(:nested)
      nid     = options.delete(:nid)
      title   = options.delete(:title){ human_name() }
      placeholder = options.delete(:placeholder){ title }
      source  = options[:source] ? format_source(options.delete(:source), val) : default_source_for(val)
      url = options.delete(:url)
      if url.nil?
        url = view.polymorphic_path(record)
      else
        url = view.send(url, record.id)
      end
      type = options.delete(:type){ default_type_for(val) }
      view.content_tag :span, val, :class => :editable,
        id: name,
        :data => {
                  url: url,
                  name: name,
                  pk: record.id,
                  title: title,
                  placeholder: placeholder,
                  source: source,
                  nested: nested,
                  nid:    nid,
                  type: type,
                  model: record.class.model_name.singular
                 }.merge(options.symbolize_keys)
    else
      # .to_s ? somehow 'false' renders to nothing
      "#{val}"
    end
  end

  def value_for_imp(record, view)
    val = principal_value(record, view)
    if self.col_options.format.present?
      if val.respond_to?(:to_ary)
        val.map do |v|
          format_value(v, view)
        end
      else
        format_value(val, view)
      end
    else
      val
    end
  end

  def principal_value(record, view)
    if output
      view.instance_exec(record, &output)
    elsif block
      view.instance_exec(record, &block)
    elsif name
      record.send name
    else
      nil
    end
  end

  def determine_appropriate_filter!
    typ = self.klass.columns_hash[self.name.to_s].type.to_sym rescue nil
    case typ
    when :integer then self.col_options.filter = filter_type_for_integer
    when :enum then self.col_options.filter = :enum
    when :float, :decimal then self.col_options.filter = :decimal
    when :string, :text then self.col_options.filter = :like
    when :date, :time, :datetime, :timestamp then self.col_options.filter = :date
    when :boolean then self.col_options.filter = :checkbox
    when nil then self.col_options.filter = :exact
    else raise "Unknown filter type for #{self.name}: »#{typ}«"
    end
  end


  private

  def filter_type_for_integer
    if self.klass.respond_to?(:defined_enums) && self.klass.defined_enums.keys.include?(self.name.to_s)
      :enum
    else
      :integer
    end
  end

  def format_value(value, view)
    case self.col_options.format
    when Symbol then view.send(col_options.format, value)
    when String then col_options.format % value
    when Proc   then col_options.format.(value)
    else value
    end
  end

  # taken from x-editable-rails\lib\x-editable-rails\view_helpers.rb
  # can we optionally mixin that module??
  def default_type_for(value)
    case value
    when TrueClass, FalseClass
      'select'
    when Array
      'checklist'
    when Date
      'date'
    else
      'text'
    end
  end

  def default_source_for(value)
    case value
    when TrueClass, FalseClass
      { '1' => 'Yes', '0' => 'No' }
    end
  end

  # helper method that take some shorthand source definitions and reformats them
  def format_source(source, value)
    formatted_source = case value
                       when TrueClass, FalseClass
                         if source.is_a?(Array) && source.first.is_a?(String) && source.size == 2
                           { '1' => source[0], '0' => source[1] }
                         end
                       else
                         if source.is_a?(Array) && source.first.is_a?(String)
                           source.map { |v| { value: v, text: v } }
                         end
                       end

    formatted_source || source
  end

end
