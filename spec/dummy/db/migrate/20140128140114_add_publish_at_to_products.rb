class AddPublishAtToProducts < ActiveRecord::Migration[4.2]
  def change
    add_column :products, :publish_at, :datetime
  end
end
