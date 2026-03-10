class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //it will return true or false depending upon the comparison'result so you dont need to write succes : true or success:false all the time
  }
}

export { ApiResponse };
