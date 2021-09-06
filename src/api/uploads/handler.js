const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      // dapatkan data pd request.payload yg mrpkn Readable
      const { data } = request.payload;
      // eslint-disable-next-line no-underscore-dangle
      console.log(data.hapi, data._data);
      // validasi nilai data.hapi.headers
      this._validator.validateImageHeaders(data.hapi.headers);
      // setelah proses validasi, lgsg tulis berkas yg dikirim pd storage
      // melalui fungsi writeFile pada this._service.writeFile
      // berikan data sbg parameter file dan data.hapi sbg parameter meta
      const filename = await this._service.writeFile(data, data.hapi);

      // fungsi writeFile mengembalikan nama berkas (filename) yg ditulis
      // manfaatkan nama berkas ini dlm membuat nilai fileLocation
      // dan mengembalikannya sbg response
      const response = h.response({
        status: 'success',
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
        },
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
      return response;
    }
  }
}

module.exports = UploadsHandler;
