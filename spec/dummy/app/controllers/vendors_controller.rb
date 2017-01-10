class VendorsController < ApplicationController
  before_action :set_vendor, only: [:update]
  attr_reader :split

  def index
     @split = params[:split] && params[:split].to_f || 100
     tabulatr_for Vendor
  end

  def update
    respond_to do |format|
      if @vendor.update(vendor_params)
        format.json { render :show, status: :ok, location: vendor_path }
      else
        format.json { render json: @vendor.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_vendor
    @vendor = Vendor.find(params[:id])
  end

  def vendor_params
    params.require(:vendor).permit(:name, :url, :active)
  end
end
