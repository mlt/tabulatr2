class CreateProducts < ActiveRecord::Migration[4.2]
  def change
    create_table :products do |t|
      t.references :vendor, index: true
      t.string :title
      t.decimal :price
      t.boolean :active

      t.timestamps null: false
    end
  end
end
