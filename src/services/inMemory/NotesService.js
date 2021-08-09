const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
  constructor() {
    this._notes = [];
  }

  // Method untuk menambah catatan
  addNote({ title, body, tags }) {
    // variabel ID dihasilkan dari library nanoid
    // nanoid akan men-generate string ID yang unik
    const id = nanoid(16);
    /**
     * variabel createdAt akan diisi dengan format tanggal (2011-10-05T14:48:00.000Z)
     */
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      title,
      tags,
      body,
      id,
      createdAt,
      updatedAt,
    };

    // isi array this._notes dengan variabel newNote
    this._notes.push(newNote);

    // Pastikan variabel newNote yg membawa data catatan masuk ke dalam array this._notes
    // Gunakan fungsi filter untuk mencari catatan berdasarkan id catatan yang baru saja dibuat
    const isSuccess = this._notes.filter((note) => note.id === id).length > 0;

    // Jika tidak ada catatan yg masuk munculkan error
    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    // sebaliknya, kembalikan fungsi dengan nilai id catatan baru
    return id;
  }

  // Method untuk membaca/mengambil seluruh catatan yang disimpan
  getNotes() {
    return this._notes;
  }

  // Method untuk membaca/mengambil catatan berdasarkan id yang diberikan
  getNoteById(id) {
    // gunakan fungsi filter untuk mengambil catatan berdasarkan id
    const note = this._notes.filter((n) => n.id === id)[0];

    // lakukan pengecekan jika tidak ada catatan yang disimpan berdasarkan id
    // munculkan error
    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    // sebaliknya, kembalikan fungsi dengan nilai catatan
    return note;
  }

  // Method untuk mengubah data catatan yang disimpan
  editNoteById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    // merubah tanggal pada variabel updatedAt dengan tanggal dieditnya catatan
    const updatedAt = new Date().toISOString();

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }

    this._notes.splice(index, 1);
  }
}

module.exports = NotesService;
