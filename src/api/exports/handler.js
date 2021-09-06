const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    try {
      await this._validator.validateExportNotesPayload(request.payload);

      // membuat objek message yg akan dikirim ke queue
      // di dalamnya, sediakan kebutuhan yg diperlukan oleh consumer
      // (mendapatkan dan mengirimkan catatan melalui email)
      // maka sediakan userId (utk mendapatkan seluruh catatan yg pengguna miliki)
      // targetEmail (utk mengirimkan pesan melalui email)
      const message = {
        userId: request.auth.credentials,
        targetEmail: request.payload.targetEmail,
      };
      // kirim pesan ke queue menggunakan this._service.sendMessage
      await this._service.sendMessage('export:notes', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
