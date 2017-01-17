class CreateInsultedParties < ActiveRecord::Migration[5.0]
  def change
    create_table :insulted_parties do |t|
      t.string :name
      t.timestamps
    end
  end
end
