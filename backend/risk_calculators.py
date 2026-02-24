
import math

def calculate_framingham_risk(
    gender: str,
    age: int,
    total_cholesterol: float,
    hdl_cholesterol: float,
    systolic_bp: int,
    smoker: bool,
    diabetes: bool,
    on_hypertension_treatment: bool = False
) -> dict:
    """
    Calculate 10-year risk of coronary heart disease using the Framingham Risk Score (ATP III).
    
    Parameters:
    - gender: "Male" or "Female"
    - age: int (20-79)
    - total_cholesterol: mg/dL
    - hdl_cholesterol: mg/dL
    - systolic_bp: mmHg
    - smoker: bool
    - diabetes: bool (not used in standard ATP III points, used in others, here used for additional context)
    - on_hypertension_treatment: bool
    
    Returns:
    - dict with "score" (points), "risk_percent" (10-year risk), "risk_category"
    """
    
    # Defaults and clamping for safety
    if not age: age = 50
    if not total_cholesterol: total_cholesterol = 200
    if not hdl_cholesterol: hdl_cholesterol = 50
    if not systolic_bp: systolic_bp = 120
    
    points = 0
    
    # 1. Age
    if gender == "Male":
        if 20 <= age <= 34: points -= 9
        elif 35 <= age <= 39: points -= 4
        elif 40 <= age <= 44: points += 0
        elif 45 <= age <= 49: points += 3
        elif 50 <= age <= 54: points += 6
        elif 55 <= age <= 59: points += 8
        elif 60 <= age <= 64: points += 10
        elif 65 <= age <= 69: points += 11
        elif 70 <= age <= 74: points += 12
        elif 75 <= age <= 79: points += 13
    else: # Female
        if 20 <= age <= 34: points -= 7
        elif 35 <= age <= 39: points -= 3
        elif 40 <= age <= 44: points += 0
        elif 45 <= age <= 49: points += 3
        elif 50 <= age <= 54: points += 6
        elif 55 <= age <= 59: points += 8
        elif 60 <= age <= 64: points += 10
        elif 65 <= age <= 69: points += 12
        elif 70 <= age <= 74: points += 14
        elif 75 <= age <= 79: points += 16

    # 2. Total Cholesterol
    tc = total_cholesterol
    if gender == "Male":
        if 20 <= age <= 39:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 4
            elif 200 <= tc <= 239: points += 7
            elif 240 <= tc <= 279: points += 9
            elif tc >= 280: points += 11
        elif 40 <= age <= 49:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 3
            elif 200 <= tc <= 239: points += 5
            elif 240 <= tc <= 279: points += 6
            elif tc >= 280: points += 8
        elif 50 <= age <= 59:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 2
            elif 200 <= tc <= 239: points += 3
            elif 240 <= tc <= 279: points += 4
            elif tc >= 280: points += 5
        elif 60 <= age <= 69:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 1
            elif 200 <= tc <= 239: points += 1
            elif 240 <= tc <= 279: points += 2
            elif tc >= 280: points += 3
        elif age >= 70:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 0
            elif 200 <= tc <= 239: points += 0
            elif 240 <= tc <= 279: points += 1
            elif tc >= 280: points += 1
    else: # Female
        if 20 <= age <= 39:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 4
            elif 200 <= tc <= 239: points += 8
            elif 240 <= tc <= 279: points += 11
            elif tc >= 280: points += 13
        elif 40 <= age <= 49:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 3
            elif 200 <= tc <= 239: points += 6
            elif 240 <= tc <= 279: points += 8
            elif tc >= 280: points += 10
        elif 50 <= age <= 59:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 2
            elif 200 <= tc <= 239: points += 4
            elif 240 <= tc <= 279: points += 5
            elif tc >= 280: points += 7
        elif 60 <= age <= 69:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 1
            elif 200 <= tc <= 239: points += 2
            elif 240 <= tc <= 279: points += 3
            elif tc >= 280: points += 4
        elif age >= 70:
            if tc < 160: points += 0
            elif 160 <= tc <= 199: points += 1
            elif 200 <= tc <= 239: points += 1
            elif 240 <= tc <= 279: points += 2
            elif tc >= 280: points += 2

    # 3. Smoking Status
    if smoker:
        if gender == "Male":
            if 20 <= age <= 39: points += 8
            elif 40 <= age <= 49: points += 5
            elif 50 <= age <= 59: points += 3
            elif 60 <= age <= 69: points += 1
            elif age >= 70: points += 1
        else: # Female
            if 20 <= age <= 39: points += 9
            elif 40 <= age <= 49: points += 7
            elif 50 <= age <= 59: points += 4
            elif 60 <= age <= 69: points += 2
            elif age >= 70: points += 1

    # 4. HDL Cholesterol
    hdl = hdl_cholesterol
    if hdl >= 60: points -= 1
    elif 50 <= hdl <= 59: points += 0
    elif 40 <= hdl <= 49: points += 1
    elif hdl < 40: points += 2

    # 5. Systolic Blood Pressure
    sbp = systolic_bp
    if on_hypertension_treatment: # Treated
        if gender == "Male":
            if sbp < 120: points += 0
            elif 120 <= sbp <= 129: points += 1
            elif 130 <= sbp <= 139: points += 2
            elif 140 <= sbp <= 159: points += 2
            elif sbp >= 160: points += 3
        else: # Female
            if sbp < 120: points += 0
            elif 120 <= sbp <= 129: points += 3
            elif 130 <= sbp <= 139: points += 4
            elif 140 <= sbp <= 159: points += 5
            elif sbp >= 160: points += 6
    else: # Untreated
        if gender == "Male":
            if sbp < 120: points += 0
            elif 120 <= sbp <= 129: points += 0
            elif 130 <= sbp <= 139: points += 1
            elif 140 <= sbp <= 159: points += 1
            elif sbp >= 160: points += 2
        else: # Female
            if sbp < 120: points += 0
            elif 120 <= sbp <= 129: points += 1
            elif 130 <= sbp <= 139: points += 2
            elif 140 <= sbp <= 159: points += 3
            elif sbp >= 160: points += 4

    # Calculate Risk
    risk_percent = 0
    if gender == "Male":
        if points <= 0: risk_percent = "<1%"
        elif points == 1: risk_percent = "1%"
        elif points == 2: risk_percent = "1%"
        elif points == 3: risk_percent = "1%"
        elif points == 4: risk_percent = "1%"
        elif points == 5: risk_percent = "2%"
        elif points == 6: risk_percent = "2%"
        elif points == 7: risk_percent = "3%"
        elif points == 8: risk_percent = "4%"
        elif points == 9: risk_percent = "5%"
        elif points == 10: risk_percent = "6%"
        elif points == 11: risk_percent = "8%"
        elif points == 12: risk_percent = "10%"
        elif points == 13: risk_percent = "12%"
        elif points == 14: risk_percent = "16%"
        elif points == 15: risk_percent = "20%"
        elif points == 16: risk_percent = "25%"
        elif points >= 17: risk_percent = ">30%"
    else: # Female
        if points <= 9: risk_percent = "<1%"
        elif points == 10: risk_percent = "1%"
        elif points == 11: risk_percent = "1%"
        elif points == 12: risk_percent = "1%"
        elif points == 13: risk_percent = "2%"
        elif points == 14: risk_percent = "2%"
        elif points == 15: risk_percent = "3%"
        elif points == 16: risk_percent = "4%"
        elif points == 17: risk_percent = "5%"
        elif points == 18: risk_percent = "6%"
        elif points == 19: risk_percent = "8%"
        elif points == 20: risk_percent = "11%"
        elif points == 21: risk_percent = "14%"
        elif points == 22: risk_percent = "17%"
        elif points == 23: risk_percent = "22%"
        elif points == 24: risk_percent = "27%"
        elif points >= 25: risk_percent = ">30%"

    risk_category = "Low"
    if ">" in risk_percent:
        risk_category = "High"
    elif "<" in risk_percent:
        risk_category = "Low"
    else:
        val = int(risk_percent.replace("%", ""))
        if val >= 20: risk_category = "High"
        elif val >= 10: risk_category = "Intermediate"
        else: risk_category = "Low"

    return {
        "score": points,
        "risk_percent": risk_percent,
        "risk_category": risk_category,
        "calculator": "Framingham Risk Score (ATP III)"
    }
