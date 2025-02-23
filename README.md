# Nobohub Canvas

Nobohub Canvas adalah platform yang mengumpulkan ide-ide dari kreator atau pengembang.

## Fitur

- **Pengumpulan Ide**: Platform untuk mengumpulkan dan mengorganisir ide-ide kreatif.
- **Kolaborasi**: Memungkinkan kolaborasi antara berbagai pengembang dan kreator.
- **Antarmuka Ramah Pengguna**: Desain antarmuka yang intuitif dan mudah digunakan.

## Instalasi

1. **Kloning repositori**:

   ```bash
   git clone https://github.com/avezoor/open.nobohub.git
   cd open.nobohub
   ```

2. **Buat dan aktifkan virtual environment**:

   ```bash
   python -m venv env
   source env/bin/activate  # Untuk Unix/macOS
   # atau
   env\Scripts\activate.bat  # Untuk Windows
   ```

3. **Instal dependensi**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Jalankan aplikasi**:

   ```bash
   python app.py
   ```

   Aplikasi akan berjalan di `http://127.0.0.1:5000/`.

## Dependensi

Pastikan Anda memiliki paket-paket berikut:

```
Flask
Jinja2
Werkzeug
```

Jika ada tambahan dependensi, gunakan perintah berikut untuk memperbarui `requirements.txt`:

```bash
pip freeze > requirements.txt
```

## Kontribusi

Kontribusi sangat diterima. Silakan fork repositori ini dan buat pull request dengan perubahan yang Anda usulkan.

## Lisensi

Proyek ini dilisensikan di bawah [CC BY 4.0 License](LICENSE).

