import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def test(name, fn):
    try:
        fn()
        print(f"  [PASS] {name}")
    except Exception as e:
        print(f"  [FAIL] {name}: {e}")
        sys.exit(1)

def main():
    print("Running AMUDHAI Ecosystem End-to-End Verification Test Suite...\n")

    # 1. Health check
    def test_health():
        res = urllib.request.urlopen(f"{BASE_URL}/api/health")
        data = json.loads(res.read().decode('utf-8'))
        assert data["status"] == "healthy"
    test("GET /api/health", test_health)

    # 2. Dashboard summary
    def test_dashboard():
        res = urllib.request.urlopen(f"{BASE_URL}/api/dashboard/summary")
        data = json.loads(res.read().decode('utf-8'))
        assert "kpis" in data
        assert data["kpis"]["total_prepared"] > 0
        assert "charts" in data
        assert len(data["charts"]["daily_production"]) > 0
    test("GET /api/dashboard/summary KPIs & Recharts Data", test_dashboard)

    # 3. AI Demand Forecasting with Scikit-Learn
    def test_forecast():
        payload = json.dumps({
            "kitchen_id": 1,
            "date": "2026-09-29",
            "meal_period": "Lunch",
            "expected_attendance": 850,
            "day_of_week": "Tuesday",
            "holiday_event": "Regular Working Day",
            "weather_cond": "Sunny (32°C)",
            "buffer_percent": 5.0
        }).encode('utf-8')
        req = urllib.request.Request(f"{BASE_URL}/api/forecasts/predict", data=payload, headers={'Content-Type': 'application/json'})
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        assert data["predicted_meals"] > 0
        assert data["recommended_prep"] >= data["predicted_meals"]
        assert len(data["ingredient_requirements"]) > 0
        assert "recommendation_text" in data
    test("POST /api/forecasts/predict (Scikit-Learn ML Model)", test_forecast)

    # 4. Inventory with FEFO ordering
    def test_inventory():
        res = urllib.request.urlopen(f"{BASE_URL}/api/inventory")
        items = json.loads(res.read().decode('utf-8'))
        assert len(items) > 0
        # Check FEFO sorting (expiry_date ascending)
        dates = [item["expiry_date"] for item in items]
        assert dates == sorted(dates)
    test("GET /api/inventory with FEFO Expiry Sorting", test_inventory)

    # 5. Food Quality Assessment & Mandatory Disclaimer
    def test_quality():
        res = urllib.request.urlopen(f"{BASE_URL}/api/quality/readings")
        data = json.loads(res.read().decode('utf-8'))
        assert "disclaimer" in data
        assert "AI image assessment is indicative only" in data["disclaimer"]
        assert len(data["sensors"]) == 3
    test("GET /api/quality/readings with Mandatory Safety Disclaimer", test_quality)

    # 6. Surplus Food & NGO Marketplace
    def test_surplus():
        res = urllib.request.urlopen(f"{BASE_URL}/api/surplus")
        listings = json.loads(res.read().decode('utf-8'))
        assert len(listings) > 0
    test("GET /api/surplus Listings", test_surplus)

    # 7. NGO Directory & Smart Matching
    def test_ngos():
        res = urllib.request.urlopen(f"{BASE_URL}/api/ngos")
        ngos = json.loads(res.read().decode('utf-8'))
        assert len(ngos) >= 5

        match_res = urllib.request.urlopen(f"{BASE_URL}/api/ngos/matches/1")
        match_data = json.loads(match_res.read().decode('utf-8'))
        assert len(match_data["matches"]) > 0
        assert match_data["matches"][0]["match_score"] > 50
    test("GET /api/ngos and AI Proximity Matching Algorithm", test_ngos)

    # 8. Complete Step-by-Step Donation & Delivery Workflow
    def test_donation_and_delivery():
        # First post a surplus item
        payload = json.dumps({
            "institution_id": 1,
            "food_name": "Test Sambar Rice Consignment",
            "category": "Cooked Meals",
            "quantity_kg": 15.0,
            "portions": 35,
            "pickup_address": "Loyola Campus Gate 2",
            "prep_datetime": "2026-09-28 13:00",
            "pickup_deadline": "2026-09-28 16:00",
            "storage_condition": "Thermal Insulated",
            "contact_phone": "+91 98400 11223"
        }).encode('utf-8')
        req = urllib.request.Request(f"{BASE_URL}/api/surplus", data=payload, headers={'Content-Type': 'application/json'})
        listing = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        listing_id = listing["id"]

        # Accept donation by NGO #1 (Akshaya Food Bank)
        accept_payload = json.dumps({"ngo_id": 1}).encode('utf-8')
        accept_req = urllib.request.Request(f"{BASE_URL}/api/donations/{listing_id}/accept", data=accept_payload, headers={'Content-Type': 'application/json'})
        accept_res = json.loads(urllib.request.urlopen(accept_req).read().decode('utf-8'))
        assert accept_res["status"] == "Accepted"
        delivery_id = accept_res["delivery_id"]

        # Attempt duplicate acceptance (must fail with HTTP 400)
        duplicate_failed = False
        try:
            urllib.request.urlopen(accept_req)
        except urllib.error.HTTPError as e:
            if e.code == 400:
                duplicate_failed = True
        assert duplicate_failed, "Duplicate acceptance should have been rejected by backend!"

        # Progress delivery status: Picked Up -> In Transit -> Delivered
        for st in ["Picked Up", "In Transit", "Delivered"]:
            patch_data = json.dumps({"status": st, "proof_notes": f"Step {st} verified"}).encode('utf-8')
            patch_req = urllib.request.Request(
                f"{BASE_URL}/api/deliveries/{delivery_id}/status",
                data=patch_data,
                headers={'Content-Type': 'application/json'},
                method='PATCH'
            )
            urllib.request.urlopen(patch_req)

    test("Donation Claim Concurrency Lock & Delivery Status Flow", test_donation_and_delivery)

    # 9. Food Processing Unit Efficiency Calculation
    def test_processing():
        import time
        payload = json.dumps({
            "batch_code": f"BATCH-TEST-{int(time.time() * 1000)}",
            "product_name": "Test Tomato Puree Line",
            "input_raw_material_kg": 500.0,
            "useful_output_kg": 440.0,
            "machine_downtime_mins": 10,
            "energy_consumption_kwh": 45.0,
            "date": "2026-09-28"
        }).encode('utf-8')
        req = urllib.request.Request(f"{BASE_URL}/api/processing/batches", data=payload, headers={'Content-Type': 'application/json'})
        batch = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        assert batch["processing_efficiency_pct"] == 88.0
        assert batch["waste_material_kg"] == 60.0
    test("POST /api/processing/batches Efficiency Formula Check", test_processing)

    # 10. Sustainability Report & CSV Export
    def test_sustainability():
        res = urllib.request.urlopen(f"{BASE_URL}/api/sustainability/report")
        report = json.loads(res.read().decode('utf-8'))
        assert report["waste_prevented_kg"] > 0
        assert report["co2e_avoided_kg"] == round(report["waste_prevented_kg"] * 2.5, 1)

        csv_res = urllib.request.urlopen(f"{BASE_URL}/api/sustainability/download-csv")
        csv_text = csv_res.read().decode('utf-8')
        assert "Food Waste Prevented" in csv_text
    test("GET /api/sustainability/report & CSV Export", test_sustainability)

    # 11. Frontend SPA index & bundle check
    def test_frontend_spa():
        res = urllib.request.urlopen(f"{BASE_URL}/")
        html = res.read().decode('utf-8')
        assert "AMUDHAI" in html or "root" in html
    test("GET / Frontend SPA Mount & Bundle", test_frontend_spa)

    print("\n[SUCCESS] All 11 End-to-End Workflow Tests Passed Successfully!\n")

if __name__ == "__main__":
    main()
