"""Optional MVP ML script: trains a logistic regression classifier on synthetic EO features.
Run: python train_model.py
"""
import numpy as np, joblib
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def make_data(n=2500):
    rng = np.random.default_rng(42)
    turb = rng.gamma(2.2, 10, n)
    chl = rng.gamma(1.8, 7, n)
    tsm = turb * rng.uniform(0.7, 1.8, n)
    temp_anom = np.abs(rng.normal(1.5, 2.0, n))
    no2 = rng.gamma(2, 0.00004, n)
    ndwi = rng.normal(0.38, 0.15, n)
    score = 100 - np.clip((turb-5)/45,0,1)*28 - np.clip((chl-5)/35,0,1)*24 - np.clip((tsm-10)/70,0,1)*16 - np.clip(temp_anom/8,0,1)*10 - np.clip((0.15-ndwi)/0.4,0,1)*18
    y = (score >= 75).astype(int)
    return np.c_[ndwi, turb, chl, tsm, temp_anom, no2], y

X, y = make_data()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.2, random_state=7)
model = LogisticRegression(max_iter=1000).fit(X_train, y_train)
print(classification_report(y_test, model.predict(X_test)))
joblib.dump(model, "terra_sip_logreg.joblib")
