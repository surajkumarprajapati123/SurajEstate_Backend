class ApiResponce {
  constructor(StatusCode, data, message) {
    this.StatusCode = StatusCode;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponce;
