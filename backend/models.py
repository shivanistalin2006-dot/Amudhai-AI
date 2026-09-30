from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(String(20), nullable=False)  # "institution", "ngo", "delivery", "admin"
    organization_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    type = Column(String(50), nullable=False)  # "College Hostel", "Hotel", "Mega Kitchen", "Catering Service"
    address = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    contact_email = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    capacity_meals = Column(Integer, default=1000)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchens = relationship("Kitchen", back_populates="institution", cascade="all, delete-orphan")
    surplus_listings = relationship("SurplusListing", back_populates="institution")
    inventory_items = relationship("InventoryItem", back_populates="institution")

class Kitchen(Base):
    __tablename__ = "kitchens"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    name = Column(String(100), nullable=False)
    manager_name = Column(String(100), nullable=False)
    daily_prep_avg = Column(Integer, default=800)

    institution = relationship("Institution", back_populates="kitchens")
    production_records = relationship("ProductionRecord", back_populates="kitchen")
    forecasts = relationship("DemandForecast", back_populates="kitchen")

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(120), nullable=False)
    type = Column(String(50), nullable=False)  # "Food Bank", "Shelter", "Community Kitchen", "Orphanage"
    address = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    capacity_meals_daily = Column(Integer, default=300)
    accepted_categories = Column(String(200), default="Cooked Meals, Bakery, Fresh Produce")
    verification_status = Column(String(20), default="verified")  # "verified", "pending", "rejected"
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    donations = relationship("Donation", back_populates="ngo")

