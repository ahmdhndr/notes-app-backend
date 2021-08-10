const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  // Fungsi untuk menambah catatan
  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Objek untuk memasukan catatan baru ke database
    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt],
    };

    // Eksekusi query yg sudah dibuat, gunakan fungsi this._pool.query
    const result = await this._pool.query(query);

    /**
     * Pastikan catatan berhasil dimasukkan ke database
     * Evaluasi nilai dari result.rows[0].id (karena kita melakukan returning id pada query)
     * Jika nilai id tidak undefined, berarti catatan berhasil dimasukkan
     * kembalikan fungsi dengan nilai id yang baru dibuat
     * Jika undefined/gagal bangkitkan InvariantError
     */

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // Fungsi untuk mengambil semua data catatan yg ada di database
  async getNotes() {
    const result = await this._pool.query('SELECT * FROM notes');
    return result.rows.map(mapDBToModel);
  }

  // Fungsi untuk mengambil satu data catatan
  async getNoteById(id) {
    // Lakukan query untuk mendapatkan catatan berdasar id yg diberikan
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    // Jika false, bangkitkan NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    // Jika true kembalikan dengan result.rows[0]
    // yg sudah di mapping dgn fungsi mapDBToModel
    return result.rows.map(mapDBToModel)[0];
  }

  // Fungsi untuk merubah catatan berdasarkan id
  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  // Fungsi untuk menghapus catatan
  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;
