Kriteria proyek

1. Web Server dpt menyimpan catatan

   - Tidak menggunakan database.
   - Cukup simpan pada memory server dlm bentuk array JS

   * Struktur Catatan:

   ```
   {
     id: string,
     title: string,
     createdAt: string,
     updatedAt: string,
     tags: array of string,
     body: string
   }
   ```

   Contoh Data:

   ```
   {
     id: 'notes-V1StGXR8_Z5jdHi6B-myT',
     title: 'Sejarah JavaScript',
     createdAt: '2020-12-23T23:00:09.686Z',
     updatedAt: '2020-12-23T23:00:09.686Z',
     tags: ['NodeJS', 'JavaScript'],
     body: 'JavaScript pertama kali dikembangkan oleh Brendan Eich dari Netscape di bawah nama Mocha, yang nantinya namanya diganti menjadi LiveScript, dan akhirnya menjadi JavaScript. Navigator sebelumnya telah mendukung Java untuk lebih bisa dimanfaatkan para pemrogram yang non-Java.',
   }
   ```

   - route path '/notes' & method POST
   - utk menyimpan/menambahkan notes, client mengirim req ke path & method tsb
     dgn membawa data JSON berikut pada req.body:

   ```
   {
     "title": "Judul Catatan",
     "tags": ["Tag 1", "Tag 2"],
     "body": "Konten catatan"
   }
   ```

   - utk properti id, createdAt, & updatedAt diolah disisi server. properti id
     harus selalu unik.
   - jika req berhasil dilakukan, res dari server harus memiliki status code 201
     (created) dan mengembalikan data dlm bentuk JSON dgn format berikut:

   ```
   {
     "status": "success",
     "message": "Catatan berhasil ditambahkan",
     "data": {
       "noteId": "V09YExygSUYogwWJ"
     }
   }
   ```

   - Nilai dari properti noteId diambil dari properti id yg dibuat secara unik.
   - Bila req gagal, statusCode 500 dan kembalikan dgn data JSON dgn format
     berikut:

   ```
   {
     "status": "error",
     "message": "Catatan gagal untuk ditambahkan"
   }
   ```

2. Web Server dpt menampilkan catatan

   - Mengirim seluruh/secara spesifik data notes yg disimpan.
   - Ketika client melakukan req pada path '/notes' dgn method 'GET'
   - server res statusCode 200 (OK) serta seluruh data notes dlm bentuk array
     JSON. Contoh:

   ```
   {
     "status": "success",
     "data": {
       "notes": [
        {
          "id":"notes-V1StGXR8_Z5jdHi6B-myT",
          "title":"Catatan 1",
          "createdAt":"2020-12-23T23:00:09.686Z",
          "updatedAt":"2020-12-23T23:00:09.686Z",
          "tags":[
            "Tag 1",
            "Tag 2"
          ],
          "body":"Isi dari catatan 1"
        },
        {
          "id":"notes-V1StGXR8_98apmLk3mm1",
          "title":"Catatan 2",
          "createdAt":"2020-12-23T23:00:09.686Z",
          "updatedAt":"2020-12-23T23:00:09.686Z",
          "tags":[
            "Tag 1",
            "Tag 2"
          ],
          "body":"Isi dari catatan 2"
        }
       ]
     }
   }
   ```

   - Jika belum ada catatan:

   ```
   {
    "status": "success",
    "data": {
      "notes": []
    }
   }
   ```

   - client mendapatkan data secara spesifik menggunakan id melalui path
     '/notes/{id}' dgn method 'GET'.
   - server res statusCode 200 (OK) serta nilai satu objek catatan dlm bentuk
     JSON:

   ```
   {
    "status": "success",
    "data": {
      "note": {
        "id":"notes-V1StGXR8_Z5jdHi6B-myT",
        "title":"Catatan 1",
        "createdAt":"2020-12-23T23:00:09.686Z",
        "updatedAt":"2020-12-23T23:00:09.686Z",
        "tags":[
          "Tag 1",
          "Tag 2"
        ],
        "body":"Isi dari catatan 1"
      }
    }
   }
   ```

   - Bila client melampirkan id catatan yg tidak ditemukan.
   - server res statusCode 404 (Not Found) dan data dlm bentuk JSON:

   ```
   {
     "status": "fail",
     "message": "Catatan tidak ditemukan"
   }
   ```

3. Web Server dapat mengubah catatan
   - Bisa perubahan judul, isi, ataupun tag catatan.
   - client membuat req ke path '/notes/{id}' dgn method 'PUT'
   ```
   {
    "title":"Judul Catatan Revisi",
    "tags":[
      "Tag 1",
      "Tag 2"
    ],
    "body":"Konten catatan"
   }
   ```
   - Jika berhasil statusCode 200 (OK) dan membawa data JSON objek pada body
     respons
   ```
   {
    "status": "success",
    "message": "Catatan berhasil diperbaharui"
   }
   ```
   - Perubahan data catatan harus disimpan ke catatan yg sesuai dengan id yg
     digunakan pada path parameter.
   - Bila id catatan tidak ditemukan, server respon statusCode 404 (Not Found)
     dan data JSON:
   ```
   {
    "status": "fail",
    "message": "Gagal memperbarui catatan. Id catatan tidak ditemukan"
   }
   ```
4. Web Server dpt menghapus catatan
   - Untuk menghapus catatan, client membuat req pada path '/notes/{id}' dgn
     method 'DELETE'
   - Ketika berhasil server res statusCode 200 (OK) serta data JSON berikut:
   ```
   {
    "status": "success",
    "message": "Catatan berhasil dihapus"
   }
   ```
   - Catatan yg dihapus harus sesuai dengan id catatan yg digunakan client pada
     path parameter. Bila id catatan tidak ditemukan, server res statusCode 404
     (Not Found) dan membawa data JSON berikut:
   ```
   {
    "status": "fail",
    "message": "Catatan gagal dihapus. Id catatan tidak ditemukan"
   }
   ```
