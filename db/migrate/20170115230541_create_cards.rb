class CreateCards < ActiveRecord::Migration[5.0]
  def change
    create_table :cards do |t|
      t.text :space_name, array: true, default: []
      t.timestamps
    end
  end
end
