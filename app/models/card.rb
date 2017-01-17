class Card < ApplicationRecord
  before_create :set_space_names

  KINDS = ['movie', 'actor', 'actress', 'song', 'city']

  def set_space_names
    parties = InsultedParty.where(kind: space_name).pluck(:name).sample(24)
    freebie = InsultedParty.where(kind: 'freebie').sample.name
    parties.insert(12, freebie)
    parties.each_slice(5).to_a.each_with_index do |names, i|
      self.send(:"row#{i+1}=", names)
    end
  end

  def rows
    [row1, row2, row3, row4, row5]
  end

  private

  def set_third_row
    third_row.insert(2, 'image')
  end

end
