# 🧪 ChemScope
### AI-Powered Molecular Analysis & Drug Discovery Platform

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)
![RDKit](https://img.shields.io/badge/RDKit-Cheminformatics-red)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

ChemScope is a modern web platform for **molecular visualization, cheminformatics, and AI-assisted drug discovery**. It enables researchers, students, and chemists to analyze molecules using molecular descriptors, drug-likeness filters, molecular fingerprints, dimensionality reduction, clustering, and interactive visualizations.

---

# 🚀 Features

## 🔬 Molecular Analysis

- Search molecules by **name** or **SMILES**
- Automatic structure resolution using PubChem
- Molecular descriptor calculation
- Drug-likeness evaluation

### Calculated Properties

- Molecular Weight
- LogP
- TPSA
- Hydrogen Bond Donors
- Hydrogen Bond Acceptors
- Rotatable Bonds
- Synthetic Accessibility
- QED Score
- PAINS Alerts

---

## 💊 Drug Discovery Filters

ChemScope evaluates compounds using industry-standard filters.

✅ Lipinski Rule of Five

✅ Veber Rule

✅ Ghose Filter

✅ QED

✅ PAINS Screening

---

## 🧬 Molecular Fingerprints

Supports:

- Morgan Fingerprints
- MACCS Keys
- Tanimoto Similarity

---

## 📊 Data Visualization

Interactive charts built with Plotly.

Current visualizations include:

- Molecular Descriptor Charts
- Drug-likeness Summary
- Fingerprint Information

Upcoming:

- PCA
- UMAP
- t-SNE
- Radar Charts
- Similarity Networks

---

## 🧪 Machine Learning (Upcoming)

- QSAR Models
- Toxicity Prediction
- Solubility Prediction
- Bioactivity Prediction
- Molecular Clustering
- Similarity Search
- AI Property Prediction

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Bootstrap
- Axios
- Plotly.js
- 3Dmol.js

---

## Backend

- FastAPI
- RDKit
- Pandas
- NumPy
- Scikit-Learn
- Requests

---

# 📂 Project Structure

```
ChemScope
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── main.py
│   ├── requirements.txt
│   └── verify_pca.py
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Bhvya11singh/ChemScope.git

cd ChemScope
```

---

# Backend Setup

Create a virtual environment

```bash
python -m venv venv
```

Activate it

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
uvicorn main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

---

# Frontend Setup

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# API Endpoints

## Health Check

```
GET /
```

---

## Analyze Molecule

```
GET /analyze/{compound}
```

Example

```
/analyze/Aspirin
```

or

```
/analyze/CCO
```

Returns

- Molecular descriptors
- Fingerprints
- Drug-likeness filters
- QED
- Synthetic accessibility
- PAINS alerts

---

## PCA

```
POST /pca
```

Input

CSV dataset

Output

- Principal Components
- Explained Variance

---

# Screenshots

## Home Page


<img width="1847" height="897" alt="Screenshot 2026-07-02 141611" src="https://github.com/user-attachments/assets/d9e7ba59-aea7-48d3-a200-65c64710ae71" />
<img width="1421" height="562" alt="Screenshot 2026-07-02 141625" src="https://github.com/user-attachments/assets/7da4b998-531a-4815-aae4-3b9143a133cc" />


---

## Molecular Workspace

<img width="1517" height="877" alt="Screenshot 2026-07-02 141644" src="https://github.com/user-attachments/assets/d6278685-298c-400a-9573-c8c68e07af46" />

<img width="1418" height="687" alt="Screenshot 2026-07-02 141658" src="https://github.com/user-attachments/assets/6d6af223-1da6-4b04-a7b4-77e62b75e7f9" />


---

## Analysis Dashboard

<img width="1790" height="712" alt="Screenshot 2026-07-02 141829" src="https://github.com/user-attachments/assets/dafefecf-ae76-453f-8e15-403e7a794b37" />
<img width="1911" height="573" alt="Screenshot 2026-07-02 141739" src="https://github.com/user-attachments/assets/a9ea6e51-7332-4c4f-9f18-6da3c88c51ba" />




# Roadmap

### ✅ Completed

- Molecular Search
- Drug-Likeness Rules
- Descriptor Calculation
- Molecular Fingerprints
- FastAPI Backend
- Plotly Charts

### 🚧 In Progress

- Interactive 2D Molecule Viewer
- Interactive 3D Viewer
- PCA Visualization
- Clustering

### 🔜 Upcoming

- UMAP
- t-SNE
- QSAR Models
- Toxicity Prediction
- Solubility Prediction
- Similarity Search
- Molecular Docking Integration
- AI Chat Assistant

---

# Why ChemScope?

ChemScope combines modern web technologies with cheminformatics to create an intuitive molecular analysis platform suitable for:

- Students
- Researchers
- Pharmaceutical Scientists
- Computational Chemists
- Drug Discovery Teams

The goal is to make computational chemistry tools more accessible through an interactive web interface.

---

# Future Vision

ChemScope aims to evolve into a complete AI-powered drug discovery platform featuring:

- Protein visualization
- Molecular docking
- Virtual screening
- Deep Learning QSAR
- Explainable AI
- Multi-omics integration
- Cloud deployment

---

# Contributing

Contributions are welcome.

Fork the repository

Create a feature branch

```bash
git checkout -b feature-name
```

Commit changes

```bash
git commit -m "Added new feature"
```

Push

```bash
git push origin feature-name
```

Create a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Author

### Bhavya Singh

B.Tech Mathematics & Computing

Interested in

- AI for Drug Discovery
- Machine Learning
- Computational Chemistry
- Mathematical Modeling
- Scientific Computing

GitHub:

https://github.com/Bhvya11singh

---

⭐ If you found this project useful, consider giving it a star!
