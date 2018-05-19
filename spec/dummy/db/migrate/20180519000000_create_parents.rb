class CreateParents < ActiveRecord::Migration
  def change
    create_table :parents do |t|
      t.string :name
      t.string :url
      t.boolean :active
      t.text :description

      t.timestamps null: false
    end
    add_reference :vendors, :parent, index: true
  end
end
