class Card < ApplicationRecord

  def rows
    space_name.shuffle.each_slice(5).to_a
  end

  private

  def set_third_row
    third_row.insert(2, 'image')
  end

end
