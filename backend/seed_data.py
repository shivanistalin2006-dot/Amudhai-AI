from datetime import datetime, timedelta
from .models import (
    User, Institution, Kitchen, NGO, DeliveryPartner, InventoryItem,
    ProductionRecord, FoodQualityLog, SurplusListing, Donation,
    DeliveryAssignment, ProcessingBatch, SustainabilityMetric, Notification,
    BatchPassport, BatchMovementEvent, Supplier, SupplierPriceHistory,
    PurchaseOrder, PurchaseOrderItem, FoodWasteRecord, Recipe, RecipeIngredient,
    MenuRecommendation
)
from .ai_services import generate_batch_qr_payload, compute_chain_hash


def seed_database(db):
    if not db.query(User).first():
        seed_core_database(db)
    
    if not db.query(BatchPassport).first():
        seed_smart_inventory_data(db)

def seed_core_database(db):
    print("Seeding ZeroPlate AI core database...")

    # 1. Users
    users = [
        User(username="kitchen_admin", email="kitchen@loyola.edu", hashed_password="pbkdf2:admin123", role="institution", organization_name="Loyola College Mega Mess", phone="+91 98400 11223"),
        User(username="hotel_admin", email="manager@annapoorna.com", hashed_password="pbkdf2:hotel123", role="institution", organization_name="Hotel Annapoorna Grand", phone="+91 98400 22334"),
        User(username="ngo_user", email="director@akshayafood.org", hashed_password="pbkdf2:ngo123", role="ngo", organization_name="Akshaya Food Bank Chennai", phone="+91 98400 33445"),
        User(username="delivery_driver", email="murugan@greenexpress.in", hashed_password="pbkdf2:driver123", role="delivery", organization_name="GreenExpress Eco-Van", phone="+91 98401 23456"),
        User(username="platform_admin", email="admin@zeroplate.ai", hashed_password="pbkdf2:super123", role="admin", organization_name="ZeroPlate Ecosystem HQ", phone="+91 98400 99999"),
    ]
    db.add_all(users)
    db.commit()

    # 2. Institutions & Kitchens
    inst1 = Institution(
        name="Loyola College Mega Mess",
        type="College Hostel",
        address="Sterling Road, Nungambakkam, Chennai, Tamil Nadu 600034",
        lat=13.0645,
        lng=80.2335,
        contact_email="mess@loyola.edu",
        contact_phone="+91 44 2817 8200",
        capacity_meals=1500
    )
    inst2 = Institution(
        name="Hotel Annapoorna Grand Kitchen",
        type="Hotel & Catering",
        address="Mount Road, Teynampet, Chennai, Tamil Nadu 600018",
        lat=13.0405,
        lng=80.2452,
        contact_email="kitchen@annapoorna.com",
        contact_phone="+91 44 2434 5566",
        capacity_meals=1200
    )
    db.add_all([inst1, inst2])
    db.commit()

    k1 = Kitchen(institution_id=inst1.id, name="Loyola Main Dining Hall", manager_name="Chef S. Ramanathan", daily_prep_avg=1200)
    k2 = Kitchen(institution_id=inst2.id, name="Annapoorna Central Catering", manager_name="Chef P. Vijay", daily_prep_avg=900)
    db.add_all([k1, k2])
    db.commit()

    # 3. NGOs
    ngos = [
        NGO(
            user_id=users[2].id,
            name="Akshaya Food Bank Chennai",
            type="Food Bank",
            address="2nd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040",
            lat=13.0850,
            lng=80.2101,
            capacity_meals_daily=500,
            accepted_categories="Cooked Meals, Bakery & Breads, Fresh Produce",
            verification_status="verified",
            contact_person="K. Sundaram",
            phone="+91 98400 33445"
        ),
        NGO(
            name="Annai Teresa Shelter for the Needy",
            type="Shelter",
            address="Gandhi Irwin Road, Egmore, Chennai, Tamil Nadu 600008",
            lat=13.0784,
            lng=80.2610,
            capacity_meals_daily=250,
            accepted_categories="Cooked Meals, Packed Food",
            verification_status="verified",
            contact_person="Sister Mary Joseph",
            phone="+91 44 2819 1234"
        ),
        NGO(
            name="FeedNeedy Community Foundation",
            type="Community Kitchen",
            address="Usman Road, T. Nagar, Chennai, Tamil Nadu 600017",
            lat=13.0418,
            lng=80.2341,
            capacity_meals_daily=400,
            accepted_categories="Cooked Meals, Bakery, Grains",
            verification_status="verified",
            contact_person="R. Karthikeyan",
            phone="+91 94441 56789"
        ),
        NGO(
            name="Karunai Illam Orphanage Care",
            type="Orphanage",
            address="GST Road, Guindy, Chennai, Tamil Nadu 600032",
            lat=13.0067,
            lng=80.2026,
            capacity_meals_daily=180,
            accepted_categories="Cooked Meals, Fresh Produce, Dairy",
            verification_status="verified",
            contact_person="Mrs. Revathi Priya",
            phone="+91 98412 78901"
        ),
        NGO(
            name="Sneha Youth Pantry & Food Rescue",
            type="Food Bank",
            address="100 Feet Bypass Road, Velachery, Chennai, Tamil Nadu 600042",
            lat=12.9815,
            lng=80.2180,
            capacity_meals_daily=350,
            accepted_categories="Cooked Meals, Fresh Produce, Bakery",
            verification_status="verified",
            contact_person="V. Balakrishnan",
            phone="+91 97909 23456"
        ),
    ]
    db.add_all(ngos)
    db.commit()

    # 4. Delivery Partners
    dp1 = DeliveryPartner(
        user_id=users[3].id,
        name="Murugan K. (GreenExpress 01)",
        phone="+91 98401 23456",
        vehicle_type="Electric Eco-Van (Thermal Insulated)",
        active_status="available",
        current_lat=13.0645,
        current_lng=80.2335,
        rating=4.95
    )
    dp2 = DeliveryPartner(
        name="Rajesh S. (SwiftEco 02)",
        phone="+91 98402 34567",
        vehicle_type="Electric Cargo Scooter (Hot-box)",
        active_status="available",
        current_lat=13.0450,
        current_lng=80.2400,
        rating=4.88
    )
    dp3 = DeliveryPartner(
        name="Karthik R. (CityFleet 03)",
        phone="+91 98403 45678",
        vehicle_type="Insulated Food Transport Van",
        active_status="available",
        current_lat=13.0800,
        current_lng=80.2500,
        rating=4.92
    )
    db.add_all([dp1, dp2, dp3])
    db.commit()

    # 5. Inventory Items (with FEFO dates)
    today = datetime.now()
    inv_items = [
        InventoryItem(
            institution_id=inst1.id,
            name="Sona Masoori Raw Rice",
            category="Grains & Rice",
            quantity=450.0,
            unit="kg",
            supplier="Thanjavur Agro Mills",
            batch_number="BAT-RICE-2026-08",
            purchase_date=(today - timedelta(days=15)).strftime("%Y-%m-%d"),
            expiry_date=(today + timedelta(days=180)).strftime("%Y-%m-%d"),
            storage_location="Grain Silo 1",
            status="Fresh",
            min_threshold=100.0
        ),
        InventoryItem(
            institution_id=inst1.id,
            name="Premium Toor Dal",
            category="Pulses & Legumes",
            quantity=110.0,
            unit="kg",
            supplier="Salem Pulse Traders",
            batch_number="BAT-DAL-2026-14",
            purchase_date=(today - timedelta(days=10)).strftime("%Y-%m-%d"),
            expiry_date=(today + timedelta(days=90)).strftime("%Y-%m-%d"),
            storage_location="Dry Storage Bay B",
            status="Fresh",
            min_threshold=30.0
        ),
        InventoryItem(
            institution_id=inst1.id,
            name="Country Tomatoes (நாட்டு தக்காளி)",
            category="Vegetables",
            quantity=35.0,
            unit="kg",
            supplier="Koyambedu Wholesale Market",
            batch_number="BAT-VEG-2026-92",
            purchase_date=(today - timedelta(days=3)).strftime("%Y-%m-%d"),
            expiry_date=(today + timedelta(days=2)).strftime("%Y-%m-%d"), # Near Expiry!
            storage_location="Cold Storage Unit A (4°C)",
            status="Near Expiry",
            min_threshold=20.0
        ),
        InventoryItem(
            institution_id=inst1.id,
            name="Fresh Dairy Paneer",
            category="Dairy",
            quantity=12.0, # Low Stock!
            unit="kg",
            supplier="Aavin Dairy Cooperative",
            batch_number="BAT-DAIRY-2026-44",
            purchase_date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
            expiry_date=(today + timedelta(days=4)).strftime("%Y-%m-%d"),
            storage_location="Cold Room 2 (2°C)",
            status="Low Stock",
            min_threshold=15.0
        ),
        InventoryItem(
            institution_id=inst1.id,
            name="Refined Sunflower Cooking Oil",
            category="Spices & Oils",
            quantity=80.0,
            unit="L",
            supplier="Gold Winner Agro",
            batch_number="BAT-OIL-2026-03",
            purchase_date=(today - timedelta(days=20)).strftime("%Y-%m-%d"),
            expiry_date=(today + timedelta(days=200)).strftime("%Y-%m-%d"),
            storage_location="Dry Storage Bay A",
            status="Fresh",
            min_threshold=25.0
        ),
        InventoryItem(
            institution_id=inst2.id,
            name="Basmati Long Grain Rice",
            category="Grains & Rice",
            quantity=280.0,
            unit="kg",
            supplier="Punjab Dawat Mills",
            batch_number="BAT-BAS-2026-11",
            purchase_date=(today - timedelta(days=5)).strftime("%Y-%m-%d"),
            expiry_date=(today + timedelta(days=240)).strftime("%Y-%m-%d"),
            storage_location="Main Pantry Silo",
            status="Fresh",
            min_threshold=50.0
        )
    ]
    db.add_all(inv_items)
    db.commit()

    # 6. Production Records (Past 7 Days History)
    prod_history = []
    for i in range(7, 0, -1):
        dt = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        prep = 850 + (i * 15)
        cons = prep - 35 - (i * 3)
        waste = 12.0 + (i * 1.2)
        surp = 25.0 + (i * 1.5)
        prod_history.append(
            ProductionRecord(
                kitchen_id=k1.id,
                date=dt,
                meal_period="Lunch",
                meals_prepared=prep,
                meals_consumed=cons,
                waste_kg=round(waste, 1),
                surplus_kg=round(surp, 1),
                notes="Standard mess cycle. Surplus redirected to Akshaya Food Bank."
            )
        )
    db.add_all(prod_history)
    db.commit()

    # 7. Food Quality Logs
    q_logs = [
        FoodQualityLog(
            kitchen_id=k1.id,
            item_name="Steamed Sambar Rice & Poriyal",
            batch_code="BATCH-LUN-01",
            storage_temp_c=64.5,
            storage_humidity_percent=55.0,
            storage_duration_hrs=1.5,
            use_by_datetime=(today + timedelta(hours=3)).strftime("%Y-%m-%d %H:%M"),
            visual_assessment_status="Safe (Verified)",
            sensor_alert="Normal",
            inspector_notes="FSSAI hot holding guideline compliant. Freshly cooked and sealed."
        ),
        FoodQualityLog(
            kitchen_id=k1.id,
            item_name="Curd & Buttermilk Vats",
            batch_code="BATCH-DRY-02",
            storage_temp_c=4.2,
            storage_humidity_percent=78.0,
            storage_duration_hrs=2.0,
            use_by_datetime=(today + timedelta(hours=12)).strftime("%Y-%m-%d %H:%M"),
            visual_assessment_status="Safe (Verified)",
            sensor_alert="Normal",
            inspector_notes="Refrigerated cold chain verified at 4.2°C."
        )
    ]
    db.add_all(q_logs)
    db.commit()

    # 8. Surplus Food Listings
    now_str = today.strftime("%Y-%m-%d %H:%M")
    deadline_str = (today + timedelta(hours=3)).strftime("%Y-%m-%d %H:%M")
    
    surplus1 = SurplusListing(
        institution_id=inst1.id,
        food_name="Fragrant Vegetable Biryani & Onion Raitha",
        category="Cooked Meals",
        quantity_kg=24.0,
        portions=60,
        food_image_url="assets/images/sample_early_blight.jpg",
        pickup_address="Loyola College Mega Mess Gate 3, Nungambakkam",
        lat=13.0645,
        lng=80.2335,
        prep_datetime=now_str,
        pickup_deadline=deadline_str,
        storage_condition="Thermal Insulated Stainless Containers (65°C)",
        allergens="Contains Milk/Dairy, Cashew",
        safety_verified=True,
        verified_by="Chef Ramanathan (FSSAI ID: TN-2024-991)",
        contact_phone="+91 98400 11223",
        est_value_inr=3600.0,
        status="Available"
    )
    surplus2 = SurplusListing(
        institution_id=inst2.id,
        food_name="South Indian Meal Packets (Rice, Sambar, Kootu)",
        category="Cooked Meals",
        quantity_kg=32.0,
        portions=80,
        food_image_url="assets/images/sample_healthy_paddy.jpg",
        pickup_address="Hotel Annapoorna Grand Dispatch Deck, Teynampet",
        lat=13.0405,
        lng=80.2452,
        prep_datetime=now_str,
        pickup_deadline=deadline_str,
        storage_condition="Insulated Warm Boxes",
        allergens="Nut Free, Vegetarian",
        safety_verified=True,
        verified_by="Quality Supervisor Vijay",
        contact_phone="+91 44 2434 5566",
        est_value_inr=4800.0,
        status="Available"
    )
    surplus3 = SurplusListing(
        institution_id=inst1.id,
        food_name="Fresh Wheat Chapati & Dal Makhani",
        category="Cooked Meals",
        quantity_kg=18.0,
        portions=45,
        food_image_url="assets/images/sample_healthy_paddy.jpg",
        pickup_address="Loyola College Mega Mess Gate 3, Nungambakkam",
        lat=13.0645,
        lng=80.2335,
        prep_datetime=(today - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M"),
        pickup_deadline=(today + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M"),
        storage_condition="Thermal Container",
        allergens="Contains Gluten",
        safety_verified=True,
        verified_by="Chef Ramanathan",
        contact_phone="+91 98400 11223",
        est_value_inr=2700.0,
        status="Accepted"
    )
    db.add_all([surplus1, surplus2, surplus3])
    db.commit()

    # 9. Existing Donation & Delivery Workflow for Surplus 3
    donation1 = Donation(
        surplus_listing_id=surplus3.id,
        ngo_id=ngos[0].id, # Akshaya Food Bank
        claimed_quantity_kg=18.0,
        claimed_portions=45,
        status="Accepted"
    )
    db.add(donation1)
    db.commit()

    delivery1 = DeliveryAssignment(
        donation_id=donation1.id,
        delivery_partner_id=dp1.id,
        pickup_lat=inst1.lat,
        pickup_lng=inst1.lng,
        dropoff_lat=ngos[0].lat,
        dropoff_lng=ngos[0].lng,
        pickup_address=inst1.address,
        dropoff_address=ngos[0].address,
        est_distance_km=4.8,
        est_duration_mins=16,
        route_summary="Via Poonamallee High Road & Anna Nagar 2nd Ave (Low Traffic)",
        current_status="In Transit",
        pickup_timestamp=(today - timedelta(minutes=25)).strftime("%Y-%m-%d %H:%M"),
        proof_notes="Picked up 18kg sealed thermal container. Temperature check 62°C OK."
    )
    db.add(delivery1)
    db.commit()

    # 10. Food Processing Unit Batches
    batches = [
        ProcessingBatch(
            batch_code="BATCH-PRC-2026-01",
            product_name="Sterilized Tomato Puree & Concentrate",
            input_raw_material_kg=600.0,
            useful_output_kg=534.0,
            waste_material_kg=66.0,
            processing_efficiency_pct=89.0,
            machine_downtime_mins=15,
            energy_consumption_kwh=48.5,
            date=(today - timedelta(days=2)).strftime("%Y-%m-%d"),
            notes="Skin & seed pulp redirected to vermicompost unit."
        ),
        ProcessingBatch(
            batch_code="BATCH-PRC-2026-02",
            product_name="Alphonso Mango Pulp Packaging",
            input_raw_material_kg=850.0,
            useful_output_kg=782.0,
            waste_material_kg=68.0,
            processing_efficiency_pct=92.0,
            machine_downtime_mins=0,
            energy_consumption_kwh=62.0,
            date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
            notes="Optimal extraction efficiency achieved with automated de-stoner."
        ),
        ProcessingBatch(
            batch_code="BATCH-PRC-2026-03",
            product_name="Dehydrated Garlic & Onion Powder",
            input_raw_material_kg=400.0,
            useful_output_kg=336.0,
            waste_material_kg=64.0,
            processing_efficiency_pct=84.0,
            machine_downtime_mins=30,
            energy_consumption_kwh=55.0,
            date=today.strftime("%Y-%m-%d"),
            notes="Heat recovery system operational, reduced drying energy by 14%."
        )
    ]
    db.add_all(batches)
    db.commit()

    # 11. Sustainability Metrics (Past 30 days cumulative)
    sust = SustainabilityMetric(
        date=today.strftime("%Y-%m-%d"),
        institution_id=inst1.id,
        waste_prevented_kg=1420.0,
        meals_delivered=3550,
        co2e_avoided_kg=round(1420.0 * 2.5, 1),      # 3550 kg CO2e
        water_saved_liters=round(1420.0 * 1500.0, 1), # 2,130,000 L
        financial_saved_inr=round(1420.0 * 120.0, 1), # ₹1,70,400
        baseline_waste_kg=2200.0,
        reduction_pct=35.45
    )
    db.add(sust)
    db.commit()

    # 12. In-App Notifications
    notifs = [
        Notification(
            user_role="ngo",
            title="🍲 New Surplus Food Available!",
            message="Loyola College Mega Mess published 60 portions of Vegetable Biryani. Safe & verified.",
            type="surplus",
            link="/surplus",
            is_read=False
        ),
        Notification(
            user_role="institution",
            title="✅ Donation Accepted by Akshaya Food Bank",
            message="45 portions of Chapati & Dal accepted. Eco-Van is in transit for pickup.",
            type="donation",
            link="/surplus",
            is_read=False
        ),
        Notification(
            user_role="institution",
            title="⚠️ Inventory Expiry Alert",
            message="Batch BAT-VEG-2026-92 (Country Tomatoes, 35kg) expires in 48 hours. Consider early usage.",
            type="inventory",
            link="/inventory",
            is_read=False
        ),
        Notification(
            user_role="delivery",
            title="🚚 Pickup Assignment #DEL-101",
            message="New pickup assigned: Loyola College Mega Mess Gate 3 -> Akshaya Food Bank (4.8 km).",
            type="delivery",
            link="/logistics",
            is_read=False
        ),
        Notification(
            user_role="institution",
            title="📈 AI Demand Forecast Generated",
            message="Projected lunch demand for tomorrow is 812 meals. Recommended prep: 852 meals.",
            type="forecast",
            link="/forecast",
            is_read=True
        )
    ]
    db.add_all(notifs)
    db.commit()

    print("Core database seeding completed successfully!")


def seed_smart_inventory_data(db):
    print("Seeding ZeroPlate AI Smart Inventory Intelligence & Traceability data...")
    today = datetime.now().date()
    now_dt = datetime.utcnow()

    # Retrieve or fallback institution
    inst = db.query(Institution).first()
    inst_id = inst.id if inst else 1

    # 1. Suppliers
    s1 = db.query(Supplier).filter(Supplier.name == "Green Roots Organic FPO").first()
    if not s1:
        s1 = Supplier(
            name="Green Roots Organic FPO",
            category="Fresh Produce",
            contact_person="R. Manickam",
            phone="+91 94432 11001",
            email="orders@greenroots.org",
            address="Agricultural Market Yard, Koyambedu, Chennai",
            delivery_lead_days=1,
            min_order_qty=20.0,
            rating=4.9,
            is_verified=True,
            availability_status="Available"
        )
        db.add(s1)
        db.commit()

    s2 = db.query(Supplier).filter(Supplier.name == "Kaveri Valley Rice & Agro Mill").first()
    if not s2:
        s2 = Supplier(
            name="Kaveri Valley Rice & Agro Mill",
            category="Grains & Pulses",
            contact_person="S. Ananth",
            phone="+91 94433 22002",
            email="supplies@kaverivalley.in",
            address="Thanjavur Road, Trichy, Tamil Nadu",
            delivery_lead_days=2,
            min_order_qty=50.0,
            rating=4.8,
            is_verified=True,
            availability_status="Available"
        )
        db.add(s2)
        db.commit()

    s3 = db.query(Supplier).filter(Supplier.name == "Aavin Dairy Farmers Union").first()
    if not s3:
        s3 = Supplier(
            name="Aavin Dairy Farmers Union",
            category="Dairy",
            contact_person="Dr. M. Soundar",
            phone="+91 94434 33003",
            email="institutional@aavin.tn.gov.in",
            address="Pasumpon Muthuramalingam Road, Nandanam, Chennai",
            delivery_lead_days=1,
            min_order_qty=15.0,
            rating=4.7,
            is_verified=True,
            availability_status="Available"
        )
        db.add(s3)
        db.commit()

    s4 = db.query(Supplier).filter(Supplier.name == "Kongu Pulse & Oil Processing").first()
    if not s4:
        s4 = Supplier(
            name="Kongu Pulse & Oil Processing",
            category="Grains & Pulses",
            contact_person="V. Balakrishnan",
            phone="+91 94435 44004",
            email="sales@kongupulses.com",
            address="Pollachi Main Road, Coimbatore, Tamil Nadu",
            delivery_lead_days=3,
            min_order_qty=25.0,
            rating=4.6,
            is_verified=True,
            availability_status="Available"
        )
        db.add(s4)
        db.commit()

    # 2. Supplier Price History
    prices = [
        SupplierPriceHistory(supplier_id=s1.id, ingredient_name="Country Tomatoes", unit_price_inr=32.0, effective_date=(today - timedelta(days=30)).strftime("%Y-%m-%d"), unit="kg"),
        SupplierPriceHistory(supplier_id=s1.id, ingredient_name="Bell Peppers & Carrots", unit_price_inr=42.0, effective_date=(today - timedelta(days=30)).strftime("%Y-%m-%d"), unit="kg"),
        SupplierPriceHistory(supplier_id=s1.id, ingredient_name="Red Onions", unit_price_inr=34.0, effective_date=(today - timedelta(days=30)).strftime("%Y-%m-%d"), unit="kg"),
        SupplierPriceHistory(supplier_id=s2.id, ingredient_name="Sona Masoori Rice", unit_price_inr=52.0, effective_date=(today - timedelta(days=30)).strftime("%Y-%m-%d"), unit="kg"),
        SupplierPriceHistory(supplier_id=s3.id, ingredient_name="Cow Milk & Fresh Curd", unit_price_inr=56.0, effective_date=(today - timedelta(days=30)).strftime("%Y-%m-%d"), unit="L"),
        SupplierPriceHistory(supplier_id=s4.id, ingredient_name="Toor Dal (Split Red Gram)", unit_price_inr=145.0, effective_date=(today - timedelta(days=30)).strftime("%Y-%m-%d"), unit="kg"),
        SupplierPriceHistory(supplier_id=s4.id, ingredient_name="Whole Wheat Atta", unit_price_inr=44.0, effective_date=(today - timedelta(days=30)).strftime("%Y-%m-%d"), unit="kg"),
    ]
    db.add_all(prices)
    db.commit()

    # 3. Batch Passports & QR Traceability Chains
    batches_data = [
        {
            "batch_number": "ZP-BATCH-2026-001",
            "ingredient_name": "Country Tomatoes",
            "category": "Vegetables",
            "initial_quantity": 50.0,
            "current_quantity": 45.0,
            "unit": "kg",
            "source_origin": "Coimbatore Organic Cooperative, TN",
            "supplier_name": "Green Roots Organic FPO",
            "purchase_date": (today - timedelta(days=2)).strftime("%Y-%m-%d"),
            "expiry_date": (today + timedelta(days=2)).strftime("%Y-%m-%d"),
            "storage_conditions": "Insulated Cold Chiller (4°C, 85% RH)",
            "current_location": "Central Cold Chiller 1 - Bay A",
            "fefo_priority": 1,
            "risk_level": "High Risk",
            "safety_status": "Verified Safe",
            "risk_reasons": "Short shelf life (< 48 hrs) and low consumption pace relative to stock volume."
        },
        {
            "batch_number": "ZP-BATCH-2026-002",
            "ingredient_name": "Sona Masoori Rice",
            "category": "Grains & Rice",
            "initial_quantity": 200.0,
            "current_quantity": 150.0,
            "unit": "kg",
            "source_origin": "Thanjavur Delta Mills, TN",
            "supplier_name": "Kaveri Valley Rice & Agro Mill",
            "purchase_date": (today - timedelta(days=10)).strftime("%Y-%m-%d"),
            "expiry_date": (today + timedelta(days=180)).strftime("%Y-%m-%d"),
            "storage_conditions": "Dry Ambient Granary (22°C, 50% RH)",
            "current_location": "Granary Bin G-12",
            "fefo_priority": 8,
            "risk_level": "Low Risk",
            "safety_status": "Verified Safe",
            "risk_reasons": "Stable moisture and prolonged remaining shelf life."
        },
        {
            "batch_number": "ZP-BATCH-2026-003",
            "ingredient_name": "Toor Dal (Split Red Gram)",
            "category": "Pulses & Legumes",
            "initial_quantity": 100.0,
            "current_quantity": 80.0,
            "unit": "kg",
            "source_origin": "Kongu Agro Cooperative, Pollachi",
            "supplier_name": "Kongu Pulse & Oil Processing",
            "purchase_date": (today - timedelta(days=5)).strftime("%Y-%m-%d"),
            "expiry_date": (today + timedelta(days=90)).strftime("%Y-%m-%d"),
            "storage_conditions": "Dry Ambient Storage (24°C, 45% RH)",
            "current_location": "Dry Pantry Shelf P-4",
            "fefo_priority": 7,
            "risk_level": "Low Risk",
            "safety_status": "Verified Safe",
            "risk_reasons": "Normal rotation buffer."
        },
        {
            "batch_number": "ZP-BATCH-2026-004",
            "ingredient_name": "Cow Milk & Fresh Curd",
            "category": "Dairy",
            "initial_quantity": 40.0,
            "current_quantity": 30.0,
            "unit": "L",
            "source_origin": "Aavin Dairy Cooperative, Chennai",
            "supplier_name": "Aavin Dairy Farmers Union",
            "purchase_date": (today - timedelta(days=1)).strftime("%Y-%m-%d"),
            "expiry_date": (today + timedelta(days=2)).strftime("%Y-%m-%d"),
            "storage_conditions": "Chilled Dairy Cooler (3°C)",
            "current_location": "Dairy Cold Cabinet D-1",
            "fefo_priority": 2,
            "risk_level": "High Risk",
            "safety_status": "Verified Safe",
            "risk_reasons": "High spoilage hazard; pasteurized dairy requires prompt recipe utilization."
        },
        {
            "batch_number": "ZP-BATCH-2026-005",
            "ingredient_name": "Bell Peppers & Carrots",
            "category": "Vegetables",
            "initial_quantity": 35.0,
            "current_quantity": 25.0,
            "unit": "kg",
            "source_origin": "Ooty Horticultural Cooperative, Nilgiris",
            "supplier_name": "Green Roots Organic FPO",
            "purchase_date": (today - timedelta(days=3)).strftime("%Y-%m-%d"),
            "expiry_date": (today + timedelta(days=3)).strftime("%Y-%m-%d"),
            "storage_conditions": "Chilled Produce Rack (5°C, 80% RH)",
            "current_location": "Produce Cooler Rack C",
            "fefo_priority": 3,
            "risk_level": "Medium Risk",
            "safety_status": "Verified Safe",
            "risk_reasons": "Approaching expiry window within 72 hours; prioritize in upcoming sambar prep."
        },
        {
            "batch_number": "ZP-BATCH-2026-006",
            "ingredient_name": "Whole Wheat Atta",
            "category": "Grains & Rice",
            "initial_quantity": 60.0,
            "current_quantity": 18.0,
            "unit": "kg",
            "source_origin": "Punjab Chakki Fresh Direct",
            "supplier_name": "Kaveri Valley Rice & Agro Mill",
            "purchase_date": (today - timedelta(days=20)).strftime("%Y-%m-%d"),
            "expiry_date": (today + timedelta(days=40)).strftime("%Y-%m-%d"),
            "storage_conditions": "Dry Ambient Granary (24°C)",
            "current_location": "Flour Storage Silo 2",
            "fefo_priority": 4,
            "risk_level": "Medium Risk",
            "safety_status": "Verified Safe",
            "risk_reasons": "Stock level is below safety threshold (30 kg); reorder recommended."
        }
    ]

    for b_data in batches_data:
        qr = generate_batch_qr_payload(b_data["batch_number"], {
            "name": b_data["ingredient_name"],
            "supplier": b_data["supplier_name"],
            "expiry": b_data["expiry_date"],
            "unit": b_data["unit"],
            "qty": b_data["current_quantity"]
        })
        bp = BatchPassport(
            institution_id=inst_id,
            batch_number=b_data["batch_number"],
            qr_code_payload=qr,
            ingredient_name=b_data["ingredient_name"],
            category=b_data["category"],
            initial_quantity=b_data["initial_quantity"],
            current_quantity=b_data["current_quantity"],
            unit=b_data["unit"],
            source_origin=b_data["source_origin"],
            supplier_name=b_data["supplier_name"],
            purchase_date=b_data["purchase_date"],
            expiry_date=b_data["expiry_date"],
            storage_conditions=b_data["storage_conditions"],
            current_location=b_data["current_location"],
            fefo_priority=b_data["fefo_priority"],
            risk_level=b_data["risk_level"],
            safety_status=b_data["safety_status"],
            risk_reasons=b_data["risk_reasons"]
        )
        db.add(bp)
        db.flush()

        # Seed realistic movement history events with SHA-256 integrity chaining
        # Event 1: Procurement Inward
        time1_dt = datetime.combine(datetime.strptime(b_data["purchase_date"], "%Y-%m-%d").date(), datetime.min.time()) + timedelta(hours=8, minutes=30)
        hash1 = compute_chain_hash("0" * 64, {
            "batch": bp.batch_number,
            "event": "Procurement Inward",
            "qty": bp.initial_quantity,
            "time": time1_dt.isoformat()
        })
        ev1 = BatchMovementEvent(
            batch_passport_id=bp.id,
            event_type="Procurement Inward",
            timestamp=time1_dt,
            quantity_delta=bp.initial_quantity,
            quantity_after=bp.initial_quantity,
            location=f"Intake Bay 1 ({b_data['source_origin']})",
            performed_by="Intake Officer M. Suresh",
            notes="FSSAI physical quality check passed. Barcode registered.",
            verification_hash=hash1
        )
        db.add(ev1)
        db.flush()

        # Event 2: Storage Relocation
        time2_dt = time1_dt + timedelta(hours=1, minutes=15)
        hash2 = compute_chain_hash(hash1, {
            "batch": bp.batch_number,
            "event": "Storage Relocation",
            "qty": 0,
            "time": time2_dt.isoformat()
        })
        ev2 = BatchMovementEvent(
            batch_passport_id=bp.id,
            event_type="Storage Relocation",
            timestamp=time2_dt,
            quantity_delta=0.0,
            quantity_after=bp.initial_quantity,
            location=bp.current_location,
            performed_by="Storage Supervisor K. Ramesh",
            notes=f"Moved into {bp.storage_conditions}.",
            verification_hash=hash2
        )
        db.add(ev2)
        db.flush()

        # If partially consumed, log Event 3: Kitchen Production
        if bp.initial_quantity > bp.current_quantity:
            used_qty = bp.initial_quantity - bp.current_quantity
            time3_dt = datetime.utcnow() - timedelta(hours=6)
            hash3 = compute_chain_hash(hash2, {
                "batch": bp.batch_number,
                "event": "Kitchen Production",
                "qty": -used_qty,
                "time": time3_dt.isoformat()
            })
            ev3 = BatchMovementEvent(
                batch_passport_id=bp.id,
                event_type="Kitchen Production",
                timestamp=time3_dt,
                quantity_delta=-used_qty,
                quantity_after=bp.current_quantity,
                location="Main Kitchen Cooking Section",
                performed_by="Chef S. Ramanathan",
                notes=f"Requisitioned {used_qty} {bp.unit} for institutional meal preparation.",
                verification_hash=hash3
            )
            db.add(ev3)

    db.commit()

    # 4. Food Waste Records across the 6 Stages
    waste_records = [
        FoodWasteRecord(
            institution_id=inst_id,
            ingredient_name="Country Tomatoes",
            food_category="Vegetables",
            quantity_kg=4.2,
            unit="kg",
            waste_stage="Storage loss",
            reason="Crushed during transport crate pallet stacking in vehicle",
            date_time=now_dt - timedelta(days=2),
            kitchen_name="Loyola Main Kitchen",
            financial_loss_inr=round(4.2 * 32.0, 2),
            co2e_impact_kg=round(4.2 * 2.5, 2),
            water_loss_liters=round(4.2 * 1500.0, 1),
            logged_by="Storage Officer K. Ramesh",
            action_taken="Diverted to organic bio-compost pit",
            notes="Informed transporter to avoid stacking crates beyond 4 tiers."
        ),
        FoodWasteRecord(
            institution_id=inst_id,
            ingredient_name="Bell Peppers & Carrots",
            food_category="Vegetables",
            quantity_kg=7.5,
            unit="kg",
            waste_stage="Preparation loss",
            reason="Excessive knife trim and peeling scrap during morning shift",
            date_time=now_dt - timedelta(days=1),
            kitchen_name="Loyola Main Kitchen",
            financial_loss_inr=round(7.5 * 42.0, 2),
            co2e_impact_kg=round(7.5 * 2.5, 2),
            water_loss_liters=round(7.5 * 1500.0, 1),
            logged_by="Sous Chef Anand M.",
            action_taken="Collected for vegetable stock reduction and compost",
            notes="Knife skills briefing scheduled with assistant kitchen trainees."
        ),
        FoodWasteRecord(
            institution_id=inst_id,
            ingredient_name="Sona Masoori Rice",
            food_category="Grains & Rice",
            quantity_kg=3.6,
            unit="kg",
            waste_stage="Cooking loss",
            reason="Bottom crust scorched during thermal steam jacket temperature spike",
            date_time=now_dt - timedelta(days=1),
            kitchen_name="Loyola Main Kitchen",
            financial_loss_inr=round(3.6 * 52.0, 2),
            co2e_impact_kg=round(3.6 * 2.5, 2),
            water_loss_liters=round(3.6 * 1500.0, 1),
            logged_by="Chef S. Ramanathan",
            action_taken="Sent to poultry feed recovery",
            notes="Steam safety pressure regulator valve recalibrated."
        ),
        FoodWasteRecord(
            institution_id=inst_id,
            ingredient_name="Cooked Rice & Sambar",
            food_category="Cooked Meals",
            quantity_kg=14.0,
            unit="kg",
            waste_stage="Plate leftovers",
            reason="Post-lunch student dining hall tray returns during festive exam day",
            date_time=now_dt - timedelta(hours=18),
            kitchen_name="Loyola Main Kitchen",
            financial_loss_inr=round(14.0 * 120.0, 2),
            co2e_impact_kg=round(14.0 * 2.5, 2),
            water_loss_liters=round(14.0 * 1500.0, 1),
            logged_by="Mess Steward P. Kumar",
            action_taken="Processed through on-site anaerobic digestor",
            notes="Portion sizing option (Standard vs Light) recommended to reduce waste."
        ),
        FoodWasteRecord(
            institution_id=inst_id,
            ingredient_name="Bananas & Seasonal Melons",
            food_category="Produce",
            quantity_kg=3.2,
            unit="kg",
            waste_stage="Expired or spoiled ingredients",
            reason="Overripened skin breakdown after weekend hostel closure",
            date_time=now_dt - timedelta(hours=10),
            kitchen_name="Loyola Main Kitchen",
            financial_loss_inr=round(3.2 * 45.0, 2),
            co2e_impact_kg=round(3.2 * 2.5, 2),
            water_loss_liters=round(3.2 * 1500.0, 1),
            logged_by="Storage Officer K. Ramesh",
            action_taken="Pureed into bakery fruit muffins or composted",
            notes="Procurement schedule adjusted for long weekend schedules."
        ),
        FoodWasteRecord(
            institution_id=inst_id,
            ingredient_name="Vegetable Extrusion Residue",
            food_category="Vegetables",
            quantity_kg=4.8,
            unit="kg",
            waste_stage="Processing and production losses",
            reason="Dehydration mesh filter edge buildup during solar food drying trial",
            date_time=now_dt - timedelta(hours=4),
            kitchen_name="Loyola Food Processing Unit",
            financial_loss_inr=round(4.8 * 28.0, 2),
            co2e_impact_kg=round(4.8 * 2.5, 2),
            water_loss_liters=round(4.8 * 1500.0, 1),
            logged_by="Technician R. Dinesh",
            action_taken="Turned into high-nutrient seasoning powder",
            notes="Fine scrap recovery rate improved by 18% with scraper attachment."
        )
    ]
    db.add_all(waste_records)
    db.commit()

    # 5. Recipes & Recipe Ingredients
    r1 = Recipe(
        name="South Indian Country Tomato Rasam",
        category="Lunch",
        dietary_type="Vegetarian",
        allergens="Gluten-Free, Nut-Free",
        servings_base=100,
        prep_time_mins=25,
        instructions="Simmer fresh crushed country tomatoes with black pepper, cumin, tamarind, and garlic."
    )
    r2 = Recipe(
        name="Nutritious Mixed Vegetable Sambar",
        category="Lunch",
        dietary_type="Vegetarian",
        allergens="Gluten-Free, Nut-Free",
        servings_base=100,
        prep_time_mins=45,
        instructions="Boil toor dal to soft consistency. Simmer mixed diced carrots, capsicum, and tomatoes with aromatic sambar spices."
    )
    r3 = Recipe(
        name="Traditional Tempered Curd Rice",
        category="Lunch",
        dietary_type="Vegetarian",
        allergens="Contains Dairy",
        servings_base=100,
        prep_time_mins=20,
        instructions="Mix soft steamed rice with fresh curd and milk. Temper with mustard seeds, curry leaves, and ginger."
    )
    r4 = Recipe(
        name="Wholesome Vegetable Khichdi",
        category="Dinner",
        dietary_type="Vegetarian",
        allergens="Gluten-Free, Nut-Free",
        servings_base=100,
        prep_time_mins=35,
        instructions="Pressure-cook rice and split lentils with turmeric, cumin, and diced mixed vegetables."
    )
    db.add_all([r1, r2, r3, r4])
    db.commit()

    # Recipe Ingredients (quantities per 100 servings)
    ingredients_map = [
        # Rasam (per 100 servings)
        RecipeIngredient(recipe_id=r1.id, ingredient_name="Country Tomatoes", qty_per_100_servings=3.5, unit="kg", is_critical=True),
        RecipeIngredient(recipe_id=r1.id, ingredient_name="Toor Dal (Split Red Gram)", qty_per_100_servings=0.8, unit="kg", is_critical=False),
        # Sambar (per 100 servings)
        RecipeIngredient(recipe_id=r2.id, ingredient_name="Toor Dal (Split Red Gram)", qty_per_100_servings=4.0, unit="kg", is_critical=True),
        RecipeIngredient(recipe_id=r2.id, ingredient_name="Bell Peppers & Carrots", qty_per_100_servings=4.5, unit="kg", is_critical=True),
        RecipeIngredient(recipe_id=r2.id, ingredient_name="Country Tomatoes", qty_per_100_servings=1.8, unit="kg", is_critical=False),
        # Curd Rice (per 100 servings)
        RecipeIngredient(recipe_id=r3.id, ingredient_name="Sona Masoori Rice", qty_per_100_servings=7.0, unit="kg", is_critical=True),
        RecipeIngredient(recipe_id=r3.id, ingredient_name="Cow Milk & Fresh Curd", qty_per_100_servings=5.0, unit="L", is_critical=True),
        # Khichdi (per 100 servings)
        RecipeIngredient(recipe_id=r4.id, ingredient_name="Sona Masoori Rice", qty_per_100_servings=6.0, unit="kg", is_critical=True),
        RecipeIngredient(recipe_id=r4.id, ingredient_name="Toor Dal (Split Red Gram)", qty_per_100_servings=2.5, unit="kg", is_critical=True),
        RecipeIngredient(recipe_id=r4.id, ingredient_name="Bell Peppers & Carrots", qty_per_100_servings=3.0, unit="kg", is_critical=False),
    ]
    db.add_all(ingredients_map)
    db.commit()

    # 6. Purchase Orders
    po1 = PurchaseOrder(
        po_number="ZP-PO-2026-081",
        institution_id=inst_id,
        supplier_id=s2.id,
        order_date=(today - timedelta(days=2)).strftime("%Y-%m-%d"),
        expected_delivery_date=(today + timedelta(days=1)).strftime("%Y-%m-%d"),
        status="Ordered",
        total_cost_inr=10400.0,
        auto_generated_by_ai=True,
        notes="Automated replenishment based on 14-day rice consumption forecast."
    )
    po2 = PurchaseOrder(
        po_number="ZP-PO-2026-082",
        institution_id=inst_id,
        supplier_id=s4.id,
        order_date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
        expected_delivery_date=(today + timedelta(days=2)).strftime("%Y-%m-%d"),
        status="Ordered",
        total_cost_inr=7250.0,
        auto_generated_by_ai=True,
        notes="Toor dal buffer replenishment for upcoming weekly schedule."
    )
    po3 = PurchaseOrder(
        po_number="ZP-PO-2026-083",
        institution_id=inst_id,
        supplier_id=s1.id,
        order_date=today.strftime("%Y-%m-%d"),
        expected_delivery_date=(today + timedelta(days=1)).strftime("%Y-%m-%d"),
        status="Draft",
        total_cost_inr=2100.0,
        auto_generated_by_ai=True,
        notes="Draft order recommended by ZeroPlate AI auto-replenishment engine."
    )
    db.add_all([po1, po2, po3])
    db.commit()

    po_items = [
        PurchaseOrderItem(
            purchase_order_id=po1.id,
            ingredient_name="Sona Masoori Rice",
            current_usable_stock=150.0,
            predicted_demand=320.0,
            safety_stock=50.0,
            recommended_reorder_qty=200.0,
            confirmed_qty=200.0,
            unit="kg",
            unit_price_inr=52.0,
            total_price_inr=10400.0
        ),
        PurchaseOrderItem(
            purchase_order_id=po2.id,
            ingredient_name="Toor Dal (Split Red Gram)",
            current_usable_stock=80.0,
            predicted_demand=110.0,
            safety_stock=20.0,
            recommended_reorder_qty=50.0,
            confirmed_qty=50.0,
            unit="kg",
            unit_price_inr=145.0,
            total_price_inr=7250.0
        ),
        PurchaseOrderItem(
            purchase_order_id=po3.id,
            ingredient_name="Bell Peppers & Carrots",
            current_usable_stock=25.0,
            predicted_demand=65.0,
            safety_stock=10.0,
            recommended_reorder_qty=50.0,
            confirmed_qty=50.0,
            unit="kg",
            unit_price_inr=42.0,
            total_price_inr=2100.0
        )
    ]
    db.add_all(po_items)
    db.commit()

    print("ZeroPlate AI Smart Inventory Intelligence demo data seeded successfully!")


