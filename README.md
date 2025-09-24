# Variant Analysis Evo2 🧬

## Installation

### Prerequisites
- Python 3.12  
- Node.js 18+  
- CUDA-compatible GPU (for local development)  
- Modal account (for cloud deployment)  

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/variant-analysis-evo2.git
cd variant-analysis-evo2/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

---

## Usage

### Running Locally
Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Cloud Deployment
Install the Modal CLI:
```bash
pip install modal
```

Deploy the backend:
```bash
cd backend
modal deploy main.py
```

Deploy the frontend to Vercel:
```bash
cd ../frontend
vercel
```

---

## API Endpoints

### Genomic Data
- `GET /api/genomes` — List available genome assemblies  
- `GET /api/genomes/:genomeId/chromosomes` — Get chromosome list  
- `GET /api/sequence` — Get genomic sequence  

### Gene Information
- `GET /api/genes/search` — Search for genes  
- `GET /api/genes/:geneId` — Get gene details  

### Variant Analysis
- `POST /api/analyze` — Analyze a genetic variant  
- `GET /api/variants` — Search ClinVar variants  

---

## Contributing
1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

---

## License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- The **Evo2 model** from the Arc Institute  
- The **PyTorch** and **Next.js** communities  
- All contributors who helped improve this project  
