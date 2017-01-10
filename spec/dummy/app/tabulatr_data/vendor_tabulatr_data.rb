class VendorTabulatrData < Tabulatr::Data

  column :name, :editable => { :url => 'vendor_path' }
  column :url
  column :active, :editable => {}

  filter :product_price_range do |relation, value|
    relation = relation.joins(:products)
    if value == 'low'
      relation.group("vendors.id").having('AVG(products.price) <= ?', @controller.split)
    elsif value == 'high'
      relation.group("vendors.id").having('AVG(products.price) > ?', @controller.split)
    end
  end
end
