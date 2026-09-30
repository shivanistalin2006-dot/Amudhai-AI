import json
import sys
import os

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Support TestClient directly for robust offline testing
try:
    from fastapi.testclient import TestClient
    from backend.main import app
    client = TestClient(app)
    USE_TEST_CLIENT = True
except Exception as e:
    import urllib.request
    USE_TEST_CLIENT = False
    BASE_URL = "http://127.0.0.1:8000"


def http_get(url_path):
    if USE_TEST_CLIENT:
        res = client.get(url_path)
        return res.status_code, res.json()
    else:
        res = urllib.request.urlopen(f"{BASE_URL}{url_path}")
        return res.getcode(), json.loads(res.read().decode('utf-8'))

def http_post(url_path, json_data):
    if USE_TEST_CLIENT:
        res = client.post(url_path, json=json_data)
        return res.status_code, res.json()
    else:
        req = urllib.request.Request(
            f"{BASE_URL}{url_path}",
            data=json.dumps(json_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        res = urllib.request.urlopen(req)
        return res.getcode(), json.loads(res.read().decode('utf-8'))

def http_patch(url_path, json_data):
    if USE_TEST_CLIENT:
        res = client.patch(url_path, json=json_data)
        return res.status_code, res.json()
    else:
        req = urllib.request.Request(
            f"{BASE_URL}{url_path}",
            data=json.dumps(json_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='PATCH'
        )
        res = urllib.request.urlopen(req)
        return res.getcode(), json.loads(res.read().decode('utf-8'))

def test(name, fn):
    try:
        fn()
        print(f"  [PASS] {name}")
    except Exception as e:
        print(f"  [FAIL] {name}: {e}")
        sys.exit(1)


def main():
    print("Running ZeroPlate AI Ecosystem End-to-End Verification Test Suite...\n")

    # 1. Health check
    def test_health():
        status, data = http_get("/api/health")
        assert status == 200
        assert data["status"] == "healthy"
    test("GET /api/health", test_health)

    # 2. Dashboard summary
    def test_dashboard():
        status, data = http_get("/api/dashboard/summary")
        assert status == 200
        assert "kpis" in data
        assert data["kpis"]["total_prepared"] > 0
        assert "charts" in data
        assert len(data["charts"]["daily_production"]) > 0
    test("GET /api/dashboard/summary KPIs & Recharts Data", test_dashboard)

    # 3. AI Demand Forecasting with Scikit-Learn
    def test_forecast():
        payload = {
            "kitchen_id": 1,
            "date": "2026-09-29",
            "meal_period": "Lunch",
            "expected_attendance": 850,
            "day_of_week": "Tuesday",
            "holiday_event": "Regular Working Day",
            "weather_cond": "Sunny (32°C)",
            "buffer_percent": 5.0
        }
        status, data = http_post("/api/forecasts/predict", payload)
        assert status == 200
        assert data["predicted_meals"] > 0
        assert data["recommended_prep"] >= data["predicted_meals"]
        assert len(data["ingredient_requirements"]) > 0
        assert "recommendation_text" in data
    test("POST /api/forecasts/predict (Scikit-Learn ML Model)", test_forecast)

    # 4. Inventory with FEFO ordering
    def test_inventory():
        status, items = http_get("/api/inventory")
        assert status == 200
        assert len(items) > 0
        dates = [item["expiry_date"] for item in items]
        assert dates == sorted(dates)
    test("GET /api/inventory with FEFO Expiry Sorting", test_inventory)

    # 5. Food Quality Assessment & Mandatory Disclaimer
    def test_quality():
        status, data = http_get("/api/quality/readings")
        assert status == 200
        assert "disclaimer" in data
        assert "AI image assessment is indicative only" in data["disclaimer"]
        assert len(data["sensors"]) == 3
    test("GET /api/quality/readings with Mandatory Safety Disclaimer", test_quality)

    # 6. Surplus Food & NGO Marketplace
    def test_surplus():
        status, listings = http_get("/api/surplus")
        assert status == 200
        assert len(listings) > 0
    test("GET /api/surplus Listings", test_surplus)

    # 7. NGO Directory & Smart Matching
    def test_ngos():
        status, ngos = http_get("/api/ngos")
        assert status == 200
        assert len(ngos) >= 5

        status, match_data = http_get("/api/ngos/matches/1")
        assert status == 200
        assert len(match_data["matches"]) > 0
        assert match_data["matches"][0]["match_score"] > 50
    test("GET /api/ngos and AI Proximity Matching Algorithm", test_ngos)

    # 8. Complete Step-by-Step Donation & Delivery Workflow
    def test_donation_and_delivery():
        payload = {
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
        }
        status, listing = http_post("/api/surplus", payload)
        assert status == 200
        listing_id = listing["id"]

        accept_payload = {"ngo_id": 1}
        status, accept_res = http_post(f"/api/donations/{listing_id}/accept", accept_payload)
        assert status == 200
        assert accept_res["status"] == "Accepted"
        delivery_id = accept_res["delivery_id"]

        # Duplicate acceptance check
        status, dup_res = http_post(f"/api/donations/{listing_id}/accept", accept_payload)
        assert status == 400, "Duplicate acceptance should have been rejected by backend!"

        for st in ["Picked Up", "In Transit", "Delivered"]:
            patch_data = {"status": st, "proof_notes": f"Step {st} verified"}
            status, _ = http_patch(f"/api/deliveries/{delivery_id}/status", patch_data)
            assert status == 200
    test("Donation Claim Concurrency Lock & Delivery Status Flow", test_donation_and_delivery)

    # 9. Food Processing Unit Efficiency Calculation
    def test_processing():
        import time
        payload = {
            "batch_code": f"BATCH-TEST-{int(time.time() * 1000)}",
            "product_name": "Test Tomato Puree Line",
            "input_raw_material_kg": 500.0,
            "useful_output_kg": 440.0,
            "machine_downtime_mins": 10,
            "energy_consumption_kwh": 45.0,
            "date": "2026-09-28"
        }
        status, batch = http_post("/api/processing/batches", payload)
        assert status == 200
        assert batch["processing_efficiency_pct"] == 88.0
        assert batch["waste_material_kg"] == 60.0
    test("POST /api/processing/batches Efficiency Formula Check", test_processing)

    # 10. Sustainability Report & CSV Export
    def test_sustainability():
        status, report = http_get("/api/sustainability/report")
        assert status == 200
        assert report["waste_prevented_kg"] > 0
        assert report["co2e_avoided_kg"] == round(report["waste_prevented_kg"] * 2.5, 1)

        if USE_TEST_CLIENT:
            csv_res = client.get("/api/sustainability/download-csv")
            assert "Food Waste Prevented" in csv_res.text
        else:
            csv_res = urllib.request.urlopen(f"{BASE_URL}/api/sustainability/download-csv")
            csv_text = csv_res.read().decode('utf-8')
            assert "Food Waste Prevented" in csv_text
    test("GET /api/sustainability/report & CSV Export", test_sustainability)

    # 11. Frontend SPA index & bundle check
    def test_frontend_spa():
        if USE_TEST_CLIENT:
            res = client.get("/")
            assert res.status_code == 200
            assert "ZeroPlate" in res.text or "root" in res.text
        else:
            res = urllib.request.urlopen(f"{BASE_URL}/")
            html = res.read().decode('utf-8')
            assert "ZeroPlate" in html or "root" in html
    test("GET / Frontend SPA Mount & Bundle", test_frontend_spa)

    print("\n[SUCCESS] All 11 End-to-End Workflow Tests Passed Successfully!\n")


if __name__ == "__main__":
    main()
