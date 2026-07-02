FROM continuumio/miniconda3

WORKDIR /app

# Install RDKit and scientific packages from conda-forge
RUN conda install -y -c conda-forge \
    python=3.11 \
    rdkit \
    numpy \
    pandas \
    scikit-learn \
    pip && \
    conda clean -afy

COPY requirements.txt .

RUN pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    requests \
    python-multipart

COPY . .

EXPOSE 10000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]