class DeliveryPartner(Base):
    __tablename__ = "delivery_partners"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    vehicle_type = Column(String(50), default="Electric Eco-Van (Insulated)")  # "E-Van", "Cargo Scooter", "Mini Truck"
    active_status = Column(String(20), default="available")  # "available", "on_delivery", "offline"
    current_lat = Column(Float, default=13.0827)
    current_lng = Column(Float, default=80.2707)
    rating = Column(Float, default=4.9)

    assignments = relationship("DeliveryAssignment", back_populates="delivery_partner")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # "Vegetables", "Grains & Rice", "Dairy", "Pulses & Legumes", "Spices & Oils"
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    supplier = Column(String(100), nullable=True)
    batch_number = Column(String(50), nullable=False)
    purchase_date = Column(String(20), nullable=False)
    expiry_date = Column(String(20), nullable=False)
    storage_location = Column(String(100), default="Cold Storage Unit A")
    status = Column(String(20), default="Fresh")  # "Fresh", "Near Expiry", "Expired", "Low Stock"
    min_threshold = Column(Float, default=20.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    institution = relationship("Institution", back_populates="inventory_items")

class ProductionRecord(Base):
    __tablename__ = "production_records"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    date = Column(String(20), nullable=False)
    meal_period = Column(String(20), nullable=False)  # "Breakfast", "Lunch", "Dinner"
    meals_prepared = Column(Integer, nullable=False)
    meals_consumed = Column(Integer, nullable=False)
    waste_kg = Column(Float, default=0.0)
    surplus_kg = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchen = relationship("Kitchen", back_populates="production_records")

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    date = Column(String(20), nullable=False)
    meal_period = Column(String(20), nullable=False)
    expected_attendance = Column(Integer, nullable=False)
    day_of_week = Column(String(20), nullable=False)
    holiday_event = Column(String(100), default="Regular Day")
    weather_cond = Column(String(50), default="Clear (31°C)")
    predicted_meals = Column(Integer, nullable=False)
    recommended_prep = Column(Integer, nullable=False)
    buffer_percent = Column(Float, default=5.0)
    confidence_score = Column(Float, default=94.5)
    ingredient_breakdown_json = Column(Text, nullable=True)
    ai_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchen = relationship("Kitchen", back_populates="forecasts")

class FoodQualityLog(Base):
    __tablename__ = "food_quality_logs"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    item_name = Column(String(100), nullable=False)
    batch_code = Column(String(50), nullable=False)
    storage_temp_c = Column(Float, nullable=False)
    storage_humidity_percent = Column(Float, nullable=False)
    storage_duration_hrs = Column(Float, default=2.5)
    use_by_datetime = Column(String(30), nullable=False)
    visual_assessment_status = Column(String(30), default="Safe (Verified)")  # "Safe (Verified)", "Inspection Required", "Sub-standard"
    sensor_alert = Column(String(30), default="Normal")  # "Normal", "Temp Warning", "Humidity Warning"
    inspector_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SurplusListing(Base):
    __tablename__ = "surplus_listings"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    food_name = Column(String(120), nullable=False)
    category = Column(String(50), nullable=False)  # "Cooked Meals", "Bakery & Breads", "Fresh Produce", "Dairy"
    quantity_kg = Column(Float, nullable=False)
    portions = Column(Integer, nullable=False)
    food_image_url = Column(String(255), nullable=True)
    pickup_address = Column(String(255), nullable=False)
    lat = Column(Float, default=13.0827)
    lng = Column(Float, default=80.2707)
    prep_datetime = Column(String(30), nullable=False)
    pickup_deadline = Column(String(30), nullable=False)
    storage_condition = Column(String(100), default="Insulated Thermal Container (65°C+)")
    allergens = Column(String(150), default="Contains Gluten/Dairy")
    safety_verified = Column(Boolean, default=True)
    verified_by = Column(String(100), default="FSSAI Certified Chef")
    contact_phone = Column(String(20), nullable=False)
    est_value_inr = Column(Float, default=0.0)
    status = Column(String(30), default="Available")  
    # Statuses: "Available", "Reserved", "Accepted", "Pickup Scheduled", "Picked Up", "In Transit", "Delivered", "Expired", "Cancelled"
    created_at = Column(DateTime, default=datetime.utcnow)

    institution = relationship("Institution", back_populates="surplus_listings")
    donations = relationship("Donation", back_populates="surplus_listing", cascade="all, delete-orphan")

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    surplus_listing_id = Column(Integer, ForeignKey("surplus_listings.id"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    claimed_quantity_kg = Column(Float, nullable=False)
    claimed_portions = Column(Integer, nullable=False)
    status = Column(String(30), default="Accepted")  # "Accepted", "Rejected", "Completed", "Cancelled"
    rejection_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    surplus_listing = relationship("SurplusListing", back_populates="donations")
    ngo = relationship("NGO", back_populates="donations")
    delivery_assignment = relationship("DeliveryAssignment", back_populates="donation", uselist=False, cascade="all, delete-orphan")

class DeliveryAssignment(Base):
    __tablename__ = "delivery_assignments"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"), nullable=False)
    delivery_partner_id = Column(Integer, ForeignKey("delivery_partners.id"), nullable=False)
    pickup_lat = Column(Float, nullable=False)
    pickup_lng = Column(Float, nullable=False)
    dropoff_lat = Column(Float, nullable=False)
    dropoff_lng = Column(Float, nullable=False)
    pickup_address = Column(String(255), nullable=False)
    dropoff_address = Column(String(255), nullable=False)
    est_distance_km = Column(Float, default=4.2)
    est_duration_mins = Column(Integer, default=18)
    route_summary = Column(Text, nullable=True)
    current_status = Column(String(30), default="Assigned")  # "Assigned", "Picked Up", "In Transit", "Delivered"
    pickup_timestamp = Column(String(30), nullable=True)
    delivered_timestamp = Column(String(30), nullable=True)
    proof_notes = Column(Text, nullable=True)
    proof_photo_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    donation = relationship("Donation", back_populates="delivery_assignment")
    delivery_partner = relationship("DeliveryPartner", back_populates="assignments")

class ProcessingBatch(Base):
    __tablename__ = "processing_batches"

    id = Column(Integer, primary_key=True, index=True)
    batch_code = Column(String(50), unique=True, nullable=False)
    product_name = Column(String(100), nullable=False)
    input_raw_material_kg = Column(Float, nullable=False)
    useful_output_kg = Column(Float, nullable=False)
    waste_material_kg = Column(Float, nullable=False)
    processing_efficiency_pct = Column(Float, nullable=False)  # (useful_output / input) * 100
    machine_downtime_mins = Column(Integer, default=0)
    energy_consumption_kwh = Column(Float, default=45.0)
    date = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SustainabilityMetric(Base):
    __tablename__ = "sustainability_metrics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(20), nullable=False)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    waste_prevented_kg = Column(Float, default=0.0)
    meals_delivered = Column(Integer, default=0)
    co2e_avoided_kg = Column(Float, default=0.0)      # factor: 2.5 kg CO2e per kg food saved
    water_saved_liters = Column(Float, default=0.0)     # factor: 1,500 L water per kg food saved
    financial_saved_inr = Column(Float, default=0.0)    # factor: INR 120 per kg food value
    baseline_waste_kg = Column(Float, default=150.0)
    reduction_pct = Column(Float, default=0.0)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_role = Column(String(20), default="all")  # "all", "institution", "ngo", "delivery", "admin"
    title = Column(String(120), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(30), default="info")  # "surplus", "donation", "delivery", "sensor", "inventory", "forecast"
    link = Column(String(100), nullable=True)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

# ==============================================================================
# SMART INVENTORY INTELLIGENCE, BATCH PASSPORTS & TRACEABILITY
# ==============================================================================

class BatchPassport(Base):
    __tablename__ = "batch_passports"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False, default=1)
    batch_number = Column(String(60), unique=True, index=True, nullable=False)
    ingredient_name = Column(String(100), index=True, nullable=False)
    category = Column(String(50), nullable=False)  # "Vegetables", "Grains & Rice", "Dairy", "Pulses & Legumes", "Spices & Oils"
    initial_quantity = Column(Float, nullable=False)
    current_quantity = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    source_origin = Column(String(150), default="Local Farmer Cooperative, TN")
    supplier_name = Column(String(100), nullable=True)
    purchase_date = Column(String(20), nullable=False)
    expiry_date = Column(String(20), index=True, nullable=False)
    storage_conditions = Column(String(150), default="Insulated Cold Unit (4°C, 85% RH)")
    current_location = Column(String(150), default="Central Chiller 1 - Bay A")
    qr_code_payload = Column(Text, nullable=True)
    safety_status = Column(String(30), default="Verified Safe")  # "Verified Safe", "Inspection Required", "Quarantined", "Recalled"
    fefo_priority = Column(Integer, default=1)
    risk_level = Column(String(20), default="Low Risk")  # "Low Risk", "Medium Risk", "High Risk"
    risk_reasons = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    movement_events = relationship("BatchMovementEvent", back_populates="batch_passport", cascade="all, delete-orphan", order_by="desc(BatchMovementEvent.timestamp)")
    waste_records = relationship("FoodWasteRecord", back_populates="batch_passport")

class BatchMovementEvent(Base):
    __tablename__ = "batch_movement_events"

    id = Column(Integer, primary_key=True, index=True)
    batch_passport_id = Column(Integer, ForeignKey("batch_passports.id"), nullable=False, index=True)
    event_type = Column(String(60), nullable=False)  # "Procurement Inward", "Storage Relocation", "Kitchen Production", "Partial Consumption", "Surplus Listed", "Donation Claimed", "Fleet Dispatched", "Delivered & Handed Over", "Waste Logged"
    timestamp = Column(DateTime, default=datetime.utcnow)
    quantity_delta = Column(Float, default=0.0)
    quantity_after = Column(Float, default=0.0)
    location = Column(String(150), nullable=False)
    performed_by = Column(String(100), nullable=False)
    related_entity_type = Column(String(50), nullable=True)
    related_entity_id = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    verification_hash = Column(String(64), nullable=True)

    batch_passport = relationship("BatchPassport", back_populates="movement_events")

# ==============================================================================
# SUPPLIERS & PROCUREMENT INTELLIGENCE
# ==============================================================================

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, index=True, nullable=False)
    category = Column(String(50), nullable=False)  # "Fresh Produce", "Grains & Pulses", "Dairy", "Spices & Oils"
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    rating = Column(Float, default=4.8)
    delivery_lead_days = Column(Integer, default=2)
    min_order_qty = Column(Float, default=20.0)
    is_verified = Column(Boolean, default=True)
    availability_status = Column(String(20), default="Available")
    created_at = Column(DateTime, default=datetime.utcnow)

    price_history = relationship("SupplierPriceHistory", back_populates="supplier", cascade="all, delete-orphan")
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")

class SupplierPriceHistory(Base):
    __tablename__ = "supplier_price_history"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    ingredient_name = Column(String(100), nullable=False)
    unit_price_inr = Column(Float, nullable=False)
    effective_date = Column(String(20), nullable=False)
    unit = Column(String(20), default="kg")

    supplier = relationship("Supplier", back_populates="price_history")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(50), unique=True, index=True, nullable=False)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    order_date = Column(String(20), nullable=False)
    expected_delivery_date = Column(String(20), nullable=False)
    status = Column(String(30), default="Draft")  # "Draft", "Pending Approval", "Ordered", "Received", "Cancelled"
    total_cost_inr = Column(Float, default=0.0)
    auto_generated_by_ai = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")
    supplier = relationship("Supplier", back_populates="purchase_orders")

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    ingredient_name = Column(String(100), nullable=False)
    current_usable_stock = Column(Float, default=0.0)
    predicted_demand = Column(Float, default=0.0)
    safety_stock = Column(Float, default=0.0)
    recommended_reorder_qty = Column(Float, default=0.0)
    confirmed_qty = Column(Float, default=0.0)
    unit = Column(String(20), default="kg")
    unit_price_inr = Column(Float, default=0.0)
    total_price_inr = Column(Float, default=0.0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")

# ==============================================================================
# WASTE ORIGIN ANALYTICS
# ==============================================================================

class FoodWasteRecord(Base):
    __tablename__ = "food_waste_records"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    batch_passport_id = Column(Integer, ForeignKey("batch_passports.id"), nullable=True)
    ingredient_name = Column(String(100), nullable=False)
    food_category = Column(String(50), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    waste_stage = Column(String(60), nullable=False)  # "Storage loss", "Preparation loss", "Cooking loss", "Plate leftovers", "Expired or spoiled ingredients", "Processing and production losses"
    reason = Column(String(150), nullable=False)
    date_time = Column(DateTime, default=datetime.utcnow)
    kitchen_name = Column(String(100), default="Loyola Main Kitchen")
    financial_loss_inr = Column(Float, default=0.0)
    co2e_impact_kg = Column(Float, default=0.0)
    water_loss_liters = Column(Float, default=0.0)
    logged_by = Column(String(100), default="Chef In-Charge")
    action_taken = Column(String(150), default="Composted for Campus Garden")
    notes = Column(Text, nullable=True)

    batch_passport = relationship("BatchPassport", back_populates="waste_records")

# ==============================================================================
# SMART MENU & INGREDIENT RECIPES
# ==============================================================================

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, index=True, nullable=False)
    category = Column(String(50), default="Lunch")
    dietary_type = Column(String(50), default="Vegetarian")  # "Vegetarian", "Vegan", "Jain", "Regular"
    allergens = Column(String(150), default="Gluten-Free, Nut-Free")
    servings_base = Column(Integer, default=100)
    prep_time_mins = Column(Integer, default=45)
    instructions = Column(Text, nullable=True)

    ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_name = Column(String(100), nullable=False)
    qty_per_100_servings = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    is_critical = Column(Boolean, default=True)

    recipe = relationship("Recipe", back_populates="ingredients")

class MenuRecommendation(Base):
    __tablename__ = "menu_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    meal_period = Column(String(20), default="Lunch")
    target_servings = Column(Integer, default=500)
    rationale = Column(Text, nullable=False)
    priority_score = Column(Float, default=95.0)
    status = Column(String(20), default="Recommended")  # "Recommended", "Accepted", "Executed", "Dismissed"
    created_at = Column(DateTime, default=datetime.utcnow)

    recipe = relationship("Recipe")

