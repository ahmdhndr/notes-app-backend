const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class NotesService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  // Fungsi untuk menambah catatan
  // eslint-disable-next-line object-curly-newline
  async addNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Objek untuk memasukan catatan baru ke database
    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
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
  async getNotes(owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
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

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = NotesService;
