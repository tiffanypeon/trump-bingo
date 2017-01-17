class CardsController < ApplicationController
  def new
    @card = Card.new
  end

  def create
    @card = Card.new(card_params)

    if @card.save!
      redirect_to @card
    else
      render :new
    end
  end

  def show
    @card = Card.find(params[:format])
  end

  private

  def card_params
    params[:card].permit(:space_name => [])
  end
end
