from datetime import datetime, timedelta
from .models import (
    User, Institution, Kitchen, NGO, DeliveryPartner, InventoryItem,
    ProductionRecord, FoodQualityLog, SurplusListing, Donation,
    DeliveryAssignment, ProcessingBatch, SustainabilityMetric, Notification
)

def seed_database(db):
    # Check if already seeded
    if db.query(User).first():
        return

    print("Seeding Amudhai AI database with realistic demonstration data...")

    # 1. Users
    users = [
        User(username="kitchen_admin", email="kitchen@loyola.edu", hashed_password="pbkdf2:admin123", role="institution", organization_name="Loyola College Mega Mess", phone="+91 98400 11223"),
        User(username="hotel_admin", email="manager@annapoorna.com", hashed_password="pbkdf2:hotel123", role="institution", organization_name="Hotel Annapoorna Grand", phone="+91 98400 22334"),
        User(username="ngo_user", email="director@akshayafood.org", hashed_password="pbkdf2:ngo123", role="ngo", organization_name="Akshaya Food Bank Chennai", phone="+91 98400 33445"),
        User(username="delivery_driver", email="murugan@greenexpress.in", hashed_password="pbkdf2:driver123", role="delivery", organization_name="GreenExpress Eco-Van", phone="+91 98401 23456"),
        User(username="platform_admin", email="admin@amudhai.eco", hashed_password="pbkdf2:super123", role="admin", organization_name="Amudhai Ecosystem HQ", phone="+91 98400 99999"),
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

    print("Database seeding completed successfully!")
