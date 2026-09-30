from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    organization_name: str
    phone: Optional[str] = None

# Forecast Schemas
class ForecastRequest(BaseModel):
    kitchen_id: int = 1
    date: str
    meal_period: str = "Lunch"
    expected_attendance: int
    day_of_week: Optional[str] = "Monday"
    holiday_event: Optional[str] = "Regular Working Day"
    weather_cond: Optional[str] = "Sunny (32°C)"
    buffer_percent: Optional[float] = 5.0

class RecordActualsRequest(BaseModel):
    kitchen_id: int = 1
    date: str
    meal_period: str
    meals_prepared: int
    meals_consumed: int
    waste_kg: float
    surplus_kg: float
    notes: Optional[str] = None

# Inventory Schemas
class InventoryCreate(BaseModel):
    institution_id: int = 1
    name: str
    category: str
    quantity: float
    unit: str = "kg"
    supplier: Optional[str] = None
    batch_number: str
    purchase_date: str
    expiry_date: str
    storage_location: str = "Cold Storage Unit A"
    min_threshold: float = 20.0

class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    supplier: Optional[str] = None
    expiry_date: Optional[str] = None
    storage_location: Optional[str] = None
    status: Optional[str] = None

# Surplus Food Schemas
class SurplusListingCreate(BaseModel):
    institution_id: int = 1
    food_name: str
    category: str
    quantity_kg: float
    portions: int
    food_image_url: Optional[str] = None
    pickup_address: str
    lat: Optional[float] = 13.0827
    lng: Optional[float] = 80.2707
    prep_datetime: str
    pickup_deadline: str
    storage_condition: str = "Insulated Thermal Container (65°C+)"
    allergens: Optional[str] = "Contains Gluten/Dairy"
    safety_verified: bool = True
    verified_by: Optional[str] = "FSSAI Food Safety In-Charge"
    contact_phone: str
    est_value_inr: Optional[float] = 0.0
    batch_passport_id: Optional[int] = None
    batch_number: Optional[str] = None

class DonationAcceptRequest(BaseModel):
    ngo_id: int
    claimed_quantity_kg: Optional[float] = None
    claimed_portions: Optional[int] = None

class DonationRejectRequest(BaseModel):
    ngo_id: int
    reason: str

# Delivery Status Update
class DeliveryStatusUpdate(BaseModel):
    status: str # "Assigned", "Picked Up", "In Transit", "Delivered"
    proof_notes: Optional[str] = None
    proof_photo_url: Optional[str] = None

# Food Quality Reading
class QualityReadingCreate(BaseModel):
    kitchen_id: int = 1
    item_name: str
    batch_code: str
    storage_temp_c: float
    storage_humidity_percent: float
    storage_duration_hrs: float = 2.0
    use_by_datetime: str
    visual_assessment_status: str = "Safe (Verified)"
    inspector_notes: Optional[str] = None

# Food Processing Batch
class ProcessingBatchCreate(BaseModel):
    batch_code: str
    product_name: str
    input_raw_material_kg: float
    useful_output_kg: float
    machine_downtime_mins: int = 0
    energy_consumption_kwh: float = 40.0
    date: str
    notes: Optional[str] = None

# ==============================================================================
# SMART INVENTORY INTELLIGENCE & TRACEABILITY SCHEMAS
# ==============================================================================

class BatchPassportCreate(BaseModel):
    institution_id: int = 1
    batch_number: Optional[str] = None
    ingredient_name: str
    category: str
    initial_quantity: float
    unit: str = "kg"
    source_origin: Optional[str] = "Coimbatore Organic Cooperative, TN"
    supplier_name: Optional[str] = None
    purchase_date: str
    expiry_date: str
    storage_conditions: Optional[str] = "Insulated Cold Unit (4°C, 85% RH)"
    current_location: Optional[str] = "Central Chiller 1 - Bay A"
    safety_status: Optional[str] = "Verified Safe"
    notes: Optional[str] = None

class BatchMovementCreate(BaseModel):
    event_type: str
    quantity_delta: float
    location: str
    performed_by: str
    notes: Optional[str] = None
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[int] = None

class FoodWasteCreate(BaseModel):
    institution_id: int = 1
    batch_passport_id: Optional[int] = None
    ingredient_name: str
    food_category: str
    quantity_kg: float
    unit: str = "kg"
    waste_stage: str
    reason: str
    kitchen_name: Optional[str] = "Loyola Main Kitchen"
    logged_by: Optional[str] = "Chef S. Ramanathan"
    action_taken: Optional[str] = "Composted for Organic Garden"
    notes: Optional[str] = None

class SupplierCreate(BaseModel):
    name: str
    category: str
    contact_person: str
    phone: str
    email: str
    address: str
    delivery_lead_days: int = 2
    min_order_qty: float = 20.0
    rating: Optional[float] = 4.8

class PurchaseOrderItemSchema(BaseModel):
    ingredient_name: str
    current_usable_stock: float = 0.0
    predicted_demand: float = 0.0
    safety_stock: float = 0.0
    recommended_reorder_qty: float = 0.0
    confirmed_qty: float
    unit: str = "kg"
    unit_price_inr: float = 0.0

class PurchaseOrderCreate(BaseModel):
    institution_id: int = 1
    supplier_id: int
    order_date: Optional[str] = None
    expected_delivery_date: Optional[str] = None
    items: List[PurchaseOrderItemSchema]
    notes: Optional[str] = None

class PurchaseOrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class MenuExecuteRequest(BaseModel):
    recommendation_id: Optional[int] = None
    recipe_id: int
    servings: int = 500
    meal_period: str = "Lunch"
    confirmed_by: str = "Chef In-Charge"

