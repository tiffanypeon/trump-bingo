class AddRowsToCards < ActiveRecord::Migration[5.0]
  def change
    add_column :cards, :row1, :text, array: true, default: []
    add_column :cards, :row2, :text, array: true, default: []
    add_column :cards, :row3, :text, array: true, default: []
    add_column :cards, :row4, :text, array: true, default: []
    add_column :cards, :row5, :text, array: true, default: []
  end
end
