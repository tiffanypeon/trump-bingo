class AddTypeToInsultedParties < ActiveRecord::Migration[5.0]
  def change
    add_column :insulted_parties, :kind, :string
  end
end
