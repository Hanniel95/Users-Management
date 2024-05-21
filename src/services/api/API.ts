class API {
  static API_URL = `${'http://localhost:3333/'}`;

  static getHeaders = (isFile?: boolean) => {
    let headers = new Headers();
    if (!isFile) {
      headers.append("Content-Type", "application/json");
    }
    headers.append("Accept", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Origin", "*");
    headers.append("Credentials", "same-origin");

    return headers;
  };

  static postRequest = async (url: string, body: object) => {
    let head = API.getHeaders();

    let headers: RequestInit = {
      method: "POST",
      headers: head,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body),
    };

    let result;

    await fetch(this.API_URL + url, headers)
      .then((response) => {
        result = this.handleSuccessRequest(response);
      })
      .catch((err: any) => {
        console.log(err);
        result = this.handleErrorRequest(
          "Une erreur s'est produite, veuillez reessayer plus tard."
        );
      });

    return result;
  };

  static postFileRequest = async (url: string, body: FormData) => {
    let head = API.getHeaders(true);

    let headers: RequestInit = {
      method: "POST",
      headers: head,
      mode: "cors",
      cache: "default",
      body: body,
    };
    let response = await fetch(this.API_URL + url, headers)
      .then(async (response: any) => {
        return await this.handleSuccessRequest(response);
      })
      .catch(async (err: any) => {
        return await this.handleErrorRequest(err);
      });
    return response;
  };

  static putFileRequest = async (url: string, body: FormData) => {
    let head = API.getHeaders(true);

    let headers: RequestInit = {
      method: "PUT",
      headers: head,
      mode: "cors",
      cache: "default",
      body: body,
    };
    let response = await fetch(this.API_URL + url, headers)
      .then((response: any) => {
        return response;
      })
      .catch((err: any) => {
        return API.handleErrorRequest(err);
      });
    return response;
  };

  static putRequest = async (url: string, body: object) => {
    let head = API.getHeaders();

    let headers: RequestInit = {
      method: "PUT",
      headers: head,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body),
    };

    let result;

    await fetch(this.API_URL + url, headers)
      .then((response) => {
        result = this.handleSuccessRequest(response);
      })
      .catch((err: any) => {
        result = this.handleErrorRequest(
          "Une erreur s'est produite, veuillez reessayer plus tard."
        );
      });

    return result;
  };

  static patchRequest = async (url: string, body: object) => {
    let head = API.getHeaders();

    let headers: RequestInit = {
      method: "PATCH",
      headers: head,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body),
    };
    let response = await fetch(this.API_URL + url, headers)
      .then((response: any) => {
        return response;
      })
      .catch((err: any) => {
        return API.handleErrorRequest(err);
      });
    return response;
  };

  static deleteRequest = async (url: string, body: object) => {
    let head = API.getHeaders();

    let headers: RequestInit = {
      method: "DELETE",
      headers: head,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body),
    };
    let result;

    await fetch(this.API_URL + url, headers)
      .then((response) => {
        result = this.handleSuccessRequest(response);
      })
      .catch((err: any) => {
        result = this.handleErrorRequest(
          "Une erreur s'est produite, veuillez reessayer plus tard."
        );
      });

    return result;
  };

  static getRequest = async (url: string): Promise<any> => {
    let head = API.getHeaders();

    let headers: RequestInit = {
      method: "GET",
      headers: head,
      mode: "cors",
      cache: "default",
    };

    let result;

    await fetch(this.API_URL + url, headers)
      .then((response) => {
        result = this.handleSuccessRequest(response);
      })
      .catch((err: any) => {
        result = this.handleErrorRequest(
          "Une erreur s'est produite, veuillez reessayer plus tard."
        );
      });

    return result;
  };

  static handleSuccessRequest = async (response: any) => {
    let result;
    if (!response.ok) {
      await response
        .json()
        .then((data: any) => {
          if (data?.error) {
            throw new Error(data?.message);
          } else {
            throw new Error(
              "Une erreur s'est produite, veuillez reessayer plus tard."
            );
          }
        })
        .catch((err: any) => {
          result = this.handleErrorRequest(err.message || err);
        });
    } else {
      await response
        .json()
        .then((data: any) => {
          if (data.error) {
            throw new Error(data?.message);
          } else {
            result = Promise.resolve(data);
          }
        })
        .catch((err: any) => {
          result = this.handleErrorRequest(err);
        });
    }

    return result;
  };

  static handleErrorRequest = (error: any) => {
    return Promise.reject(error.message || error);
  };
}

export default API;
